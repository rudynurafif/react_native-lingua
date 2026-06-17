/**
 * POST /api/stream/token
 *
 * Returns a fresh Stream user token for the **signed-in Clerk user**. The mobile
 * app wires this as the Stream `tokenProvider`, so the SDK calls it again
 * whenever the token nears expiry — the device never sees the Stream secret.
 *
 * Auth: `Authorization: Bearer <clerk session token>`. The user id is taken from
 * the verified session, never from the request body.
 */
import {
  getAuthenticatedUserId,
  getStreamServerClient,
  TOKEN_TTL_SECONDS,
  UnauthorizedError,
} from "@/lib/stream.server";

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request);
    const client = getStreamServerClient();

    const token = client.generateUserToken({
      user_id: userId,
      validity_in_seconds: TOKEN_TTL_SECONDS,
    });

    return Response.json({
      apiKey: process.env.STREAM_API_KEY,
      userId,
      token,
    });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return Response.json({ error: err.message }, { status: 401 });
    }
    console.error("[/api/stream/token] error:", err);
    return Response.json(
      { error: "Failed to generate Stream token." },
      { status: 500 },
    );
  }
}
