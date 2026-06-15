import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { Image } from "@/components/Image";
import { formatLearners, getFlagUrl } from "@/data/languages";
import { colors } from "@/theme";
import type { Language } from "@/types/learning";

type LanguageCardProps = {
  language: Language;
  selected: boolean;
  onPress: () => void;
};

/**
 * A single row in the language selection list.
 *
 * - Selected → filled purple-tinted card with a primary border and a check.
 * - Unselected → plain row with a chevron hinting it's tappable.
 */
export function LanguageCard({
  language,
  selected,
  onPress,
}: LanguageCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className={`flex-row items-center rounded-2xl px-3 py-2.5 ${
        selected ? "my-1 border border-primary bg-[#F4F2FE]" : ""
      }`}
    >
      {/* Circular flag */}
      <View className="h-11 w-11 overflow-hidden rounded-full bg-surface">
        <Image
          source={{ uri: getFlagUrl(language) }}
          className="h-full w-full"
          contentFit="cover"
        />
      </View>

      {/* Name + learner count */}
      <View className="ml-3 flex-1">
        <Text className="text-h4 text-ink">{language.name}</Text>
        <Text className="text-body-sm mt-0.5 text-ink-muted">
          {formatLearners(language.learners)} learners
        </Text>
      </View>

      {/* Trailing indicator */}
      {selected ? (
        <View className="h-7 w-7 items-center justify-center rounded-full bg-primary">
          <Ionicons name="checkmark" size={18} color="#ffffff" />
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.inkMuted} />
      )}
    </TouchableOpacity>
  );
}
