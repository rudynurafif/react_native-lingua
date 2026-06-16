import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useMemo, useState } from "react";
import {
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
import { useProgressStore } from "@/store/useProgressStore";
import { colors } from "@/theme";

/**
 * AI Teacher — audio lesson screen.
 *
 * An audio-only "call" with the lesson's AI teacher. Opened from the Lessons
 * screen with a lesson id, it pulls everything it shows from the hardcoded
 * learning data: the language, title, goal, phrases, and the teacher persona
 * (`aiTeacherPrompt`).
 *
 * This is audio-only on purpose — there is no real video calling. The camera
 * tile is a muted placeholder, and the controls (mic, subtitles, end call)
 * drive local UI state only. Ending the call marks the lesson complete and
 * awards its XP, keeping the existing progress/unlock flow intact.
 */
export default function AudioLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const posthog = usePostHog();
  const insets = useSafeAreaInsets();

  const lesson = getLesson(id);
  const completeLesson = useProgressStore((s) => s.completeLesson);

  // --- Local "call" state (audio-only, all client-side) --------------------
  const [muted, setMuted] = useState(false);
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

  const language = getLanguage(lesson.languageId);
  const phrase = lesson.phrases[activePhrase] ?? lesson.phrases[0];

  const handleEndCall = () => {
    completeLesson(lesson.id, lesson.xpReward);
    posthog.capture("lesson_completed", {
      lesson_id: lesson.id,
      language_code: lesson.languageId,
      xp: lesson.xpReward,
      via: "audio_call",
    });
    goBack();
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      edges={["top"]}
    >
      {/* ------------------------------------------------------------------
          Header — back, "AI Teacher" + online/language status, flag
      ------------------------------------------------------------------ */}
      <View className="flex-row items-center px-5 pb-3 pt-1">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={goBack}
          className="h-10 w-10 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="text-h4 text-ink">AI Teacher</Text>
          <View className="mt-0.5 flex-row items-center">
            <View className="mr-1.5 h-2 w-2 rounded-full bg-success" />
            <Text className="text-caption text-ink-muted">
              Online · {language?.name}
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
            Call card — teacher scene, response bubble, controls, and the
            three feedback scores, all inside one rounded box.
        ---------------------------------------------------------------- */}
        <View
          className="overflow-hidden rounded-3xl border border-border bg-white"
          style={styles.soft}
        >
          {/* Teacher scene */}
          <View
            className="relative h-72"
            style={{ backgroundColor: "#ECE9FE" }}
          >
            {/* Lesson title chip (top-left). */}
            <View className="absolute left-3 top-3 z-10 flex-row items-center rounded-full bg-white/90 px-3 py-1.5">
              <Ionicons name="headset" size={14} color={colors.primary} />
              <Text className="text-caption ml-1.5 text-ink">
                {lesson.title}
              </Text>
            </View>

            {/* Student camera placeholder (top-right corner) — audio only. */}
            {/* <View
              className="absolute right-3 top-3 z-10 h-28 w-20 items-center justify-center overflow-hidden rounded-2xl border-2 border-white"
              style={{ backgroundColor: "#1F2540" }}
            >
              <Ionicons name="person" size={30} color="#9aa0b4" />
              <Text className="text-caption mt-1 text-white">You</Text>
              <View className="absolute bottom-1.5 right-1.5 h-5 w-5 items-center justify-center rounded-full bg-error">
                <Ionicons name="videocam-off" size={11} color="#ffffff" />
              </View>
            </View> */}

            {/* The AI teacher (fox mascot). */}
            <Image
              source={images.mascotWelcome}
              className="absolute inset-x-0 bottom-20 top-4"
              contentFit="contain"
            />

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
          </View>

          {/* Call controls — camera (placeholder), mic, subtitles, end call */}
          <View className="flex-row items-start justify-between px-4 pt-5">
            {/* Camera — disabled placeholder (audio-only experience). */}
            <ControlButton
              label="Camera"
              icon={
                <Ionicons
                  name="videocam-off"
                  size={22}
                  color={colors.inkMuted}
                />
              }
              muted
              onPress={() => {}}
            />

            {/* Mic — toggles local mute. */}
            <ControlButton
              label={muted ? "Unmute" : "Mic"}
              active={!muted}
              icon={
                <Ionicons
                  name={muted ? "mic-off" : "mic"}
                  size={22}
                  color={muted ? colors.inkMuted : "#ffffff"}
                />
              }
              onPress={() => setMuted((m) => !m)}
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
              onPress={() => setSubtitlesOn((s) => !s)}
            />

            {/* End call — completes the lesson + awards XP, then goes back. */}
            <ControlButton
              label="End Call"
              danger
              icon={
                <MaterialCommunityIcons
                  name="phone-hangup"
                  size={22}
                  color="#ffffff"
                />
              }
              onPress={handleEndCall}
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
                    onPress={() => setActivePhrase(index)}
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
          Bottom tab navigation.

          The real animated tab bar (components/TabBar) only renders inside the
          (tabs) navigator. This screen is pushed on top of it, so we show a
          static, presentational replica that matches the design and navigates
          back to each tab. "AI Teacher" is the active tab here.
      ------------------------------------------------------------------ */}
      <BottomNav insetBottom={insets.bottom} />
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/* Local building blocks                                                      */
/* -------------------------------------------------------------------------- */

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
  const bg = danger
    ? colors.error
    : active
      ? colors.primary
      : "#ffffff";

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
