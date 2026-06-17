import "../global.css";

import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack, useGlobalSearchParams, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { PostHogProvider } from "posthog-react-native";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

import { IdentifyUser } from "@/components/IdentifyUser";
import { StreamVideoProvider } from "@/components/StreamVideoProvider";
import { posthog } from "@/lib/posthog";
import { fontAssets } from "@/theme";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add your Clerk Publishable Key to the .env file.",
  );
}

// Keep the splash screen visible until the Poppins fonts are ready, so we
// never flash a fallback system font before the design system loads.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts(fontAssets);

  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  // Manual screen tracking for Expo Router
  // @see https://docs.expo.dev/router/reference/screen-tracking/
  useEffect(() => {
    if (previousPathname.current !== pathname) {
      // Only forward known-safe params. Spreading every param risks leaking
      // sensitive values (OAuth codes, tokens, email) into analytics.
      const SAFE_PARAM_KEYS = new Set(["source", "ref", "campaign"]);
      const safeParams = Object.fromEntries(
        Object.entries(params).filter(
          ([key, value]) => SAFE_PARAM_KEYS.has(key) && value != null,
        ),
      );

      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...safeParams,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  // App background is always light → dark Android nav bar buttons.
  // Lazy-loaded + guarded so a build without the native module won't crash.
  useEffect(() => {
    if (Platform.OS !== "android") return;
    import("expo-navigation-bar")
      .then((NavigationBar) => NavigationBar.setButtonStyleAsync("dark"))
      .catch(() => {
        // Native module not in this build yet — rebuild to enable. Ignore for now.
      });
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <PostHogProvider
        client={posthog}
        autocapture={{
          captureScreens: false,
          captureTouches: true,
          propsToCapture: ["testID"],
          maxElementsCaptured: 20,
        }}
      >
        <StatusBar style="dark" />
        <IdentifyUser />
        <StreamVideoProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </StreamVideoProvider>
      </PostHogProvider>
    </ClerkProvider>
  );
}
