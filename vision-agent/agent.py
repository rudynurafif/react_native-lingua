"""
AI Language Teacher — a voice-only Vision Agent.

Transport : Stream Edge (getstream.Edge)
Brain     : OpenAI Realtime (native speech-to-speech, lowest latency)

The teacher ALWAYS speaks English and teaches the selected target language
*through* English (explanations, encouragement and corrections are in English;
only the words/phrases being practised are in the target language).

When the mobile app starts a session it packs the whole lesson (language, goals,
vocabulary, phrases and the teacher persona) into the Stream call's `custom`
data. On join we read that back and tailor the teacher's instructions to the
exact lesson the learner opened.

Run it:
    uv run agent.py run      # console + browser demo UI (local dev)
    uv run agent.py serve    # HTTP server (production) — used by the Expo app
"""

import asyncio
import logging
import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

# Reuse STREAM_API_KEY / STREAM_API_SECRET from the Expo app's .env (the parent
# folder), then layer this folder's .env on top to add OPENAI_API_KEY (and any
# local overrides). override=True lets the local file win for shared keys.
_ROOT = Path(__file__).resolve().parent
load_dotenv(_ROOT.parent / ".env")
load_dotenv(_ROOT / ".env", override=True)

from vision_agents.core import Agent, AgentLauncher, Runner, User  # noqa: E402
from vision_agents.core.instructions import Instructions  # noqa: E402
from vision_agents.plugins import getstream, openai  # noqa: E402

logger = logging.getLogger(__name__)

# Fallback language for the standalone service (when no lesson custom data is
# present, e.g. the local `run` demo). The mobile app always supplies one.
DEFAULT_LANGUAGE = os.getenv("TEACH_LANGUAGE", "Spanish")

# Custom call-event tag for live captions. The mobile app listens for events
# with this `kind` via `call.on("custom", ...)` and renders them as subtitles.
CAPTION_EVENT_KIND = "lesson.caption"

# Voice-activity / turn-taking config for the realtime session.
#
# We use `server_vad` (silence-based) instead of the plugin's default
# `semantic_vad`. In a "repeat after me" lesson the learner often answers with a
# single short word like "hola", which semantic_vad sometimes drops because it
# doesn't look like a complete thought — so the teacher seems to ignore them.
# server_vad just waits for a short pause, so every short answer is heard.
#
# Tuning knobs if needed:
#   - silence_duration_ms: raise it if the agent cuts you off before you finish.
#   - threshold: raise it (e.g. 0.6) if background/mic noise triggers false turns
#     (handy on a glitchy emulator mic); lower it if quiet speech is missed.
REALTIME_SESSION: dict[str, Any] = {
    "type": "realtime",
    "audio": {
        "input": {
            "transcription": {"model": "gpt-4o-mini-transcribe"},
            "turn_detection": {
                "type": "server_vad",
                "threshold": 0.5,
                "prefix_padding_ms": 300,
                "silence_duration_ms": 600,
                "create_response": True,
                "interrupt_response": True,
            },
        },
    },
}


