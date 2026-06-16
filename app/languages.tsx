import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/Image";
import { LanguageCard } from "@/components/LanguageCard";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { useLanguageStore } from "@/store/useLanguageStore";
import { colors } from "@/theme";
import type { LanguageCode } from "@/types/learning";
import { usePostHog } from "posthog-react-native";

/**
 * Language selection screen.
 *
 * Lets the learner pick a language from the list, then confirm.
 * The confirmed choice is persisted to the Zustand language store, which
 * unlocks the home route.
 */
export default function Languages() {
  const router = useRouter();
  const posthog = usePostHog();
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const storedLanguage = useLanguageStore((s) => s.selectedLanguage);

  // Pre-select the previously chosen language if there is one, else Spanish.
  const [selectedId, setSelectedId] = useState<LanguageCode>(
    storedLanguage ?? "es",
  );
  const [query, setQuery] = useState("");

  // Filter the language list by the search query (case-insensitive).
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return languages;
    return languages.filter((language) =>
      language.name.toLowerCase().includes(q),
    );
  }, [query]);

  const handleConfirm = () => {
    // Persist the choice, then go to the home route. `replace` so the back
    // gesture doesn't return to language selection after confirming.
    posthog.capture("language_selected", {
      language_code: selectedId,
      is_change: storedLanguage !== null && storedLanguage !== selectedId,
    });
    setLanguage(selectedId);
    router.replace("/");
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: "#ffffff" }}
    >
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-6 pt-3">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={8}
            className="-ml-2 h-10 w-10 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={26} color={colors.ink} />
          </TouchableOpacity>
          <Text className="text-h4 flex-1 text-center text-ink">
            Choose a language
          </Text>
          {/* Spacer to balance the back button so the title stays centered */}
          <View className="h-10 w-10" />
        </View>

        {/* Search */}
        <View className="mt-5 px-6">
          <View className="h-12 flex-row items-center rounded-2xl bg-surface px-4">
            <Ionicons name="search" size={20} color={colors.inkMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search languages"
              placeholderTextColor={colors.inkMuted}
              autoCapitalize="none"
              className="text-body-md ml-2 flex-1 p-0 text-ink"
            />
          </View>
        </View>

        {/* Language list */}
        <Text className="text-h4 mt-6 px-6 text-ink">All languages</Text>
        <ScrollView
          className="mt-2 flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
        >
          {results.map((language, index) => {
            const isSelected = language.id === selectedId;
            const prev = results[index - 1];
            // Hairline separator between two consecutive unselected rows.
            const showDivider =
              index > 0 && !isSelected && prev.id !== selectedId;

            return (
              <View key={language.id}>
                {showDivider && <View className="ml-16 h-px bg-border" />}
                <LanguageCard
                  language={language}
                  selected={isSelected}
                  onPress={() => setSelectedId(language.id)}
                />
              </View>
            );
          })}
        </ScrollView>

        {/* Confirm */}
        <View className="px-6 pt-2">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleConfirm}
            className="h-16 items-center justify-center rounded-2xl bg-primary"
          >
            <Text className="text-h4 text-background">Continue</Text>
          </TouchableOpacity>
        </View>

        {/* Decorative earth — full width, pulled past the bottom edge so the
            illustration's transparent base is cropped and sits flush. */}
        <Image
          source={images.earth}
          className="-mb-28 h-96 w-full"
          contentFit="cover"
          contentPosition="bottom"
        />
      </View>
    </SafeAreaView>
  );
}
