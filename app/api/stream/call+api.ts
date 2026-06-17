/**
 * POST /api/stream/call
 *
 * Creates (or reuses) the audio-room Stream call for a lesson and the signed-in
 * Clerk user, then returns its id so the app can join it. The call is reserved
 * server-side with `getOrCreate`, with:
 *   - the user as creator + **host** member (can publish audio),
 *   - the AI teacher (Vision Agent) as an **admin** member (can publish audio
 *     and `goLive`), and
 *   - the full lesson teaching context stored in the call's `custom` data so the
 *     agent can read it on join (language, goals, vocabulary, phrases, persona).
 *
 * Auth: `Authorization: Bearer <clerk session token>`. Identity (the Stream
 * user id and the call id) is derived from the verified session — the body only
 * carries which lesson is being opened.
 *
 * Body: `{ lessonId: string, languageId: string, lessonTitle?: string }`
 */
import { getLanguage } from "@/data/languages";
import { getLesson } from "@/data/lessons";
import {
  AGENT_USER_ID,
  getAuthenticatedUserId,
  getStreamServerClient,
  LESSON_CALL_TYPE,
  lessonCallId,
  UnauthorizedError,
} from "@/lib/stream.server";

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request);

    const body = (await request.json().catch(() => ({}))) as {
      lessonId?: string;
      languageId?: string;
      lessonTitle?: string;
    };

    if (!body.lessonId || !body.languageId) {
      return Response.json(
        { error: "lessonId and languageId are required." },
        { status: 400 },
      );
    }

    // Look up the lesson server-side (the content is hardcoded, not secret) so
    // we can pack its teaching material into the call for the agent to read.
    const lesson = getLesson(body.lessonId);
    if (!lesson) {
      return Response.json({ error: "Unknown lesson." }, { status: 404 });
    }
    const language = getLanguage(lesson.languageId);

    const client = getStreamServerClient();
    const callId = lessonCallId(body.lessonId, userId);
    const call = client.video.call(LESSON_CALL_TYPE, callId);

    await call.getOrCreate({
      data: {
        created_by_id: userId,
        members: [
          // The learner hosts the room so they can publish audio immediately.
          { user_id: userId, role: "host" },
          // The AI teacher joins as admin so it can publish audio + goLive.
          { user_id: AGENT_USER_ID, role: "admin" },
        ],
        // Everything the Vision Agent needs to teach this exact lesson. Read
        // back on the Python side via `call.get()` → `response.data.call.custom`.
        custom: {
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          languageId: lesson.languageId,
          languageName: language?.name ?? lesson.languageId,
          languageNativeName: language?.nativeName ?? "",
          goals: lesson.goals,
          vocabulary: lesson.vocabulary.map((v) => ({
            word: v.word,
            translation: v.translation,
            phonetic: v.phonetic ?? "",
          })),
          phrases: lesson.phrases.map((p) => ({
            text: p.text,
            translation: p.translation,
            phonetic: p.phonetic ?? "",
          })),
          aiTeacherPrompt: lesson.aiTeacherPrompt,
        },
        // Audio-only lesson: mic on, routed to the loudspeaker. We don't touch
        // the video settings (Stream then validates target_resolution); the
        // call stays audio-only because the client never enables the camera.
        settings_override: {
          audio: { mic_default_on: true, default_device: "speaker" },
        },
      },
    });

    return Response.json({ callId, callType: LESSON_CALL_TYPE });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return Response.json({ error: err.message }, { status: 401 });
    }
    console.error("[/api/stream/call] error:", err);
    return Response.json(
      { error: "Failed to create the lesson call." },
      { status: 500 },
    );
  }
}
