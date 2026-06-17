---
name: Agent
description: Use when building real-time voice and video AI agents, integrating with LLMs and AI providers, deploying agents to production, adding function calling and tools, or implementing RAG and custom processors.
metadata:
    mintlify-proj: agent
    version: "1.0"
---

# Vision Agents Skill

## Product Summary

Vision Agents is a Python framework for building real-time voice and video AI agents. It provides a modular architecture where you compose an `Agent` with an LLM, optional STT/TTS services, video processors, and integrations with 30+ AI providers. The framework handles conversation flow, real-time audio/video processing, tool calling, and deployment. Key files: `main.py` (agent definition), `.env` (API keys), `pyproject.toml` (dependencies). CLI: `uv run agent.py run` (console mode) or `uv run agent.py serve` (HTTP server). Primary docs: https://visionagents.ai

## When to Use

Reach for this skill when:
- Building voice agents that respond naturally via speech (STT → LLM → TTS pipeline or realtime models)
- Creating video agents that analyze camera feeds with VLMs or computer vision processors
- Integrating agents with external tools, APIs, or knowledge bases via function calling
- Deploying agents to production with Docker, Kubernetes, or HTTP servers
- Adding phone integration (Twilio), RAG (TurboPuffer, Gemini FileSearch), or custom processors
- Choosing between realtime models (lowest latency) vs. custom pipelines (full control)
- Testing agent behavior without spinning up audio/video infrastructure
- Scaling agents horizontally across multiple nodes with session management

## Quick Reference

### Agent Constructor

```python
from vision_agents.core import Agent, User
from vision_agents.plugins import getstream, gemini, deepgram, elevenlabs

agent = Agent(
    edge=getstream.Edge(),                    # Transport layer
    agent_user=User(name="Assistant", id="agent"),
    instructions="You're a helpful assistant",
    llm=gemini.LLM(),                         # Text LLM
    stt=deepgram.STT(),                       # Speech-to-text (optional)
    tts=elevenlabs.TTS(),                     # Text-to-speech (optional)
    processors=[],                            # Video/audio processors
    mcp_servers=[],                           # External tools
)
```

### Core Methods

| Method | Purpose |
|--------|---------|
| `async join(call)` | Join a call (context manager) |
| `await agent.simple_response(text)` | Send text prompt, get LLM response |
| `await agent.say(text)` | Speak text directly (bypass LLM) |
| `await agent.finish()` | Wait for call to end |
| `await agent.close()` | Clean up resources |

### CLI Commands

| Command | Purpose |
|---------|---------|
| `uv run agent.py run` | Console mode (single agent, browser UI) |
| `uv run agent.py serve` | HTTP server mode (production) |
| `--video-track-override=/path/video.mp4` | Test with local video file |
| `--host 0.0.0.0 --port 8000` | Server host/port |

### Plugin Installation

```bash
# Install only what you need
uv add "vision-agents[getstream,gemini,deepgram,elevenlabs]"
```

### Environment Variables

```bash
# Required for most providers
STREAM_API_KEY=...
STREAM_API_SECRET=...
GOOGLE_API_KEY=...
DEEPGRAM_API_KEY=...
ELEVENLABS_API_KEY=...
```

### Function Registration

```python
@llm.register_function(description="Get weather for a location")
async def get_weather(location: str) -> dict:
    return {"temp": "22C", "condition": "Sunny"}
```

## Decision Guidance

### Realtime vs. Custom Pipeline

| Aspect | Realtime Models | Custom Pipeline |
|--------|-----------------|-----------------|
| **Latency** | Lowest (native speech-to-speech) | Higher (separate STT/TTS) |
| **Setup** | Simplest (one LLM plugin) | More config (STT + LLM + TTS) |
| **Control** | Less (built-in STT/TTS) | Full (swap any provider) |
| **Use Case** | Voice agents, fastest path | Complex workflows, specific providers |
| **Example** | `gemini.Realtime()` | `gemini.LLM() + deepgram.STT() + elevenlabs.TTS()` |

**Choose Realtime if:** You want the fastest voice agent with minimal setup (Gemini, OpenAI, Qwen, xAI all support it).  
**Choose Custom if:** You need specific STT/TTS providers, function calling with custom logic, or video analysis.

### Video: Realtime vs. VLM vs. Processors

| Approach | Best For | How It Works |
|----------|----------|-------------|
| **Realtime** | Lowest latency video analysis | Stream frames directly to model (Gemini, OpenAI) |
| **VLM** | Video understanding, reasoning | Buffer frames + chat completions API (NVIDIA, HuggingFace) |
| **Processors** | Object detection, pose estimation | Run ML pipeline, forward results to LLM (YOLO, Roboflow) |

**Choose Realtime if:** You need sub-second latency and the model supports video natively.  
**Choose VLM if:** You need detailed video understanding and can tolerate 1-2 second latency.  
**Choose Processors if:** You need specific computer vision tasks (pose, detection) alongside LLM reasoning.

### Deployment Path

| Stage | Command/Setup | When |
|-------|---------------|------|
| **Local dev** | `uv run agent.py run` | Testing, debugging |
| **HTTP server** | `uv run agent.py serve` | Single container, local testing |
| **Docker** | Dockerfile + `docker build` | Single container deployment |
| **Horizontal scaling** | Redis session registry | Multiple replicas, session sharing |
| **Kubernetes** | Helm chart + health probes | Production with monitoring |

## Workflow

### Building a Voice Agent

