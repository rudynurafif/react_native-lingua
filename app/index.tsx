import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useLanguageStore } from "@/store/useLanguageStore";
import { colors } from "@/theme";

/**
 * App entry gate.
 *
 * - While Clerk restores the session (or the language store is hydrating),
 *   show a spinner.
 * - Signed out → send the user to onboarding.
 * - Signed in but no language chosen yet → send to language selection.
 * - Signed in with a language → enter the tab navigation (Home).
 */
export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  const selectedLanguage = useLanguageStore((s) => s.selectedLanguage);
  const hasHydrated = useLanguageStore((s) => s.hasHydrated);

  // Wait for both Clerk and the persisted language to be ready before deciding
  // where to send the user — otherwise we'd flash the wrong screen.
  if (!isLoaded || !hasHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  if (!selectedLanguage) {
    return <Redirect href="/languages" />;
  }

  return <Redirect href="/home" />;
}
