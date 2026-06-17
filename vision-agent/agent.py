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
        f"You are a friendly, patient AI language teacher helping a learner "
        f"practise {language}.",
        "",
        "Rules you must always follow:",
        "1. ALWAYS speak in English. All explanations, instructions, praise and "
        "corrections are in English.",
        f"2. Teach {language} *through* English: introduce a word or short "
        f"phrase in {language}, say it slowly, then explain its meaning and use "
        "in English.",
        "3. Keep replies short and conversational — this is a spoken lesson, not "
        "an essay. One idea at a time.",
        "4. Gently correct mistakes, then have the learner try again.",
        "5. Be encouraging and warm. Celebrate small wins.",
        "Do not use markdown, emojis or special characters — your words are "
        "spoken aloud.",
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
        "Stay focused on this lesson's vocabulary and phrases. Begin by greeting "
        "the learner and inviting them to try the first item.",
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
        llm=openai.Realtime(voice="marin", send_video=False),
    )


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
    agent.instructions = Instructions(input_text=build_instructions(ctx))
    language = str(ctx.get("languageName") or DEFAULT_LANGUAGE)

    # audio_room calls start in backstage; go live so the agent (admin role) can
    # publish audio. Best-effort — the call may already be live.
    try:
        await call.go_live()
    except Exception:
        logger.exception("go_live failed (the call may already be live)")

    async with agent.join(call):
        await agent.simple_response(
            f"Warmly greet the learner in English, introduce yourself as their "
            f"{language} teacher for this lesson, and invite them to practise the "
            "first word or phrase. Keep it to one or two sentences."
        )
        await agent.finish()


if __name__ == "__main__":
    Runner(AgentLauncher(create_agent=create_agent, join_call=join_call)).cli()
