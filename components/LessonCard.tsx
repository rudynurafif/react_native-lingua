import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { LoadingImage } from "@/components/LoadingImage";
import { getLessonImage } from "@/data/lessons";
import { colors } from "@/theme";
import type { Lesson } from "@/types/learning";

/** Where the learner is with a lesson, used to theme the card. */
export type LessonStatus = "completed" | "in-progress" | "locked";

type LessonCardProps = {
  lesson: Lesson;
  status: LessonStatus;
  onPress: () => void;
};

/**
 * A single lesson row in the Lessons list.
 *
 * - completed   → green check badge on the right.
 * - in-progress → highlighted card (purple border + tint) with an "In progress"
 *                 label and the lesson's thumbnail image.
 * - locked      → dimmed card with a lock badge; not openable yet.
 *
 * Lessons unlock sequentially: a lesson is locked until every lesson before it
 * is completed (see `statusFor` in `app/(tabs)/learn.tsx`).
 */
export function LessonCard({ lesson, status, onPress }: LessonCardProps) {
  const inProgress = status === "in-progress";
  const completed = status === "completed";
  const locked = status === "locked";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={locked}
      className={`mb-3 flex-row items-center rounded-2xl px-4 py-3.5 ${
        inProgress
          ? "border-2 border-primary bg-[#F4F2FE]"
          : "border border-border bg-background"
      }`}
    >
      {/* Left — order label + title (+ status line for the active lesson) */}
      <View className="flex-1 pr-3">
        <Text className="text-caption text-ink-muted">
          Lesson {lesson.order}
        </Text>
        <Text
          className={`text-h4 mt-0.5 ${locked ? "text-ink-muted" : "text-ink"}`}
          numberOfLines={1}
        >
          {lesson.title}
        </Text>
        {inProgress && (
          <Text className="text-body-sm mt-0.5 text-primary">In progress</Text>
        )}
      </View>

      {/* Right — status accessory */}
      {completed ? (
        <View className="h-7 w-7 items-center justify-center rounded-full bg-success">
          <Ionicons name="checkmark" size={18} color="#ffffff" />
        </View>
      ) : locked ? (
        <View className="h-9 w-9 items-center justify-center rounded-full bg-surface">
          <Ionicons name="lock-closed" size={18} color={colors.inkMuted} />
        </View>
      ) : (
        <LoadingImage
          uri={getLessonImage(lesson, 96)}
          className="h-12 w-12 rounded-xl"
          contentFit="cover"
        />
      )}
    </TouchableOpacity>
  );
}
