import { useUser } from "@clerk/expo";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  CallingState,
  StreamCall,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
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
  const { user } = useUser();

  const lesson = getLesson(id);

  // Subtitles stay a local UI toggle; the rest of the call is driven by Stream.
  const [subtitlesOn, setSubtitlesOn] = useState(true);
  const [activePhrase, setActivePhrase] = useState(0);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.push("/learn");
  };

  // The teacher's name is the first word of the persona prompt
  // ("You are Maria, a warm ...") — handy for the call header + bubble.
  const teacherName = useMemo(() => {
    if (!lesson) return "AI Teacher";
    return lesson.aiTeacherPrompt.match(/You are (\w+)/)?.[1] ?? "AI Teacher";
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
      userName={user?.firstName ?? user?.fullName ?? user?.username ?? "You"}
      subtitlesOn={subtitlesOn}
      onToggleSubtitles={() => setSubtitlesOn((s) => !s)}
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
  userName: string;
  subtitlesOn: boolean;
  onToggleSubtitles: () => void;
  activePhrase: number;
  onSelectPhrase: (index: number) => void;
  onBack: () => void;
  insetBottom: number;
};

function LoadedAudioLesson({
  lesson,
  teacherName,
  userName,
  subtitlesOn,
  onToggleSubtitles,
  activePhrase,
  onSelectPhrase,
  onBack,
  insetBottom,
}: LoadedProps) {
  const { call, status, agentStatus, error, start, end } = useLessonCall(lesson);

  const language = getLanguage(lesson.languageId);
  const phrase = lesson.phrases[activePhrase] ?? lesson.phrases[0];

  const header = HEADER_STATUS[status];

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

        {/* Language flag — shows which language this session teaches. */}
        {language && (
          <LoadingImage
            uri={getFlagUrl(language, 160)}
            className="h-10 w-10 rounded-full"
            contentFit="cover"
          />
        )}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 4,
          paddingBottom: 32,
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
              userName={userName}
              agentStatus={agentStatus}
              subtitlesOn={subtitlesOn}
              onToggleSubtitles={onToggleSubtitles}
              onEndCall={end}
            />
          </StreamCall>
        ) : (
          <SetupCallCard
            lesson={lesson}
            phrase={phrase}
            userName={userName}
            status={status}
            error={error}
            subtitlesOn={subtitlesOn}
            onToggleSubtitles={onToggleSubtitles}
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
              {lesson.aiTeacherPrompt}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ------------------------------------------------------------------
          Static bottom tab navigation (mirrors components/TabBar).
      ------------------------------------------------------------------ */}
      <BottomNav insetBottom={insetBottom} />
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
  userName: string;
  agentStatus: AgentStatus;
  subtitlesOn: boolean;
  onToggleSubtitles: () => void;
  onEndCall: () => void;
};

