export default {
  expo: {
    name: "duolingo-clone",
    slug: "duolingo-clone",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "duolingoclone",
    userInterfaceStyle: "automatic",
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
          cameraPermission:
            "Lingua needs camera access for video lessons.",
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
