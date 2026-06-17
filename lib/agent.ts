/**
 * Client-side Vision Agent helpers (safe for the mobile bundle).
 *
 * These call our own authenticated Expo API routes (`app/api/agent/**`) to
 * start / stop the AI teacher on the lesson call. They never touch the Stream
 * secret or the Vision Agent server URL — that all lives server-side in
 * `lib/agent.server.ts`.
 *
 * Identity + the call id are derived on the server from the Clerk session, so
 * the client only sends the `lessonId` (and, for stop, the `sessionId` it got
 * back from start).
 */
import type { GetToken } from "@/lib/stream";

/** Build an absolute URL to an API route (mirrors `lib/stream.ts`). */
function apiUrl(path: string): string {
  const base = process.env.EXPO_PUBLIC_API_URL ?? "";
  return `${base}${path}`;
}

async function authHeaders(getToken: GetToken): Promise<Record<string, string>> {
  const token = await getToken();
  if (!token) {
    throw new Error("You need to be signed in to start the AI teacher.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error ?? fallback;
  } catch {
    return fallback;
  }
}

/** Ask the server to start the AI teacher on this lesson's call. */
export async function startLessonAgent(
  getToken: GetToken,
  lessonId: string,
): Promise<{ sessionId: string }> {
  const res = await fetch(apiUrl("/api/agent/start"), {
    method: "POST",
    headers: await authHeaders(getToken),
    body: JSON.stringify({ lessonId }),
  });
  if (!res.ok) {
    throw new Error(await readError(res, "Could not start the AI teacher."));
  }
  return (await res.json()) as { sessionId: string };
}

/** Tell the server to stop the AI teacher session (best-effort cleanup). */
export async function stopLessonAgent(
  getToken: GetToken,
  lessonId: string,
  sessionId: string,
): Promise<void> {
  const res = await fetch(apiUrl("/api/agent/stop"), {
    method: "POST",
    headers: await authHeaders(getToken),
    body: JSON.stringify({ lessonId, sessionId }),
  });
  if (!res.ok) {
    throw new Error(await readError(res, "Could not stop the AI teacher."));
  }
}
