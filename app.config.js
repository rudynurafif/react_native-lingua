export default {
  expo: {
    name: "lingua",
    slug: "lingua",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "duolingoclone",
    // The app is light-only (white screens, dark status bar). Locking the UI
    // style to "light" stops a dark-mode device from painting the Android
    // system bars for a dark theme — which is why the edge-to-edge navigation
    // bar buttons were showing up white on our white background.
    userInterfaceStyle: "light",
    // Dark icons on the Android nav bar so the 3 system buttons stay visible
    // against our white app background. With edge-to-edge enabled the runtime
    // API (expo-navigation-bar setButtonStyleAsync) is a no-op, so this has to
    // be set on the native theme — `barStyle: "dark-content"` maps to
    // `android:windowLightNavigationBar=true`.
    androidNavigationBar: {
      barStyle: "dark-content",
    },
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.rudynurafif.duolingoclone",
    },
    android: {
      package: "com.rudynurafif.duolingoclone",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      // "server" (not "static") is required so the Expo Router API routes
      // (app/api/**+api.ts) run as real server handlers — that's where the
      // Stream secret lives and where call/token creation happens.
      output: "server",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      "@clerk/expo",
      "expo-secure-store",
      "expo-web-browser",
      "expo-localization",
      // Stream Video — wires the native WebRTC side on prebuild.
      "@stream-io/video-react-native-sdk",
      [
        "@config-plugins/react-native-webrtc",
        {
          // Audio lessons only need the mic, but the WebRTC module declares
          // the camera permission too; give both honest, user-facing copy.
          cameraPermission: "Lingua needs camera access for video lessons.",
          microphonePermission:
            "Lingua needs microphone access so you can speak with your AI teacher during audio lessons.",
        },
      ],
      // Stream Video requires Android minSdk 24.
      ["expo-build-properties", { android: { minSdkVersion: 24 } }],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
      posthogHost: process.env.POSTHOG_HOST,
    },
  },
};
