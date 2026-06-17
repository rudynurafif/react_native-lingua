/**
 * SERVER-ONLY Stream helpers.
 *
 * ⚠️ Never import this file from a screen, component, hook, store, or anything
 * that ends up in the mobile bundle. It reads `STREAM_API_SECRET` and
 * `CLERK_SECRET_KEY`, which must never reach the device. It is imported only by
 * the Expo Router API routes under `app/api/stream/**+api.ts`, which run on the
 * server.
 *
 * Responsibilities:
 *   - build the Stream server client (signs tokens, creates calls)
 *   - verify the caller's Clerk session and return their *trusted* user id
 *   - derive the deterministic call id for a (lesson, user) pair
 *
 * The golden rule (see the Stream skill RULES): the Stream `user_id` is always
 * derived here from the verified Clerk session — never taken from the request
 * body — so a signed-in user can only ever mint a token for themselves.
 */
import { verifyToken } from "@clerk/backend";
import { StreamClient } from "@stream-io/node-sdk";

const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

/**
 * The Stream call type used for audio lessons.
 *
 * `audio_room` is Stream's built-in voice-room type: privileged roles (host /
 * admin) can publish audio, and the room is opened with `goLive`. We make the
 * learner the **host** and the AI teacher an **admin** (see `call+api.ts`), so
 * both can speak while plain listeners cannot.
 */
export const LESSON_CALL_TYPE = "audio_room";

/**
 * Stream user id of the AI teacher (the Vision Agent). Must match the
 * `agent_user` id in `vision-agent/agent.py` so the membership + role we set on
 * the call line up with the user the agent actually connects as.
 */
export const AGENT_USER_ID = "ai-teacher";

/** Token lifetime — 4h, the value Stream recommends; the SDK auto-refreshes. */
const TOKEN_TTL_SECONDS = 60 * 60 * 4;

/** Reused across requests in the same server process. */
let serverClient: StreamClient | null = null;

/** Lazily build (and cache) the Stream server client, validating env first. */
export function getStreamServerClient(): StreamClient {
  if (!STREAM_API_KEY || !STREAM_API_SECRET) {
    throw new Error(
      "Missing STREAM_API_KEY / STREAM_API_SECRET. Add them to your .env (server-side, no EXPO_PUBLIC_ prefix on the secret).",
    );
  }
  if (!serverClient) {
    serverClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);
  }
  return serverClient;
}

/** Thrown when the caller has no valid Clerk session. Routes turn this into 401. */
export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Verify the Clerk session token from the `Authorization: Bearer <token>` header
 * and return the authenticated Clerk user id. This is the only trusted source
 * of identity in the API routes.
 */
export async function getAuthenticatedUserId(request: Request): Promise<string> {
  if (!CLERK_SECRET_KEY) {
    throw new Error(
      "Missing CLERK_SECRET_KEY. The API routes need it to verify the signed-in user.",
    );
  }

  const header = request.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    throw new UnauthorizedError("Missing Authorization bearer token.");
  }

  try {
    const payload = await verifyToken(token, { secretKey: CLERK_SECRET_KEY });
    if (!payload.sub) throw new UnauthorizedError("Token has no subject.");
    return payload.sub;
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;
    throw new UnauthorizedError("Invalid or expired session token.");
  }
}

/**
 * Deterministic, collision-free call id for a (lesson, user) pair. Stream call
 * ids may only contain `[0-9a-zA-Z_-]`, so we sanitize and clamp to 64 chars.
 * Same lesson + same user → same call every time (so re-joining a lesson resumes
 * the same room), while different users get isolated calls.
 */
export function lessonCallId(lessonId: string, userId: string): string {
  const safe = (value: string) => value.replace(/[^0-9a-zA-Z_-]/g, "_");
  return `lesson_${safe(lessonId)}__${safe(userId)}`.slice(0, 64);
}

export { TOKEN_TTL_SECONDS };