1. **Initialize project** — `uv init --python 3.12 my-agent && uv add "vision-agents[getstream,gemini,deepgram,elevenlabs]"`
2. **Create `.env`** — Add `STREAM_API_KEY`, `STREAM_API_SECRET`, `GOOGLE_API_KEY`, `DEEPGRAM_API_KEY`, `ELEVENLABS_API_KEY`
3. **Define `create_agent()`** — Return an `Agent` with edge, LLM, STT, TTS
4. **Define `join_call()`** — Specify what happens when agent joins (e.g., `await agent.simple_response("Greet the user")`)
5. **Wrap in `Runner`** — Use `Runner(AgentLauncher(create_agent=..., join_call=...)).cli()`
6. **Test locally** — `uv run agent.py run` opens browser UI
7. **Add tools** — Register functions with `@llm.register_function()`
8. **Deploy** — Containerize and run `uv run agent.py serve` in production

### Adding Function Calling

1. **Register function** — Use `@llm.register_function(description="...")` decorator
2. **Async only** — Function must be `async def`, not sync
3. **Type hints** — Include parameter types and return type
4. **Test** — Use `TestSession` to verify tool calls without audio/video
5. **Multi-round** — Set `max_tool_rounds=5` on LLM if model needs to call multiple tools

### Adding RAG

1. **Choose backend** — Gemini FileSearch (simple) or TurboPuffer (full control)
2. **Initialize store** — `store = gemini.GeminiFilesearchRAG(name="...")` or `turbopuffer.TurboPufferRAG(...)`
3. **Add documents** — `await store.add_directory("./knowledge")`
4. **Register as function** — Wrap search in `@llm.register_function()` or pass as tool
5. **Test** — Verify agent retrieves and uses knowledge in responses

### Deploying to Production

1. **Create Dockerfile** — Use Python 3.12, install dependencies, run `uv run agent.py serve`
2. **Set environment** — Pass API keys via secrets or `.env` file
3. **Health checks** — GET `/health` (liveness), `/ready` (readiness)
4. **Scale horizontally** — Add Redis session registry if running multiple replicas
5. **Monitor** — Enable telemetry with OpenTelemetry, scrape Prometheus metrics
6. **Kubernetes** — Use provided Helm chart or deploy as StatefulSet with Redis

## Common Gotchas

- **Async functions only** — `@llm.register_function()` requires `async def`, not sync. Sync functions raise `ValueError`.
- **Realtime mode disables STT/TTS** — If using `gemini.Realtime()`, don't pass `stt=` or `tts=` parameters; they're ignored.
- **Stream account required** — Vision Agents needs a Stream account for real-time transport. Free tier available at getstream.io.
- **API key loading** — Use `load_dotenv()` before creating agents; plugins auto-load from environment.
- **Turn detection conflicts** — If STT plugin has built-in turn detection (Deepgram, ElevenLabs), don't pass separate `turn_detection=` parameter.
- **Video override loops** — `--video-track-override` plays the file in a loop at 30 FPS; useful for reproducible testing.
- **Session limits** — Set `max_concurrent_sessions` to prevent resource exhaustion in production.
- **Close operations are async** — DELETE `/calls/{call_id}/sessions/{session_id}` returns HTTP 202; session closes on next maintenance cycle, not immediately.
- **Custom FastAPI app** — If providing `ServeOptions(fast_api=app)`, you must register all endpoints yourself; Runner won't add defaults.
- **Processor chaining** — Processors run sequentially; order matters (e.g., detection before analysis).

## Verification Checklist

Before submitting agent code:

- [ ] All required API keys are in `.env` and loaded with `load_dotenv()`
- [ ] `create_agent()` returns an `Agent` instance with required parameters (`edge`, `llm`, `agent_user`)
- [ ] `join_call()` is async and calls `await agent.join(call)` as context manager
- [ ] Registered functions are `async def` with type hints and descriptions
- [ ] STT/TTS plugins are not passed when using realtime models
- [ ] Agent runs locally with `uv run agent.py run` without errors
- [ ] HTTP server starts with `uv run agent.py serve --host 0.0.0.0 --port 8000`
- [ ] Health checks pass: `curl http://localhost:8000/health`
- [ ] Function calls are tested with `TestSession` (no audio/video needed)
- [ ] Dockerfile builds and runs the agent in a container
- [ ] Environment variables are passed to container (not hardcoded)
- [ ] Metrics endpoint works: `curl http://localhost:8000/calls/{call_id}/sessions/{session_id}/metrics`

## Resources

**Comprehensive navigation:** https://visionagents.ai/llms.txt — Full page-by-page listing for agent reference.

**Critical documentation:**
- [Quickstart](https://visionagents.ai/introduction/quickstart) — Build your first agent in 5 minutes
- [Voice Agents](https://visionagents.ai/introduction/voice-agents) — Realtime vs. custom pipeline modes
- [Agent Class Reference](https://visionagents.ai/core/agent-core) — Constructor, lifecycle, event system
- [Integrations Overview](https://visionagents.ai/integrations/introduction-to-integrations) — 30+ providers, plugin selection
- [HTTP Server & Deployment](https://visionagents.ai/guides/http-server) — Production setup, session management
- [Function Calling & MCP](https://visionagents.ai/guides/mcp-tool-calling) — Register tools, external services
- [Testing](https://visionagents.ai/guides/testing) — Test agents without audio/video

---

> For additional documentation and navigation, see: https://visionagents.ai/llms.txt