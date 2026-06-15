import "../global.css";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { fontAssets } from "@/theme";
import { Platform } from "react-native";

// Keep the splash screen visible until the Poppins fonts are ready, so we
// never flash a fallback system font before the design system loads.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts(fontAssets);

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

  return <Stack screenOptions={{ headerShown: false }} />;
}
