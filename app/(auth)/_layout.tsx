import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

/**
 * Guards the sign-up / sign-in screens. If the user is already signed in,
 * there's nothing to do here — send them straight to the home route.
 */
export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
