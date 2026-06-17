import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect, useRef } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { LoadingImage } from "@/components/LoadingImage";
import { getLesson, getLessonImage } from "@/data/lessons";
import { useProgressStore } from "@/store/useProgressStore";
import { colors } from "@/theme";

/** Friendly label + icon for each lesson delivery type. */
const TYPE_META: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  video: { label: "Video lesson", icon: "videocam" },
  audio: { label: "Audio lesson", icon: "headset" },
  chat: { label: "Chat lesson", icon: "chatbubbles" },
  vocabulary: { label: "Vocabulary", icon: "albums" },
};

/**
 * Lesson detail screen.
 *
 * A lightweight preview of a lesson's content (goals, vocabulary, phrases).
 * The interactive player isn't built yet, so the main action here is "Complete
 * lesson", which awards XP and marks it done in the local progress store.
 */
export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const posthog = usePostHog();
  const insets = useSafeAreaInsets();

  const lesson = getLesson(id);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const completed = useProgressStore((s) => s.completedLessons.includes(id));

  // Analytics: capture when a lesson is opened, and whether the learner leaves
  // before finishing. `startTimeRef` is captured on mount so the abandoned
  // duration is accurate; `completedRef` lets the unmount cleanup tell a real
  // "abandon" apart from a normal completion. It's seeded from `completed` so
  // re-opening an already-finished lesson and leaving doesn't count as one.
  const startTimeRef = useRef(Date.now());
  const completedRef = useRef(completed);

  useEffect(() => {
    if (!lesson) return;

    const startTime = startTimeRef.current;

    posthog.capture("lesson_started", {
      lesson_id: lesson.id,
      language: lesson.languageId,
      lesson_number: lesson.order,
    });

    return () => {
      if (completedRef.current) return;
      posthog.capture("lesson_abandoned", {
        lesson_id: lesson.id,
        time_into_lesson_seconds: Math.round((Date.now() - startTime) / 1000),
        // This preview screen has no per-question stepper yet, so there's no
        // question index to report — 0 until an interactive player is built.
        last_question_index: 0,
      });
    };
    // Fire once on mount / clean up on unmount — `lesson` is fixed for the
    // screen's lifetime and `posthog` is stable from the provider.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.push("/learn");
  };

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

  const meta = TYPE_META[lesson.type];

  const handleComplete = () => {
    completeLesson(lesson.id, lesson.xpReward);
    // Mark complete before navigating so the unmount cleanup skips
    // "lesson_abandoned" — this was a finish, not an abandon.
    completedRef.current = true;
    posthog.capture("lesson_completed", {
      lesson_id: lesson.id,
      language_code: lesson.languageId,
      xp: lesson.xpReward,
    });
    goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-5 pb-2 pt-1">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={goBack}
          className="h-10 w-10 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </TouchableOpacity>
        <Text className="text-h4 ml-1 flex-1 text-ink" numberOfLines={1}>
          {lesson.title}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <LoadingImage
          uri={getLessonImage(lesson, 600)}
          className="h-48 w-full rounded-3xl"
          contentFit="cover"
        />

        {/* Type + XP */}
        <View className="mt-4 flex-row items-center">
          <View className="flex-row items-center rounded-full bg-surface px-3 py-1.5">
            <Ionicons name={meta?.icon ?? "albums"} size={16} color={colors.primary} />
            <Text className="text-body-sm ml-1.5 text-ink">
              {meta?.label ?? "Lesson"}
            </Text>
          </View>
          <View className="ml-2 flex-row items-center rounded-full bg-surface px-3 py-1.5">
            <Ionicons name="star" size={16} color={colors.warning} />
            <Text className="text-body-sm ml-1.5 text-ink">
              +{lesson.xpReward} XP
            </Text>
          </View>
        </View>

        {/* Goals */}
        <Text className="text-h3 mt-6 text-ink">What you&apos;ll learn</Text>
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

        {/* Vocabulary */}
        {lesson.vocabulary.length > 0 && (
          <>
            <Text className="text-h3 mt-6 text-ink">Vocabulary</Text>
            <View className="mt-2">
              {lesson.vocabulary.map((word) => (
                <View
                  key={word.id}
                  className="mt-2 flex-row items-center justify-between rounded-2xl border border-border px-4 py-3"
                >
                  <View className="flex-1 pr-3">
                    <Text className="text-h4 text-ink">{word.word}</Text>
                    {word.phonetic && (
                      <Text className="text-caption mt-0.5 text-ink-muted">
                        {word.phonetic}
                      </Text>
                    )}
                  </View>
                  <Text className="text-body-md text-ink-muted">
                    {word.translation}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Footer action — pad past the Android/iOS bottom inset so the button
          never sits under the system navigation bar. */}
      <View
        className="border-t border-border px-5 pt-3"
        style={{ paddingBottom: insets.bottom || 12 }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleComplete}
          disabled={completed}
          className={`items-center rounded-full py-4 ${
            completed ? "bg-success" : "bg-primary"
          }`}
        >
          <Text className="text-h4 text-background">
            {completed ? "Completed ✓" : `Complete lesson · +${lesson.xpReward} XP`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
