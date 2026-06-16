import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenPlaceholderProps = {
  title: string;
};

/**
 * Temporary placeholder for tab screens that aren't built yet. Each tab points
 * at this until its real UI lands, so the navigation works end-to-end.
 */
export function ScreenPlaceholder({ title }: ScreenPlaceholderProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={["top"]}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-h2 text-ink">{title}</Text>
        <Text className="text-body-md mt-2 text-ink-muted">Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}
