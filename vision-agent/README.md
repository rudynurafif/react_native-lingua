# vision-agent — AI Language Teacher (voice only)

A Python [Vision Agents](https://visionagents.ai) service that acts as the app's
AI language teacher. It is **voice only**:

- **Transport:** Stream Edge (`getstream.Edge`)
- **Brain:** OpenAI Realtime (`openai.Realtime`) — native speech-to-speech, so no
  separate STT/TTS and the lowest possible latency.

The teacher **always speaks English** and teaches the selected target language
*through* English: it introduces a word/phrase in the target language, then
explains and corrects in English.

## Requirements

- Python **3.12** (managed automatically by `uv`)
- [`uv`](https://docs.astral.sh/uv/) — `pip install uv`
- A Stream account and an OpenAI account **with Realtime quota/billing enabled**

## Setup

Dependencies are already declared in `pyproject.toml`. Install them with:

```bash
uv sync
```

### Environment

Secrets load in two layers (see the top of `agent.py`):

1. `../.env` — the Expo app's env file. `STREAM_API_KEY` and `STREAM_API_SECRET`
   are **reused** from here, so you don't duplicate them.
2. `./.env` — this folder. Add the teacher-only keys here:

```bash
OPENAI_API_KEY=sk-...      # OpenAI Realtime — required
TEACH_LANGUAGE=Spanish     # optional; language taught (English is always spoken)
```

See [.env.example](.env.example). `.env` and `.venv/` are gitignored.

## Run

```bash
# Local dev: single agent + browser demo UI
uv run agent.py run

# Without opening the browser demo
uv run agent.py run --no-demo

# Production: HTTP server that spawns an agent per call
uv run agent.py serve --host 0.0.0.0 --port 8000
# Liveness check:
curl http://localhost:8000/health   # -> 200
```

## How it works

`agent.py` exposes the two callbacks the Vision Agents `Runner` needs:

- `create_agent()` builds the `Agent(edge=getstream.Edge(), llm=openai.Realtime(...))`.
  `send_video=False` keeps it voice-only.
- `join_call(agent, call_type, call_id)` is the lifecycle: it awaits
  `agent.create_call(...)`, enters `async with agent.join(call):`, greets the
  learner with `agent.simple_response(...)`, then `agent.finish()`.

The Expo app creates a Stream call and the device joins it; this service joins
the same call as the `ai-teacher` user and talks to the learner.

## Notes / gotchas verified against the installed SDK (vision-agents 0.6.4)

- `agent.create_call()` is **async** — it must be `await`ed (its type hint says
  `-> Call` but it returns a coroutine).
- `agent.join(call)` is an `@asynccontextmanager` → use `async with agent.join(call):`.
- With OpenAI Realtime, do **not** pass `stt=`/`tts=` — they're ignored.
- If you see OpenAI `429 insufficient_quota` on join, the code is fine — the
  OpenAI account needs Realtime billing/quota.
