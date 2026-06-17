/**
 * Client-side Stream helpers (safe for the mobile bundle).
 *
 * These talk to our own Expo API routes (`app/api/stream/**`) — they never touch
 * the Stream secret. Every call forwards the Clerk session token so the server
 * can verify who is asking and derive the Stream user id itself.
 *
 * The server counterpart lives in `lib/stream.server.ts`.
 */

/** Client-safe Stream API key (mirrors the server's STREAM_API_KEY). */
export const STREAM_API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY ?? "";

/** A function that returns the current Clerk session token (from `useAuth`). */
export type GetToken = () => Promise<string | null>;

/**
 * Build an absolute URL to an API route.
 *
 * On web the dev server and the app share an origin, so a relative path works.
 * On a device/emulator there is no origin, so set `EXPO_PUBLIC_API_URL` to the
 * dev-server LAN URL (e.g. http://192.168.1.10:8081) and we prefix it here.
 */
function apiUrl(path: string): string {
  const base = process.env.EXPO_PUBLIC_API_URL ?? "";
  return `${base}${path}`;
}

/** Attach the Clerk bearer token; throws a friendly error if the user is signed out. */
async function authHeaders(getToken: GetToken): Promise<Record<string, string>> {
  const token = await getToken();
  if (!token) {
    throw new Error("You need to be signed in to start a lesson call.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Fetch a fresh Stream user token for the signed-in user. Used both for the
 * initial connection and as the SDK's `tokenProvider` on refresh.
 */
export async function fetchStreamToken(getToken: GetToken): Promise<string> {
  const res = await fetch(apiUrl("/api/stream/token"), {
    method: "POST",
    headers: await authHeaders(getToken),
  });
  if (!res.ok) {
    const message = await readError(res, "Could not get a Stream token.");
    throw new Error(message);
  }
  const data = (await res.json()) as { token: string };
  return data.token;
}

export type LessonCall = { callId: string; callType: string };

/**
 * Ask the server to create (or reuse) the audio call for this lesson + user and
 * return its id so the screen can join it.
 */
export async function createLessonCall(
  getToken: GetToken,
  lesson: { lessonId: string; languageId: string; lessonTitle?: string },
): Promise<LessonCall> {
  const res = await fetch(apiUrl("/api/stream/call"), {
    method: "POST",
    headers: await authHeaders(getToken),
    body: JSON.stringify(lesson),
  });
  if (!res.ok) {
    const message = await readError(res, "Could not start the lesson call.");
    throw new Error(message);
  }
  return (await res.json()) as LessonCall;
}

/** Pull a useful message out of an error response, falling back to a default. */
async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error ?? fallback;
  } catch {
    return fallback;
  }
}