function LiveCallCard({
  lesson,
  phrase,
  userName,
  agentStatus,
  subtitlesOn,
  onToggleSubtitles,
  onEndCall,
}: LiveCallCardProps) {
  const { useCallCallingState, useMicrophoneState, useLocalParticipant } =
    useCallStateHooks();
  const callingState = useCallCallingState();
  const { status: micStatus, isSpeakingWhileMuted } = useMicrophoneState();
  const localParticipant = useLocalParticipant();

  const call = useCall();

  const muted = micStatus !== "enabled";
  const joined = callingState === CallingState.JOINED;
  const reconnecting =
    callingState === CallingState.RECONNECTING ||
    callingState === CallingState.JOINING;

  const banner = reconnecting
    ? { text: "Reconnecting…", tone: "warning" as const }
    : isSpeakingWhileMuted
      ? { text: "You're muted — tap the mic to speak", tone: "info" as const }
      : null;

  return (
    <CallCard
      lesson={lesson}
      phrase={phrase}
      userName={userName}
      userSpeaking={!muted && Boolean(localParticipant?.isSpeaking)}
      userMuted={muted}
      livePill={joined ? { text: "Live", color: colors.success } : null}
      teacherStatus={AGENT_STATUS[agentStatus]}
      banner={banner}
      micMuted={muted}
      micDisabled={!joined}
      onToggleMic={() => call?.microphone.toggle()}
      subtitlesOn={subtitlesOn}
      onToggleSubtitles={onToggleSubtitles}
      onEndCall={onEndCall}
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
  userName: string;
  status: LessonCallStatus;
  error: string | null;
  subtitlesOn: boolean;
  onToggleSubtitles: () => void;
  onStart: () => void;
};

function SetupCallCard({
  lesson,
  phrase,
  userName,
  status,
  error,
  subtitlesOn,
  onToggleSubtitles,
  onStart,
}: SetupCallCardProps) {
  return (
    <CallCard
      lesson={lesson}
      phrase={phrase}
      userName={userName}
      userMuted
      micMuted
      micDisabled
      onToggleMic={() => {}}
      subtitlesOn={subtitlesOn}
      onToggleSubtitles={onToggleSubtitles}
      onEndCall={() => {}}
      endDisabled
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
  userName: string;
  userSpeaking?: boolean;
  userMuted: boolean;
  livePill?: { text: string; color: string } | null;
  /** AI teacher connection chip (null in the pre-call setup card). */
  teacherStatus?: { text: string; color: string } | null;
  banner?: { text: string; tone: "info" | "warning" } | null;
  micMuted: boolean;
  micDisabled: boolean;
  onToggleMic: () => void;
  subtitlesOn: boolean;
  onToggleSubtitles: () => void;
  onEndCall: () => void;
  endDisabled?: boolean;
  overlay: React.ReactNode;
};

function CallCard({
  lesson,
  phrase,
  userName,
  userSpeaking,
  userMuted,
  livePill,
  teacherStatus,
  banner,
  micMuted,
  micDisabled,
  onToggleMic,
  subtitlesOn,
  onToggleSubtitles,
  onEndCall,
  endDisabled,
  overlay,
}: CallCardProps) {
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

        {/* "You" tile (top-right) — the signed-in user on the audio call. */}
        <View
          className="absolute right-3 top-3 z-10 h-28 w-20 items-center justify-center overflow-hidden rounded-2xl border-2"
          style={{
            backgroundColor: "#1F2540",
            borderColor: userSpeaking ? colors.success : "#ffffff",
          }}
        >
          <Ionicons name="person" size={30} color="#9aa0b4" />
          <Text className="text-caption mt-1 text-white" numberOfLines={1}>
            {userName}
          </Text>
          <View
            className="absolute bottom-1.5 right-1.5 h-5 w-5 items-center justify-center rounded-full"
            style={{ backgroundColor: userMuted ? colors.error : colors.success }}
          >
            <Ionicons
              name={userMuted ? "mic-off" : "mic"}
              size={11}
              color="#ffffff"
            />
          </View>
        </View>

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

        {/* Teacher response bubble (bottom). */}
        <View
          className="absolute inset-x-4 bottom-4 flex-row items-center rounded-2xl bg-white px-4 py-3"
          style={styles.soft}
        >
          <View className="flex-1 pr-2">
            <Text className="text-h4 text-ink">{phrase?.text}</Text>
            {subtitlesOn && phrase?.translation && (
              <Text className="text-body-sm mt-0.5 text-ink-muted">
                {phrase.translation}
              </Text>
            )}
          </View>
          <View className="h-9 w-9 items-center justify-center rounded-full bg-primary">
            <Ionicons name="volume-high" size={18} color="#ffffff" />
          </View>
        </View>

        {/* Pre-call overlay (start / connecting / error / ended). */}
        {overlay}
      </View>

      {/* Call controls — camera (placeholder), mic, subtitles, end call */}
      <View className="flex-row items-start justify-between px-4 pt-5">
        {/* Camera — disabled placeholder (audio-only experience). */}
        <ControlButton
          label="Camera"
          icon={
            <Ionicons name="videocam-off" size={22} color={colors.inkMuted} />
          }
          muted
          onPress={() => {}}
        />

        {/* Mic — toggles the real published audio track. */}
        <ControlButton
          label={micMuted ? "Unmute" : "Mic"}
          active={!micMuted && !micDisabled}
          muted={micDisabled}
          icon={
            <Ionicons
              name={micMuted ? "mic-off" : "mic"}
              size={22}
              color={micMuted || micDisabled ? colors.inkMuted : "#ffffff"}
            />
          }
          onPress={micDisabled ? () => {} : onToggleMic}
        />

        {/* Subtitles — toggles the translation under the response. */}
        <ControlButton
          label="Subtitles"
          active={subtitlesOn}
          icon={
            <MaterialCommunityIcons
              name="subtitles-outline"
              size={22}
              color={subtitlesOn ? "#ffffff" : colors.inkMuted}
            />
          }
          onPress={onToggleSubtitles}
        />

        {/* End call — leaves the call, completes the lesson + awards XP. */}
        <ControlButton
          label="End Call"
          danger
          muted={endDisabled}
          icon={
            <MaterialCommunityIcons
              name="phone-hangup"
              size={22}
              color="#ffffff"
            />
          }
          onPress={endDisabled ? () => {} : onEndCall}
        />
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

type ControlButtonProps = {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  /** Filled purple background (e.g. mic on, subtitles on). */
  active?: boolean;
  /** Red background (end call). */
  danger?: boolean;
  /** Dimmed placeholder, e.g. the disabled camera. */
  muted?: boolean;
};

/** A round call-control button with a label underneath. */
function ControlButton({
  label,
  icon,
  onPress,
  active,
  danger,
  muted,
}: ControlButtonProps) {
  const bg = danger ? colors.error : active ? colors.primary : "#ffffff";

  return (
    <View className="items-center">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        className="h-14 w-14 items-center justify-center rounded-full"
        style={[
          styles.soft,
          {
            backgroundColor: bg,
            borderWidth: active || danger ? 0 : 1,
            borderColor: colors.border,
            opacity: muted ? 0.6 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {icon}
      </TouchableOpacity>
      <Text className="text-caption mt-1.5 text-ink-muted">{label}</Text>
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

/** Tabs shown in the static bottom navigation (mirrors components/TabBar). */
const NAV_TABS = [
  { route: "/home" as const, label: "Home", icon: "home-outline" as const },
  { route: "/learn" as const, label: "Learn", icon: "book-outline" as const },
  { route: "/ai-teacher" as const, label: "AI Teacher", active: true },
  { route: "/chat" as const, label: "Chat", icon: "chatbubble-outline" as const },
  { route: "/profile" as const, label: "Profile", icon: "person-outline" as const },
];

/** Presentational bottom tab bar matching the app's navigation design. */
function BottomNav({ insetBottom }: { insetBottom: number }) {
  const router = useRouter();

  return (
    <View
      className="flex-row border-t border-border bg-background"
      style={[styles.navShadow, { paddingBottom: insetBottom || 12 }]}
    >
      {NAV_TABS.map((tab) => (
        <Pressable
          key={tab.route}
          onPress={() => router.push(tab.route)}
          className="h-19 flex-1 items-center pt-5.5"
          accessibilityRole="button"
          accessibilityLabel={tab.label}
        >
          <View className="h-8 items-center justify-center">
            {tab.active ? (
              <View className="h-13 w-13 items-center justify-center rounded-full bg-primary">
                <MaterialCommunityIcons
                  name="robot-happy"
                  size={24}
                  color="#ffffff"
                />
              </View>
            ) : (
              <Ionicons name={tab.icon} size={24} color={colors.inkMuted} />
            )}
          </View>
          {!tab.active && (
            <Text className="text-caption mt-1.5 font-poppins-medium text-ink-muted">
              {tab.label}
            </Text>
          )}
        </Pressable>
      ))}
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
  navShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -2 },
      },
      android: { elevation: 12 },
    }),
  },
});