def build_instructions(ctx: dict[str, Any]) -> str:
    """Build the teacher's system prompt from the lesson's custom call data.

    `ctx` is the call's `custom` dict packed by the Expo `/api/stream/call`
    route. Every field is optional so this still works for the bare demo.
    """
    language = str(ctx.get("languageName") or DEFAULT_LANGUAGE)
    persona = str(ctx.get("aiTeacherPrompt") or "")
    title = str(ctx.get("lessonTitle") or "")
    goals = ctx.get("goals") or []
    vocabulary = ctx.get("vocabulary") or []
    phrases = ctx.get("phrases") or []

    lines: list[str] = [
        f"You are a warm, upbeat, real-life {language} teacher sitting with one "
        "learner. You sound human and genuinely happy to be teaching them.",
        "",
        "Rules you must always follow:",
        "1. This is a live, back-and-forth conversation — never a lecture or a "
        "recording. Say ONE short thing, then STOP talking and wait silently for "
        "the learner to answer. Never give two pieces of information in a row "
        "without hearing from them first.",
        "2. Always end your turn with a clear cue and then go quiet — for "
        'example, "Can you try saying it?" Do not answer for the learner, and do '
        "not keep going until they have spoken.",
        "3. When the learner speaks, react to what they actually said: warmly "
        "praise what was right, gently fix what was off.",
        "4. KEEP MOVING. Once the learner says an item correctly — or after at "
        "most two tries — praise them and move ON to the NEXT word or phrase in "
        "the lesson. Never ask for the same word more than twice in a row; don't "
        "get stuck drilling one item.",
        "5. Work through ALL of this lesson's words and phrases, roughly in "
        "order. When you've practised them all, tell the learner they've finished "
        "this lesson, congratulate them warmly, and wrap up — don't invent extra "
        "drills or loop forever. If they say they've got it, sound bored, or ask "
        "to move on, advance to the next item right away.",
        "6. Speak mostly in English, the way a real teacher talks out loud — "
        "warm, natural and energetic. Use contractions like you're, let's and "
        "that's, and keep sentences short.",
        f"7. Teach {language} through English: bring in ONE {language} word or "
        f"short phrase at a time, say it slowly, give its English meaning, then "
        "ask the learner to say it back — and wait for them.",
        "8. Stay strictly inside THIS lesson's goal, vocabulary and phrases. "
        f"Don't drift to other topics or other words, and never switch to a "
        f"language other than English or {language}.",
        "9. Keep every turn to one or two short, conversational sentences. This "
        "is spoken, not written — one idea at a time.",
        "10. Be genuinely encouraging and human — celebrate small wins with real "
        "warmth and a bit of energy.",
        "Do not use markdown, emojis or special characters — your words are "
        "spoken aloud. Never narrate your own planning out loud (no \"let me "
        "think how to...\"); just talk to the learner.",
    ]

    if persona:
        lines += ["", "Teacher persona and focus for this lesson:", persona]
    if title:
        lines += ["", f"Lesson: {title}"]

    if goals:
        lines += ["", "Learning goals:"]
        lines += [f"- {goal}" for goal in goals]

    if vocabulary:
        lines += ["", "Vocabulary to drill (target = English [pronunciation]):"]
        for item in vocabulary:
            word = item.get("word", "")
            translation = item.get("translation", "")
            phonetic = item.get("phonetic", "")
            suffix = f" [{phonetic}]" if phonetic else ""
            lines.append(f"- {word} = {translation}{suffix}")

    if phrases:
        lines += ["", "Phrases to practise (target = English [pronunciation]):"]
        for item in phrases:
            text = item.get("text", "")
            translation = item.get("translation", "")
            phonetic = item.get("phonetic", "")
            suffix = f" [{phonetic}]" if phonetic else ""
            lines.append(f"- {text} = {translation}{suffix}")

    lines += [
        "",
        "Stay focused on this lesson's vocabulary and phrases only. Start with a "
        "short, warm hello and ONE invitation to try the first word — then stop "
        "and wait for the learner to answer before you say anything else.",
    ]
    return "\n".join(lines)


def create_agent() -> Agent:
    """Build the voice-only teacher agent (per session)."""
    return Agent(
        edge=getstream.Edge(),
        # This id MUST match AGENT_USER_ID in lib/stream.server.ts so the admin
        # membership we set on the call applies to the user the agent connects as.
        agent_user=User(id="ai-teacher", name="AI Language Teacher"),
        # Default instructions; replaced per-lesson in join_call once we've read
        # the call's custom data.
        instructions=build_instructions({}),
        # OpenAI Realtime = native speech-to-speech, so NO separate stt/tts.
        # send_video=False keeps this a voice-only lesson (no camera frames).
        # realtime_session swaps the default semantic_vad for a tuned server_vad
        # so short answers like "hola" are always heard (see REALTIME_SESSION).
        llm=openai.Realtime(
            voice="marin",
            send_video=False,
            realtime_session=REALTIME_SESSION,
        ),
    )


