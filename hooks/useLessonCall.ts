/**
 * useLessonCall — owns the Stream call lifecycle for one audio lesson, plus the
 * AI teacher (Vision Agent) that joins the same call.
 *
 * Responsibilities:
 *   - ask our API route to create/reuse the lesson's audio call (server-side),
 *   - create the `Call` instance exactly once (`reuseInstance: true`) and join,
 *   - start the Vision Agent on that same call so the AI teacher joins, exposing
 *     a coarse `agentStatus` (idle → connecting → connected / failed),
 *   - leave the call + stop the agent on End or when the screen unmounts
 *     (guarded so we never leave/stop twice), and award the lesson's XP once.
 *
 * The fine-grained "connecting vs joined vs reconnecting" call state is read
 * inside `<StreamCall>` via `useCallStateHooks`; this hook exposes the coarser
 * setup `status` (and `agentStatus`) usable outside the call context.
 */
import { useAuth } from "@clerk/expo";
import {
  Call,
  CallingState,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useCallback, useEffect, useRef, useState } from "react";

import { startLessonAgent, stopLessonAgent } from "@/lib/agent";
import { createLessonCall } from "@/lib/stream";
import { useProgressStore } from "@/store/useProgressStore";
import type { Lesson } from "@/types/learning";

export type LessonCallStatus =
  | "unavailable" // no Stream client (signed out / Expo Go / missing key)
  | "idle" // ready, waiting for the user to start
  | "starting" // creating + joining the call
  | "active" // joined (live call card takes over for finer state)
  | "ended" // left the call (lesson completed)
  | "error"; // setup failed

/** Connection state of the AI teacher (Vision Agent) on the call. */
export type AgentStatus =
  | "idle" // not started yet
  | "connecting" // asked the server to spin the agent up
  | "connected" // agent session is running on the call
  | "failed"; // could not start the agent (the call still works)

export function useLessonCall(lesson: Lesson) {
  const client = useStreamVideoClient();
  const { getToken } = useAuth();
  const router = useRouter();
  const posthog = usePostHog();
  const completeLesson = useProgressStore((s) => s.completeLesson);

  const [call, setCall] = useState<Call>();
  const [status, setStatus] = useState<LessonCallStatus>(
    client ? "idle" : "unavailable",
  );
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const completedRef = useRef(false);

  // Id of the running Vision Agent session, kept so we can stop exactly the
  // session we started (and avoid stopping twice).
  const agentSessionRef = useRef<string | null>(null);

  // Latest token getter + lesson id, read from the unmount cleanup (which runs
  // with empty deps, so it must not close over stale values).
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;
  const lessonIdRef = useRef(lesson.id);
  lessonIdRef.current = lesson.id;

  // If the Stream client connects (or drops) after first render, keep the
  // idle/unavailable status honest — but don't disturb an in-progress call.
  useEffect(() => {
    setStatus((prev) => {
      if (!client && prev === "idle") return "unavailable";
      if (client && prev === "unavailable") return "idle";
      return prev;
    });
  }, [client]);

  /** Start the AI teacher on the call. Fire-and-forget: never blocks the call. */
  const connectAgent = useCallback(async () => {
    setAgentStatus("connecting");
    try {
      const { sessionId } = await startLessonAgent(() => getToken(), lesson.id);
      agentSessionRef.current = sessionId;
      setAgentStatus("connected");
      posthog.capture("lesson_agent_started", {
        lesson_id: lesson.id,
        language_code: lesson.languageId,
      });
    } catch (err) {
      console.error("Failed to start AI teacher", err);
      setAgentStatus("failed");
    }
  }, [getToken, lesson.id, lesson.languageId, posthog]);

  /** Stop the AI teacher session if one is running (best-effort). */
  const disconnectAgent = useCallback(async () => {
    const sessionId = agentSessionRef.current;
    if (!sessionId) return;
    agentSessionRef.current = null;
    setAgentStatus("idle");
    await stopLessonAgent(() => getToken(), lesson.id, sessionId).catch((err) =>
      console.error("Failed to stop AI teacher", err),
    );
  }, [getToken, lesson.id]);

  const start = useCallback(async () => {
    if (!client) {
      setStatus("unavailable");
      return;
    }
    setError(null);
    setStatus("starting");
    try {
      const { callId, callType } = await createLessonCall(() => getToken(), {
        lessonId: lesson.id,
        languageId: lesson.languageId,
        lessonTitle: lesson.title,
      });

      // Create the Call instance exactly once. `reuseInstance` returns the
      // cached one if it already exists in the SDK.
      const c = client.call(callType, callId, { reuseInstance: true });
      // Survive brief network drops instead of ending the call.
      c.setDisconnectionTimeout(60);
      setCall(c);

      // The call was already reserved server-side, so join without `create`.
      await c.join({ create: false });
      setStatus("active");
      posthog.capture("lesson_call_started", {
        lesson_id: lesson.id,
        language_code: lesson.languageId,
      });

      // Now bring the AI teacher into the same call. Don't await — the user can
      // already speak; the agent connection status surfaces separately.
      void connectAgent();
    } catch (err) {
      console.error("Failed to start lesson call", err);
      setError(err instanceof Error ? err.message : "Could not start the call.");
      setStatus("error");
    }
  }, [client, getToken, lesson, posthog, connectAgent]);

  const end = useCallback(async () => {
    // Stop the AI teacher first so it leaves the room with the user.
    await disconnectAgent();

    if (call && call.state.callingState !== CallingState.LEFT) {
      await call.leave().catch((err) => console.error("Leave failed", err));
    }
    if (!completedRef.current) {
      completedRef.current = true;
      completeLesson(lesson.id, lesson.xpReward);
      posthog.capture("lesson_completed", {
        lesson_id: lesson.id,
        language_code: lesson.languageId,
        xp: lesson.xpReward,
        via: "audio_call",
      });
    }
    setStatus("ended");
    if (router.canGoBack()) router.back();
    else router.push("/learn");
  }, [call, completeLesson, disconnectAgent, lesson, posthog, router]);

  // Guarded leave on unmount (e.g. the header back button) so a call never
  // keeps publishing audio after the screen is gone.
  useEffect(() => {
    return () => {
      if (call && call.state.callingState !== CallingState.LEFT) {
        call.leave().catch((err) => console.error("Leave on unmount failed", err));
      }
    };
  }, [call]);

  // Stop the AI teacher on final unmount too, in case the screen is torn down
  // without going through `end()` (e.g. hardware back). Uses refs so it always
  // sees the latest token getter / lesson id.
  useEffect(() => {
    return () => {
      const sessionId = agentSessionRef.current;
      if (sessionId) {
        agentSessionRef.current = null;
        stopLessonAgent(() => getTokenRef.current(), lessonIdRef.current, sessionId).catch(
          (err) => console.error("Stop AI teacher on unmount failed", err),
        );
      }
    };
  }, []);

  return { call, status, agentStatus, error, start, end };
}
