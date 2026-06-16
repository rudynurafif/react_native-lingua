import AsyncStorage from "@react-native-async-storage/async-storage";
import { useClerk, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/Image";
import { formatLearners, getFlagUrl, getLanguage } from "@/data/languages";
import { useLanguageStore } from "@/store/useLanguageStore";

/**
 * Profile placeholder. The full UI isn't built yet, but it hosts the account
 * actions (and dev/testing helpers) that previously lived on the home route.
 */
export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const selectedLanguage = useLanguageStore((s) => s.selectedLanguage);
  const clearLanguage = useLanguageStore((s) => s.clearLanguage);

  const language = selectedLanguage ? getLanguage(selectedLanguage) : null;

  // Dev/testing only: clear the persisted language to retest the onboarding flow.
  const handleClearStorage = async () => {
    await AsyncStorage.removeItem("language-storage");
    clearLanguage();
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      edges={["top"]}
    >
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-h2 text-ink">Profile</Text>
        <Text className="text-body-md mt-2 text-center text-ink-muted">
          {user?.primaryEmailAddress?.emailAddress ?? "Signed in"}
        </Text>

        {language && (
          <View className="mt-6 w-full flex-row items-center rounded-2xl border border-border bg-surface px-4 py-3">
            {/* Circular country flag */}
            <View className="h-12 w-12 overflow-hidden rounded-full bg-background">
              <Image
                source={{ uri: getFlagUrl(language) }}
                className="h-full w-full"
                contentFit="cover"
              />
            </View>

            {/* Language name + learner count */}
            <View className="ml-3 flex-1">
              <Text className="text-body-sm text-ink-muted">
                Currently learning
              </Text>
              <Text className="text-h4 text-ink">
                {language.name}{" "}
                <Text className="text-body-sm text-ink-muted">
                  {language.nativeName}
                </Text>
              </Text>
              <Text className="text-body-sm mt-0.5 text-ink-muted">
                {formatLearners(language.learners)} learners
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push("/languages")}
          className="mt-8 h-14 w-full items-center justify-center rounded-2xl bg-primary px-8"
        >
          <Text className="text-h4 text-background">Choose a language</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => signOut()}
          className="mt-4 h-14 w-full items-center justify-center rounded-2xl border border-border px-8"
        >
          <Text className="text-h4 text-ink">Sign out</Text>
        </TouchableOpacity>

        {__DEV__ && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleClearStorage}
            className="mt-4 h-14 w-full items-center justify-center rounded-2xl border border-border px-8"
          >
            <Text className="text-h4 text-ink">Clear storage (test)</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