def forward_live_captions(agent: Agent) -> None:
    """Relay every spoken transcript to the call so the app can show live captions.

    With OpenAI Realtime there is no separate STT step we can subscribe to: the
    user's and the teacher's transcripts surface only when the framework writes
    them into the agent's `conversation`. So we wrap `conversation.upsert_message`
    — after each transcript is recorded we send a tiny custom event to everyone on
    the call (`kind=lesson.caption`). The mobile app listens via
    `call.on("custom", ...)`.

    The send is fire-and-forget (a background task) so it never adds latency to
    the realtime speech pipeline, which calls `upsert_message` on the hot path.
    """
    conversation = agent.conversation
    if conversation is None:
        logger.warning("No conversation on the agent; live captions disabled")
        return

    original_upsert = conversation.upsert_message
    pending: set[asyncio.Task[None]] = set()

    async def upsert_and_caption(*args: Any, **kwargs: Any):
        message = await original_upsert(*args, **kwargs)

        # The realtime flow always calls upsert with keyword arguments.
        role = kwargs.get("role", "")
        completed = bool(kwargs.get("completed", True))
        text = (message.content or "").strip()

        # Only the two human-visible roles become captions ("user" = the learner,
        # "assistant" = the AI teacher). System/empty messages are skipped.
        if text and role in ("user", "assistant"):
            payload = {
                "kind": CAPTION_EVENT_KIND,
                "speaker": "teacher" if role == "assistant" else "learner",
                "text": text,
                "final": completed,
                "id": message.id,
            }
            task = asyncio.create_task(_send_caption(agent, payload))
            pending.add(task)
            task.add_done_callback(pending.discard)

        return message

    conversation.upsert_message = upsert_and_caption  # type: ignore[method-assign]


async def _send_caption(agent: Agent, payload: dict[str, Any]) -> None:
    """Best-effort delivery of one caption event; never crash the pipeline."""
    try:
        # Bound the send so a stalled network call can't keep this background
        # task (and its slot in `pending`) alive forever and leak memory.
        await asyncio.wait_for(agent.edge.send_custom_event(payload), timeout=5.0)
    except asyncio.TimeoutError:
        logger.warning("Timed out forwarding live caption")
    except Exception:
        logger.exception("Failed to forward live caption")


async def join_call(agent: Agent, call_type: str, call_id: str) -> None:
    """Lifecycle: read the lesson, go live, greet the learner, run until it ends."""
    call = await agent.create_call(call_type, call_id)

    # Read the lesson context the mobile app stored in the call's custom data.
    ctx: dict[str, Any] = {}
    try:
        response = await call.get()
        ctx = dict(response.data.call.custom or {})
    except Exception:
        logger.exception("Could not read call custom data; using defaults")

    # Tailor the teacher to this exact lesson before the realtime session opens.
    #
    # IMPORTANT: setting `agent.instructions` alone is NOT enough. The Agent only
    # pushes instructions to the LLM once, at construction (via _attach_agent →
    # llm.set_instructions), using the *default* instructions. If we just reassign
    # `agent.instructions` here, the realtime session that `agent.join()` opens
    # still carries those defaults — so the teacher ignores the chosen language
    # and lesson and falls back to the Spanish placeholder. We must re-push the
    # per-lesson instructions to the LLM ourselves, before join/connect.
    instructions = Instructions(input_text=build_instructions(ctx))
    agent.instructions = instructions
    agent.llm.set_instructions(instructions)

    language = str(ctx.get("languageName") or DEFAULT_LANGUAGE)
    logger.info(
        "📚 Lesson loaded — language=%s, title=%s, vocab=%d, phrases=%d",
        language,
        ctx.get("lessonTitle") or "(default/fallback)",
        len(ctx.get("vocabulary") or []),
        len(ctx.get("phrases") or []),
    )

    # audio_room calls start in backstage; go live so the agent (admin role) can
    # publish audio. Best-effort — the call may already be live.
    try:
        await call.go_live()
    except Exception:
        logger.exception("go_live failed (the call may already be live)")

    async with agent.join(call):
        # Stream each transcript to the call as a custom event so the mobile app
        # can show live captions for both the learner and the teacher. Set up
        # before the greeting so the teacher's first words are captioned too.
        forward_live_captions(agent)

        await agent.simple_response(
            f"Give a short, warm, upbeat hello in English, introduce yourself as "
            f"their {language} teacher for this lesson, and invite them to try "
            "just the first word with you. Then STOP and wait for them to speak — "
            "say only one or two sentences and do not continue on your own."
        )
        await agent.finish()


if __name__ == "__main__":
    Runner(AgentLauncher(create_agent=create_agent, join_call=join_call)).cli()
