/**
 * useLiveCaptions — live subtitles for an audio lesson call.
 *
 * The Vision Agent (see `vision-agent/agent.py`) forwards every spoken
 * transcript — the learner's and the AI teacher's — to the call as a custom
 * event tagged `kind: "lesson.caption"`. This hook listens for those events via
 * `call.on("custom", ...)` and keeps the most recent lines so the screen can
 * render them as they happen.
 *
 * Must be used inside a `<StreamCall>` so `useCall()` returns the live call.
 */
import { useCall } from "@stream-io/video-react-native-sdk";
import { useEffect, useState } from "react";

/** Who is speaking — the AI teacher or the learner. */
export type CaptionSpeaker = "teacher" | "learner";

export type LiveCaption = {
  /** Stable id (the agent's transcript message id) used to de-dupe/update. */
  id: string;
  speaker: CaptionSpeaker;
  text: string;
  /** False while still streaming, true once the utterance is finalized. */
  final: boolean;
};

/** Shape of the `custom` payload our agent sends with each caption. */
type CaptionPayload = {
  kind?: string;
  speaker?: CaptionSpeaker;
  text?: string;
  final?: boolean;
  id?: string;
};

const CAPTION_EVENT_KIND = "lesson.caption";

/** Retain the running transcript; the panel scrolls through it. Capped only to
 *  bound memory over a very long session. */
const MAX_CAPTIONS = 100;

export function useLiveCaptions(): LiveCaption[] {
  const call = useCall();
  const [captions, setCaptions] = useState<LiveCaption[]>([]);

  useEffect(() => {
    if (!call) return;

    // Fresh start whenever the call instance changes (e.g. a new lesson).
    setCaptions([]);

    const unsubscribe = call.on("custom", (event) => {
      const payload = (event as { custom?: CaptionPayload }).custom;
      if (!payload || payload.kind !== CAPTION_EVENT_KIND) return;

      const text = payload.text?.trim();
      const speaker = payload.speaker;
      if (!text || (speaker !== "teacher" && speaker !== "learner")) return;

      const caption: LiveCaption = {
        id: payload.id ?? `${speaker}-${text}`,
        speaker,
        text,
        final: payload.final ?? true,
      };
      setCaptions((prev) => upsertCaption(prev, caption));
    });

    return unsubscribe;
  }, [call]);

  return captions;
}

/** Replace a caption with the same id (streaming update) or append a new one. */
function upsertCaption(prev: LiveCaption[], next: LiveCaption): LiveCaption[] {
  const index = prev.findIndex((c) => c.id === next.id);
  if (index !== -1) {
    const copy = prev.slice();
    copy[index] = next;
    return copy;
  }
  return [...prev, next].slice(-MAX_CAPTIONS);
}
