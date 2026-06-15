import { useAuth, useClerk, useUser } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/theme";

/**
 * App entry / home route.
 *
 * - While Clerk restores the session from the token cache, show a spinner.
 * - Signed out → send the user to onboarding.
 * - Signed in → show the home screen (placeholder for now; lessons land here
 *   in a later feature).
 */
export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-h1 text-primary">Lingua</Text>
      <Text className="text-body-md mt-2 text-ink-muted">
        Signed in as {user?.primaryEmailAddress?.emailAddress ?? "your account"}
      </Text>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => signOut()}
        className="mt-8 h-14 items-center justify-center rounded-2xl border border-border px-8"
      >
        <Text className="text-h4 text-ink">Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
