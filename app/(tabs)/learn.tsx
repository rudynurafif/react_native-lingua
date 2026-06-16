import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/Image";
import { LessonCard, type LessonStatus } from "@/components/LessonCard";
import { LoadingImage } from "@/components/LoadingImage";
import { images } from "@/constants/images";
import { getLanguage } from "@/data/languages";
import { getLessonImage, getLessonsByUnit } from "@/data/lessons";
import { getUnitsByLanguage } from "@/data/units";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useProgressStore } from "@/store/useProgressStore";
import { colors } from "@/theme";
import type { LanguageCode } from "@/types/learning";

type LessonsTab = "lessons" | "practice";

/**
 * Lessons screen (Learn tab).
 *
 * Shows the current unit for the learner's selected language (Zustand +
 * AsyncStorage): a hero image, the unit title/progress, and a list of lesson
 * cards. Status (completed / in progress / not started) is derived from the
 * local progress store. Any lesson is openable — no locking for now.
 */
export default function LearnScreen() {
  const router = useRouter();
  const posthog = usePostHog();
  const [tab, setTab] = useState<LessonsTab>("lessons");

  // Selected language (persisted). Default to Spanish if somehow unset.
  const selected = useLanguageStore((s) => s.selectedLanguage);
  const code: LanguageCode = selected ?? "es";
  const language = getLanguage(code);

  // Local progress.
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const currentLessonId = useProgressStore((s) => s.currentLessonId);
  const openLesson = useProgressStore((s) => s.openLesson);
  const isCompleted = (id: string) => completedLessons.includes(id);

  // All lessons for this language, in unit → lesson order.
  const units = getUnitsByLanguage(code);
  const orderedLessons = units.flatMap((unit) => getLessonsByUnit(unit.id));

  // The "in progress" lesson: the one last opened (if still unfinished),
  // otherwise the first lesson the learner hasn't completed yet.
  const firstIncomplete = orderedLessons.find((l) => !isCompleted(l.id));
  const inProgressId =
    currentLessonId &&
    orderedLessons.some((l) => l.id === currentLessonId) &&
    !isCompleted(currentLessonId)
      ? currentLessonId
      : firstIncomplete?.id;

  // Focus the unit that contains the current lesson (fall back to the last).
  const currentLesson =
    orderedLessons.find((l) => l.id === inProgressId) ??
    orderedLessons[orderedLessons.length - 1];
  const activeUnit =
    units.find((u) => u.id === currentLesson?.unitId) ?? units[0];
  const unitLessons = activeUnit ? getLessonsByUnit(activeUnit.id) : [];
  const completedInUnit = unitLessons.filter((l) => isCompleted(l.id)).length;

  // Lessons unlock sequentially: a lesson is locked until the one before it is
  // completed. The first incomplete lesson is the unlocked "in progress" one;
  // everything after it stays locked.
  const statusFor = (lessonId: string): LessonStatus => {
    if (isCompleted(lessonId)) return "completed";
    if (lessonId === inProgressId) return "in-progress";
    return "locked";
  };

  const handleOpenLesson = (lessonId: string) => {
    // Locked lessons can't be opened yet.
    if (statusFor(lessonId) === "locked") return;
    openLesson(lessonId);
    posthog.capture("lesson_opened", {
      lesson_id: lessonId,
      language_code: code,
    });
    router.push({ pathname: "/lesson/audio/[id]", params: { id: lessonId } });
  };

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.push("/home");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={["top"]}>
      {/* ------------------------------------------------------------------
          Header — back, title + progress, bookmark
      ------------------------------------------------------------------ */}
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

        <View className="flex-1 items-center">
          <Text className="text-h4 text-ink" numberOfLines={1}>
            {currentLesson?.title ?? activeUnit?.title ?? language?.name}
          </Text>
          {activeUnit && (
            <Text className="text-caption mt-0.5 text-ink-muted">
              Unit {activeUnit.order} · {completedInUnit}/{unitLessons.length}{" "}
              lessons
            </Text>
          )}
        </View>

        {/* Bookmark is decorative for now (no feature wired up yet). */}
        <View className="h-10 w-10 items-center justify-center">
          <Ionicons name="bookmark-outline" size={22} color={colors.ink} />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ----------------------------------------------------------------
            Hero image for the current lesson
        ---------------------------------------------------------------- */}
        {currentLesson && (
          <LoadingImage
            uri={getLessonImage(currentLesson, 600)}
            className="h-44 w-full rounded-3xl"
            contentFit="cover"
          />
        )}

        {/* ----------------------------------------------------------------
            Lessons / Practice tabs
        ---------------------------------------------------------------- */}
        <View className="mt-5 flex-row border-b border-border">
          {(["lessons", "practice"] as const).map((key) => {
            const active = tab === key;
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.8}
                onPress={() => setTab(key)}
                className="mr-8 pb-3"
                style={
                  active
                    ? { borderBottomWidth: 2, borderBottomColor: colors.primary }
                    : undefined
                }
              >
                <Text
                  className={`text-h4 ${active ? "text-primary" : "text-ink-muted"}`}
                >
                  {key === "lessons" ? "Lessons" : "Practice"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ----------------------------------------------------------------
            Tab content
        ---------------------------------------------------------------- */}
        {tab === "lessons" ? (
          <View className="mt-5">
            {unitLessons.length > 0 ? (
              unitLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  status={statusFor(lesson.id)}
                  onPress={() => handleOpenLesson(lesson.id)}
                />
              ))
            ) : (
              <View className="mt-10 items-center">
                <Image
                  source={images.mascotWelcome}
                  className="h-28 w-28"
                  contentFit="contain"
                />
                <Text className="text-h4 mt-4 text-ink">No lessons yet</Text>
                <Text className="text-body-md mt-1 text-center text-ink-muted">
                  Lessons for {language?.name} are coming soon.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View className="mt-12 items-center px-6">
            <Image
              source={images.mascotWelcome}
              className="h-32 w-32"
              contentFit="contain"
            />
            <Text className="text-h3 mt-4 text-ink">Practice mode</Text>
            <Text className="text-body-md mt-1 text-center text-ink-muted">
              Review what you&apos;ve learned with quizzes and flashcards.
              Coming soon!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
