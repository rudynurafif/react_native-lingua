/**
 * POST /api/agent/stop
 *
 * Stops the AI teacher session started by `/api/agent/start`. The call id is
 * re-derived from the verified Clerk session + `lessonId`, and the `sessionId`
 * (returned by start) identifies which agent session to close. Proxies a DELETE
 * to the Vision Agent server.
 *
 * Auth: `Authorization: Bearer <clerk session token>`.
 * Body: `{ lessonId: string, sessionId: string }`
 */
import {
  AgentNotConfiguredError,
  stopAgentSession,
} from "@/lib/agent.server";
import {
  getAuthenticatedUserId,
  lessonCallId,
  UnauthorizedError,
} from "@/lib/stream.server";

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request);

    const body = (await request.json().catch(() => ({}))) as {
      lessonId?: string;
      sessionId?: string;
    };
    if (!body.lessonId || !body.sessionId) {
      return Response.json(
        { error: "lessonId and sessionId are required." },
        { status: 400 },
      );
    }

    const callId = lessonCallId(body.lessonId, userId);
    await stopAgentSession(callId, body.sessionId);

    return Response.json({ ok: true });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return Response.json({ error: err.message }, { status: 401 });
    }
    if (err instanceof AgentNotConfiguredError) {
      return Response.json({ error: err.message }, { status: 503 });
    }
    console.error("[/api/agent/stop] error:", err);
    return Response.json(
      { error: "Failed to stop the AI teacher." },
      { status: 502 },
    );
  }
}
