import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/Image";
import { images } from "@/constants/images";
import { getFlagUrl, getGreeting, getLanguage } from "@/data/languages";
import { getLessonsByLanguage } from "@/data/lessons";
import { getUnitsByLanguage } from "@/data/units";
import { useLanguageStore } from "@/store/useLanguageStore";
import { colors } from "@/theme";
import type { LanguageCode } from "@/types/learning";

/**
 * Home screen.
 *
 * Greets the signed-in Clerk user, shows their selected language (Zustand +
 * AsyncStorage), and surfaces today's learning from the `data/*` content:
 * the current unit to continue, a short "today's plan", and an AI video call.
 *
 * Daily goal / streak numbers are placeholders for now — they'll come from a
 * dedicated XP/streak store later (see AGENTS.md).
 */

// Daily goal placeholders (future: XP store).
const DAILY_GOAL_XP = 20;
const EARNED_XP = 15;
const STREAK_DAYS = 12;

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();

  // Selected language (persisted). Default to Spanish if somehow unset.
  const selected = useLanguageStore((s) => s.selectedLanguage);
  const code: LanguageCode = selected ?? "es";
  const language = getLanguage(code);

  // First name from Clerk, with friendly fallbacks.
  const firstName = user?.firstName ?? user?.username ?? "there";
  const greeting = getGreeting(code);

  // Current unit to continue, and the language's lessons for today's plan.
  const unit = getUnitsByLanguage(code)[0];
  const lessons = getLessonsByLanguage(code);
  const lesson = lessons[0];
  const chatLesson = lessons.find((l) => l.type === "chat");
  const wordCount = lessons.reduce((n, l) => n + l.vocabulary.length, 0);

  // Today's plan, derived from the language content.
  const plan = [
    {
      key: "lesson",
      icon: <Ionicons name="book" size={22} color="#ffffff" />,
      bg: colors.primary,
      title: "Lesson",
      subtitle: lesson?.title ?? "Start learning",
      done: true,
      onPress: () => router.push("/learn"),
    },
    {
      key: "conversation",
      icon: <Ionicons name="headset" size={22} color="#ffffff" />,
      bg: colors.blue,
      title: "AI Conversation",
      subtitle: chatLesson?.goals[0] ?? "Talk about your day",
      done: false,
      onPress: () => router.push("/chat"),
    },
    {
      key: "words",
      icon: (
        <MaterialCommunityIcons name="robot-happy" size={22} color="#ffffff" />
      ),
      bg: "#FF6B6B",
      title: "New words",
      subtitle: `${wordCount} words`,
      done: false,
      onPress: () => router.push("/learn"),
    },
  ];

  const xpProgress = Math.min(EARNED_XP / DAILY_GOAL_XP, 1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={["top"]}>
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
            Header — avatar + greeting, streak + notifications
        ---------------------------------------------------------------- */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center">
            <View className="h-11 w-11 overflow-hidden rounded-full bg-surface">
              <Image
                source={
                  user?.imageUrl
                    ? { uri: user.imageUrl }
                    : language
                      ? { uri: getFlagUrl(language) }
                      : images.mascotLogo
                }
                className="h-full w-full"
                contentFit="cover"
              />
            </View>
            <Text className="text-h3 ml-3 flex-1 text-ink" numberOfLines={1}>
              {greeting}, {firstName}! 👋
            </Text>
          </View>

          <View className="ml-3 flex-row items-center">
            <View className="flex-row items-center">
              <Image source={images.streakFire} className="h-6 w-6" contentFit="contain" />
              <Text className="text-h4 ml-1 text-streak">{STREAK_DAYS}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={8}
              className="ml-4 h-10 w-10 items-center justify-center"
            >
              <Ionicons name="notifications-outline" size={24} color={colors.ink} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ----------------------------------------------------------------
            Daily goal card
        ---------------------------------------------------------------- */}
        <View className="mt-6 flex-row items-center rounded-3xl bg-[#FFF4E8] p-5">
          <View className="flex-1">
            <Text className="text-body-sm text-ink-muted">Daily goal</Text>
            <View className="mt-1 flex-row items-baseline">
              <Text className="text-h2 text-ink">{EARNED_XP}</Text>
              <Text className="text-body-md ml-1 text-ink-muted">
                / {DAILY_GOAL_XP} XP
              </Text>
            </View>
            {/* Progress track + fill (dynamic width → inline style) */}
            <View className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#FBE2C6]">
              <View
                className="h-full rounded-full bg-streak"
                style={{ width: `${xpProgress * 100}%` }}
              />
            </View>
          </View>
          <Image
            source={images.treasure}
            className="ml-4 h-20 w-20"
            contentFit="contain"
          />
        </View>

        {/* ----------------------------------------------------------------
            Continue learning card
        ---------------------------------------------------------------- */}
        <View className="mt-4 overflow-hidden rounded-3xl bg-primary">
          <View className="p-5 pr-32">
            <Text className="text-body-sm text-white/80">Continue learning</Text>
            <Text className="text-h2 mt-1 text-background">
              {language?.name ?? "Spanish"}
            </Text>
            <Text className="text-body-md mt-0.5 text-white/80">
              A1 · Unit {unit?.order ?? 1}
            </Text>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push("/learn")}
              className="mt-4 self-start rounded-full bg-background px-6 py-2.5"
            >
              <Text className="text-h4 text-primary">Continue</Text>
            </TouchableOpacity>
          </View>
          {/* Palace illustration, anchored bottom-right */}
          <Image
            source={images.palace}
            className="absolute -bottom-1 right-0 h-36 w-36"
            contentFit="contain"
            contentPosition="bottom right"
          />
        </View>

        {/* ----------------------------------------------------------------
            Today's plan
        ---------------------------------------------------------------- */}
        <View className="mt-7 flex-row items-center justify-between">
          <Text className="text-h3 text-ink">Today&apos;s plan</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/learn")}>
            <Text className="text-body-md text-primary">View all</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-3">
          {plan.map((item) => (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.8}
              onPress={item.onPress}
              className="flex-row items-center py-3"
            >
              <View
                className="h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: item.bg }}
              >
                {item.icon}
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-h4 text-ink">{item.title}</Text>
                <Text className="text-body-sm text-ink-muted">{item.subtitle}</Text>
              </View>
              {item.done ? (
                <View className="h-7 w-7 items-center justify-center rounded-full bg-primary">
                  <Ionicons name="checkmark" size={18} color="#ffffff" />
                </View>
              ) : (
                <View className="h-7 w-7 rounded-full border-2 border-border" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
