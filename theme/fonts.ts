/**
 * lingua — Font tokens
 *
 * The keys here are the font family names registered with expo-font in
 * app/_layout.tsx and referenced from global.css (--font-* variables).
 * Use `fonts.*` when setting fontFamily in StyleSheet / inline styles.
 */
export const fonts = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semibold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

/** Map of font family name -> asset, consumed by useFonts(). */
export const fontAssets = {
  "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
  "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
  "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
  "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
};

export type FontToken = keyof typeof fonts;
