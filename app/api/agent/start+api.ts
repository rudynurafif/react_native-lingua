/**
 * POST /api/agent/start
 *
 * Starts the AI teacher (Vision Agent) on the signed-in user's lesson call. We
 * derive the call id from the verified Clerk session + `lessonId` (never trust a
 * raw call id from the body), then proxy to the Vision Agent server. The Stream
 * secret and the agent server URL stay server-side.
 *
 * Auth: `Authorization: Bearer <clerk session token>`.
 * Body: `{ lessonId: string }`
 * Returns: `{ sessionId: string }`
 */
import {
  AgentNotConfiguredError,
  startAgentSession,
} from "@/lib/agent.server";
import {
  getAuthenticatedUserId,
  LESSON_CALL_TYPE,
  lessonCallId,
  UnauthorizedError,
} from "@/lib/stream.server";

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request);

    const body = (await request.json().catch(() => ({}))) as { lessonId?: string };
    if (!body.lessonId) {
      return Response.json({ error: "lessonId is required." }, { status: 400 });
    }

    const callId = lessonCallId(body.lessonId, userId);
    const { sessionId } = await startAgentSession(callId, LESSON_CALL_TYPE);

    return Response.json({ sessionId });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return Response.json({ error: err.message }, { status: 401 });
    }
    if (err instanceof AgentNotConfiguredError) {
      // 503: the call still works, the AI teacher just isn't available.
      return Response.json({ error: err.message }, { status: 503 });
    }
    console.error("[/api/agent/start] error:", err);
    return Response.json(
      { error: "Failed to start the AI teacher." },
      { status: 502 },
    );
  }
}
