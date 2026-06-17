import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  CallingState,
  StreamCall,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { Image } from "@/components/Image";
import { LoadingImage } from "@/components/LoadingImage";
import { images } from "@/constants/images";
import { getFlagUrl, getLanguage } from "@/data/languages";
import { getLesson } from "@/data/lessons";
import {
  useLessonCall,
  type AgentStatus,
  type LessonCallStatus,
} from "@/hooks/useLessonCall";
import { useLiveCaptions, type LiveCaption } from "@/hooks/useLiveCaptions";
import { colors } from "@/theme";
import type { Language, Lesson, Phrase } from "@/types/learning";

/**
 * AI Teacher — audio lesson screen.
 *
 * An audio-only Stream call with the lesson's AI teacher. Opened from the
 * Lessons screen with a lesson id, it keeps pulling its content (title, goal,
 * phrases, teacher persona) from the hardcoded learning data, and now layers a
 * real Stream audio call on top: the user starts a call, joins, mutes/unmutes,
 * and ends it. Ending the call marks the lesson complete and awards its XP,
 * keeping the existing progress/unlock flow intact.
 *
 * Call setup (token + call creation) happens on our Expo API routes so the
 * Stream secret never ships to the device — see `lib/stream.server.ts`.
 */
export default function AudioLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const lesson = getLesson(id);

  const [activePhrase, setActivePhrase] = useState(0);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.push("/learn");
  };

  // The teacher's name is the first word of the persona prompt
  // ("You're Maria, a warm ..." or "You are Maria, ...") — handy for the header.
  const teacherName = useMemo(() => {
    if (!lesson) return "AI Teacher";
    return (
      lesson.aiTeacherPrompt.match(/You(?:'re| are) (\w+)/)?.[1] ?? "AI Teacher"
    );
  }, [lesson]);

  if (!lesson) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-h3 text-ink">Lesson not found</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={goBack}
            className="mt-4 rounded-full bg-primary px-6 py-2.5"
          >
            <Text className="text-h4 text-background">Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <LoadedAudioLesson
      lesson={lesson}
      teacherName={teacherName}
      activePhrase={activePhrase}
      onSelectPhrase={setActivePhrase}
      onBack={goBack}
      insetBottom={insets.bottom}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Screen body (lesson is guaranteed to exist here)                           */
/* -------------------------------------------------------------------------- */

type LoadedProps = {
  lesson: Lesson;
  teacherName: string;
  activePhrase: number;
  onSelectPhrase: (index: number) => void;
  onBack: () => void;
  insetBottom: number;
};

function LoadedAudioLesson({
  lesson,
  teacherName,
  activePhrase,
  onSelectPhrase,
  onBack,
  insetBottom,
}: LoadedProps) {
  const { call, status, agentStatus, error, start, end } = useLessonCall(lesson);

  const language = getLanguage(lesson.languageId);
  const phrase = lesson.phrases[activePhrase] ?? lesson.phrases[0];

  const header = HEADER_STATUS[status];
  const callActive = status === "active";

  // The persona prompt is written FOR the agent ("You're Maria, ..."). For the
  // on-screen blurb, flip the opening to first person so the teacher introduces
  // themselves to the learner ("I'm Maria, ...").
  const teacherIntro = lesson.aiTeacherPrompt.replace(
    /^You(?:'re| are)\b/,
    "I'm",
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={["top"]}>
      {/* ------------------------------------------------------------------
          Header — back, "AI Teacher" + live call status, flag
      ------------------------------------------------------------------ */}
      <View className="flex-row items-center px-5 pb-3 pt-1">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          className="h-10 w-10 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="text-h4 text-ink">AI Teacher</Text>
          <View className="mt-0.5 flex-row items-center">
            <View
              className="mr-1.5 h-2 w-2 rounded-full"
              style={{ backgroundColor: header.color }}
            />
            <Text className="text-caption text-ink-muted">
              {header.label}
              {language ? ` · ${language.name}` : ""}
            </Text>
          </View>
        </View>

        {/* Top-right slot: End Call while live, otherwise the language flag. */}
        {callActive ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={end}
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.error }}
            accessibilityRole="button"
            accessibilityLabel="End call"
          >
            <MaterialCommunityIcons
              name="phone-hangup"
              size={20}
              color="#ffffff"
            />
          </TouchableOpacity>
        ) : language ? (
          <LoadingImage
            uri={getFlagUrl(language, 160)}
            className="h-10 w-10 rounded-full"
            contentFit="cover"
          />
        ) : (
          <View className="h-10 w-10" />
        )}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 4,
          // Pad past the system navigation bar since this screen has no tab bar.
          paddingBottom: 32 + insetBottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ----------------------------------------------------------------
            Call card — live when joined, otherwise a start/connecting/error
            overlay. Only the card needs the <StreamCall> context.
        ---------------------------------------------------------------- */}
        {call ? (
          <StreamCall call={call}>
            <LiveCallCard
              lesson={lesson}
              language={language}
              phrase={phrase}
              agentStatus={agentStatus}
            />
          </StreamCall>
        ) : (
          <SetupCallCard
            lesson={lesson}
            phrase={phrase}
            status={status}
            error={error}
            onStart={start}
          />
        )}

        {/* ----------------------------------------------------------------
            Lesson goal
        ---------------------------------------------------------------- */}
        <Text className="text-h3 mt-7 text-ink">Lesson goal</Text>
        <View className="mt-2">
          {lesson.goals.map((goal) => (
            <View key={goal} className="mt-2 flex-row items-start">
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={colors.success}
                style={{ marginTop: 2 }}
              />
              <Text className="text-body-md ml-2 flex-1 text-ink">{goal}</Text>
            </View>
          ))}
        </View>

        {/* ----------------------------------------------------------------
            Phrases — tap to hear the teacher say it in the bubble above
        ---------------------------------------------------------------- */}
        {lesson.phrases.length > 0 && (
          <>
            <Text className="text-h3 mt-7 text-ink">Phrases to practice</Text>
            <View className="mt-2">
              {lesson.phrases.map((p, index) => {
                const selected = index === activePhrase;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => onSelectPhrase(index)}
                    className="mt-2 flex-row items-center rounded-2xl px-4 py-3"
                    style={{
                      borderWidth: 1,
                      borderColor: selected ? colors.primary : colors.border,
                      backgroundColor: selected ? "#F3F1FE" : "#ffffff",
                    }}
                  >
                    <View className="flex-1 pr-3">
                      <Text className="text-h4 text-ink">{p.text}</Text>
                      <Text className="text-body-sm mt-0.5 text-ink-muted">
                        {p.translation}
                      </Text>
                      {p.phonetic && (
                        <Text className="text-caption mt-0.5 text-ink-muted">
                          {p.phonetic}
                        </Text>
                      )}
                    </View>
                    <Ionicons
                      name={selected ? "volume-high" : "volume-medium-outline"}
                      size={20}
                      color={selected ? colors.primary : colors.inkMuted}
                    />
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {/* ----------------------------------------------------------------
            AI teacher context — who you're talking to + their focus
        ---------------------------------------------------------------- */}
        <Text className="text-h3 mt-7 text-ink">Your AI teacher</Text>
        <View className="mt-2 flex-row items-start rounded-2xl bg-surface p-4">
          <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white">
            <Image
              source={images.mascotLogo}
              className="h-11 w-11"
              contentFit="contain"
            />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-h4 text-ink">{teacherName}</Text>
            <Text className="text-body-sm mt-1 text-ink-muted">
              {teacherIntro}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/* Live call card — rendered inside <StreamCall>, reads real call state       */
/* -------------------------------------------------------------------------- */

type LiveCallCardProps = {
  lesson: Lesson;
  language?: Language;
  phrase?: Phrase;
  agentStatus: AgentStatus;
};

function LiveCallCard({
  lesson,
  phrase,
  agentStatus,
}: LiveCallCardProps) {
  const { useCallCallingState, useMicrophoneState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const { status: micStatus, isSpeakingWhileMuted } = useMicrophoneState();

  const call = useCall();

  // Live subtitles for both the learner and the AI teacher, streamed from the
  // Vision Agent as custom call events.
  const captions = useLiveCaptions();

  const muted = micStatus !== "enabled";
  const joined = callingState === CallingState.JOINED;
  const reconnecting =
    callingState === CallingState.RECONNECTING ||
    callingState === CallingState.JOINING;

  const banner = reconnecting
    ? { text: "Reconnecting…", tone: "warning" as const }
    : isSpeakingWhileMuted
      ? { text: "Hold the mic button to talk", tone: "info" as const }
      : null;

  return (
    <CallCard
      lesson={lesson}
      phrase={phrase}
      livePill={joined ? { text: "Live", color: colors.success } : null}
      teacherStatus={AGENT_STATUS[agentStatus]}
      banner={banner}
      captions={captions}
      talking={!muted}
      talkDisabled={!joined}
      // Push-to-talk: unmute only while the button is held, then mute again on
      // release. Mic stays muted otherwise so the teacher never echoes itself.
      onTalkStart={() => void call?.microphone.enable()}
      onTalkEnd={() => void call?.microphone.disable()}
      overlay={null}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Setup call card — before/around the live call (start, connecting, error)   */
/* -------------------------------------------------------------------------- */

type SetupCallCardProps = {
  lesson: Lesson;
  phrase?: Phrase;
  status: LessonCallStatus;
  error: string | null;
  onStart: () => void;
};

function SetupCallCard({
  lesson,
  phrase,
  status,
  error,
  onStart,
}: SetupCallCardProps) {
  return (
    <CallCard
      lesson={lesson}
      phrase={phrase}
      talking={false}
      talkDisabled
      onTalkStart={() => {}}
      onTalkEnd={() => {}}
      overlay={<SetupOverlay status={status} error={error} onStart={onStart} />}
    />
  );
}

/** The translucent overlay shown on the teacher scene before a call is live. */
function SetupOverlay({
  status,
  error,
  onStart,
}: {
  status: LessonCallStatus;
  error: string | null;
  onStart: () => void;
}) {
  if (status === "starting") {
    return (
      <OverlayShell>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-h4 mt-3 text-ink">Connecting…</Text>
        <Text className="text-body-sm mt-1 text-ink-muted">
          Setting up your audio call
        </Text>
      </OverlayShell>
    );
  }

  if (status === "error") {
    return (
      <OverlayShell>
        <View className="h-14 w-14 items-center justify-center rounded-full bg-error/10">
          <Ionicons name="warning" size={26} color={colors.error} />
        </View>
        <Text className="text-h4 mt-3 text-ink">Couldn&apos;t connect</Text>
        <Text className="text-body-sm mt-1 px-6 text-center text-ink-muted">
          {error ?? "Something went wrong starting the call."}
        </Text>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onStart}
          className="mt-4 flex-row items-center rounded-full bg-primary px-6 py-2.5"
        >
          <Ionicons name="refresh" size={18} color="#ffffff" />
          <Text className="text-h4 ml-1.5 text-background">Try again</Text>
        </TouchableOpacity>
      </OverlayShell>
    );
  }

  if (status === "unavailable") {
    return (
      <OverlayShell>
        <View className="h-14 w-14 items-center justify-center rounded-full bg-surface">
          <Ionicons name="cloud-offline" size={26} color={colors.inkMuted} />
        </View>
        <Text className="text-h4 mt-3 text-ink">Call unavailable</Text>
        <Text className="text-body-sm mt-1 px-6 text-center text-ink-muted">
          Sign in and open the app in a development build to start an audio call.
        </Text>
      </OverlayShell>
    );
  }

  if (status === "ended") {
    return (
      <OverlayShell>
        <View className="h-14 w-14 items-center justify-center rounded-full bg-success/10">
          <Ionicons name="checkmark-circle" size={28} color={colors.success} />
        </View>
        <Text className="text-h4 mt-3 text-ink">Lesson complete</Text>
      </OverlayShell>
    );
  }

  // idle — ready to start
  return (
    <OverlayShell>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onStart}
        className="h-16 w-16 items-center justify-center rounded-full bg-primary"
        style={styles.soft}
        accessibilityRole="button"
        accessibilityLabel="Start audio lesson"
      >
        <Ionicons name="call" size={28} color="#ffffff" />
      </TouchableOpacity>
      <Text className="text-h4 mt-3 text-ink">Start audio lesson</Text>
      <Text className="text-body-sm mt-1 text-ink-muted">
        Talk with your AI teacher
      </Text>
    </OverlayShell>
  );
}

/** Semi-transparent cover over the teacher scene that hosts overlay content. */
function OverlayShell({ children }: { children: React.ReactNode }) {
  return (
    <View
      className="absolute inset-0 z-20 items-center justify-center"
      style={{ backgroundColor: "rgba(236,233,254,0.92)" }}
    >
      {children}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Presentational call card (no Stream hooks — driven entirely by props)      */
/* -------------------------------------------------------------------------- */

type CallCardProps = {
  lesson: Lesson;
  phrase?: Phrase;
  livePill?: { text: string; color: string } | null;
  /** AI teacher connection chip (null in the pre-call setup card). */
  teacherStatus?: { text: string; color: string } | null;
  banner?: { text: string; tone: "info" | "warning" } | null;
  /** Live captions for the active call (empty in the pre-call setup card). */
  captions?: LiveCaption[];
  /** True while the mic is live (the talk button is held). */
  talking: boolean;
  /** Disable the talk button before the call is joined. */
  talkDisabled: boolean;
  onTalkStart: () => void;
  onTalkEnd: () => void;
  overlay: React.ReactNode;
};

function CallCard({
  lesson,
  phrase,
  livePill,
  teacherStatus,
  banner,
  captions,
  talking,
  talkDisabled,
  onTalkStart,
  onTalkEnd,
  overlay,
}: CallCardProps) {
  const hasCaptions = !!captions && captions.length > 0;
  return (
    <View
      className="overflow-hidden rounded-3xl border border-border bg-white"
      style={styles.soft}
    >
      {/* Teacher scene */}
      <View className="relative h-72" style={{ backgroundColor: "#ECE9FE" }}>
        {/* Lesson title chip + AI teacher connection chip (top-left). */}
        <View className="absolute left-3 top-3 z-10 items-start">
          <View className="flex-row items-center rounded-full bg-white/90 px-3 py-1.5">
            <Ionicons name="headset" size={14} color={colors.primary} />
            <Text className="text-caption ml-1.5 text-ink">{lesson.title}</Text>
          </View>
          {teacherStatus && (
            <View className="mt-1.5 flex-row items-center rounded-full bg-white/90 px-3 py-1.5">
              <View
                className="mr-1.5 h-2 w-2 rounded-full"
                style={{ backgroundColor: teacherStatus.color }}
              />
              <Text className="text-caption text-ink">{teacherStatus.text}</Text>
            </View>
          )}
        </View>

        {/* Live pill (top-center) when joined. */}
        {livePill && (
          <View className="absolute left-0 right-0 top-3 z-10 items-center">
            <View className="flex-row items-center rounded-full bg-white/90 px-3 py-1.5">
              <View
                className="mr-1.5 h-2 w-2 rounded-full"
                style={{ backgroundColor: livePill.color }}
              />
              <Text className="text-caption text-ink">{livePill.text}</Text>
            </View>
          </View>
        )}

        {/* The AI teacher (fox mascot). */}
        <Image
          source={images.mascotWelcome}
          className="absolute inset-x-0 bottom-20 top-4"
          contentFit="contain"
        />

        {/* Reconnecting / muted banner. */}
        {banner && (
          <View className="absolute inset-x-4 top-16 z-10 items-center">
            <View
              className="flex-row items-center rounded-full px-3 py-1.5"
              style={{
                backgroundColor:
                  banner.tone === "warning" ? "#FFF4E0" : "#EAF0FF",
              }}
            >
              <Ionicons
                name={
                  banner.tone === "warning" ? "sync" : "information-circle"
                }
                size={14}
                color={banner.tone === "warning" ? colors.streak : colors.info}
              />
              <Text className="text-caption ml-1.5 text-ink">{banner.text}</Text>
            </View>
          </View>
        )}

        {/* Selected phrase to practice — hidden once live captions take over. */}
        {!hasCaptions && (
          <View
            className="absolute inset-x-4 bottom-4 flex-row items-center rounded-2xl bg-white px-4 py-3"
            style={styles.soft}
          >
            <View className="flex-1 pr-2">
              <Text className="text-h4 text-ink">{phrase?.text}</Text>
              {phrase?.translation && (
                <Text className="text-body-sm mt-0.5 text-ink-muted">
                  {phrase.translation}
                </Text>
              )}
            </View>
            <View className="h-9 w-9 items-center justify-center rounded-full bg-primary">
              <Ionicons name="volume-high" size={18} color="#ffffff" />
            </View>
          </View>
        )}

        {/* Pre-call overlay (start / connecting / error / ended). */}
        {overlay}
      </View>

      {/* Live captions — the full transcript, in the same purple as the scene
          above so the area simply extends downward and never covers the mascot. */}
      {hasCaptions && (
        <View className="px-4 pb-4" style={{ backgroundColor: "#ECE9FE" }}>
          <LiveCaptionsBubble captions={captions} />
        </View>
      )}

      {/* Push-to-talk — hold to speak. The mic is muted otherwise so the AI
          teacher never hears itself (no echo), and speaking interrupts it. */}
      <View className="items-center px-4 pb-1 pt-6">
        <Pressable
          onPressIn={talkDisabled ? undefined : onTalkStart}
          onPressOut={talkDisabled ? undefined : onTalkEnd}
          disabled={talkDisabled}
          className="h-20 w-20 items-center justify-center rounded-full"
          style={[
            styles.soft,
            {
              backgroundColor: talking ? colors.success : colors.primary,
              opacity: talkDisabled ? 0.5 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Hold to talk"
        >
          <Ionicons
            name={talking ? "mic" : "mic-outline"}
            size={32}
            color="#ffffff"
          />
        </Pressable>
        <Text className="text-h4 mt-2.5 text-ink">
          {talking ? "Listening…" : "Hold to talk"}
        </Text>
        <Text className="text-caption mt-0.5 text-ink-muted">
          {talking
            ? "Release when you're done speaking"
            : "Press and hold while you speak"}
        </Text>
      </View>

      {/* Lesson feedback — sample per-session scores */}
      <View className="mx-4 mb-4 mt-5 flex-row rounded-2xl bg-surface">
        <FeedbackCell label="Speaking" value="Excellent" />
        <View className="my-3 w-px bg-border" />
        <FeedbackCell label="Pronunciation" value="Great" />
        <View className="my-3 w-px bg-border" />
        <FeedbackCell label="Grammar" value="Good" />
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Local building blocks                                                      */
/* -------------------------------------------------------------------------- */

/** Coarse header status (dot color + label) per call setup phase. */
const HEADER_STATUS: Record<LessonCallStatus, { label: string; color: string }> = {
  unavailable: { label: "Offline", color: colors.inkMuted },
  idle: { label: "Ready", color: colors.warning },
  starting: { label: "Connecting", color: colors.warning },
  active: { label: "Live", color: colors.success },
  ended: { label: "Ended", color: colors.inkMuted },
  error: { label: "Connection error", color: colors.error },
};

/** AI teacher (Vision Agent) connection chip per agent status. */
const AGENT_STATUS: Record<AgentStatus, { text: string; color: string }> = {
  idle: { text: "Teacher joining…", color: colors.warning },
  connecting: { text: "Teacher joining…", color: colors.warning },
  connected: { text: "Teacher ready", color: colors.success },
  failed: { text: "Teacher offline", color: colors.error },
};

/**
 * Live captions panel — the full running transcript, each line labelled
 * "Teacher" or "You". Lives below the mascot in the purple scene. The list
 * scrolls (capped height) and keeps the newest line in view.
 */
function LiveCaptionsBubble({ captions }: { captions: LiveCaption[] }) {
  const scrollRef = useRef<ScrollView>(null);
  return (
    <View className="rounded-2xl bg-white px-4 py-3" style={styles.soft}>
      <View className="mb-1.5 flex-row items-center">
        <Ionicons name="chatbubbles" size={13} color={colors.primary} />
        <Text className="text-caption ml-1.5 text-ink-muted">Live captions</Text>
      </View>
      <ScrollView
        ref={scrollRef}
        style={{ maxHeight: 180 }}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
      >
        {captions.map((caption) => {
          const isTeacher = caption.speaker === "teacher";
          return (
            <View key={caption.id} className="mb-1.5 flex-row items-start">
              <Text
                className="text-caption mr-2"
                style={{
                  width: 56,
                  color: isTeacher ? colors.primary : colors.success,
                }}
              >
                {isTeacher ? "Teacher" : "You"}
              </Text>
              <Text className="text-body-sm flex-1 text-ink">
                {caption.text}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

/** One column of the lesson-feedback card. */
function FeedbackCell({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center px-2 py-3">
      <Text className="text-caption text-ink-muted">{label}</Text>
      <Text className="text-h4 mt-0.5 text-success">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Soft card/button shadow — no NativeWind equivalent, varies per platform.
  soft: {
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 4 },
    }),
  },
});
