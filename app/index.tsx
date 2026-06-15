import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-h1 text-primary">Lingua</Text>

      <Link href="/onboarding" className="mt-6 rounded-2xl bg-primary px-6 py-3">
        <Text className="text-h4 text-background">Open Onboarding</Text>
      </Link>
    </View>
  );
}
