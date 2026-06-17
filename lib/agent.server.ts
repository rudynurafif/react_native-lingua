/**
 * SERVER-ONLY Vision Agent helpers.
 *
 * ⚠️ Never import this from a screen, component, hook or store — it only runs in
 * the Expo Router API routes under `app/api/agent/**+api.ts`.
 *
 * These talk to the Vision Agent HTTP server (the Python service started with
 * `uv run agent.py serve`). That server exposes a small REST API for session
 * lifecycle:
 *
 *   - start:  POST   {base}/calls/{callId}/sessions      body { call_type }
 *   - stop:   DELETE {base}/calls/{callId}/sessions/{sessionId}
 *
 * The base URL is `VISION_AGENT_URL` (server-only, no EXPO_PUBLIC_ prefix). An
 * optional `VISION_AGENT_API_KEY` is sent as a bearer token if the agent server
 * is protected. The mobile app never sees any of this — it only calls our own
 * authenticated `/api/agent/**` routes.
 */

const VISION_AGENT_URL = process.env.VISION_AGENT_URL;
const VISION_AGENT_API_KEY = process.env.VISION_AGENT_API_KEY;

/** Thrown when the Vision Agent service is not configured. */
export class AgentNotConfiguredError extends Error {
  constructor(message = "Vision Agent service is not configured.") {
    super(message);
    this.name = "AgentNotConfiguredError";
  }
}

function agentBaseUrl(): string {
  if (!VISION_AGENT_URL) {
    throw new AgentNotConfiguredError(
      "Missing VISION_AGENT_URL. Point it at the running Vision Agent server, e.g. http://localhost:8000.",
    );
  }
  // Trim a trailing slash so we can join paths predictably.
  return VISION_AGENT_URL.replace(/\/+$/, "");
}

function agentHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (VISION_AGENT_API_KEY) {
    headers.Authorization = `Bearer ${VISION_AGENT_API_KEY}`;
  }
  return headers;
}

export type AgentSession = { sessionId: string };

/**
 * Ask the Vision Agent server to spin up an agent session that joins `callId`.
 * Returns the new session id, which the caller must keep so it can stop it.
 */
export async function startAgentSession(
  callId: string,
  callType: string,
): Promise<AgentSession> {
  const res = await fetch(`${agentBaseUrl()}/calls/${encodeURIComponent(callId)}/sessions`, {
    method: "POST",
    headers: agentHeaders(),
    body: JSON.stringify({ call_type: callType }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Vision Agent failed to start a session (${res.status}). ${detail}`.trim(),
    );
  }

  const data = (await res.json().catch(() => ({}))) as {
    session_id?: string;
    sessionId?: string;
  };
  const sessionId = data.session_id ?? data.sessionId;
  if (!sessionId) {
    throw new Error("Vision Agent did not return a session id.");
  }
  return { sessionId };
}

/**
 * Tell the Vision Agent server to close a session. Best-effort: the server
 * returns 202 and shuts the session down on its next maintenance cycle.
 */
export async function stopAgentSession(
  callId: string,
  sessionId: string,
): Promise<void> {
  const res = await fetch(
    `${agentBaseUrl()}/calls/${encodeURIComponent(callId)}/sessions/${encodeURIComponent(sessionId)}`,
    { method: "DELETE", headers: agentHeaders() },
  );

  // 202 Accepted is the documented success; treat any 2xx as fine.
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Vision Agent failed to stop session ${sessionId} (${res.status}). ${detail}`.trim(),
    );
  }
}
