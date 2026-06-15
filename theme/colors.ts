/**
 * lingua — Color tokens
 *
 * Single source of truth for colors on the JS/TS side (StyleSheet,
 * navigation themes, status bar, charts — anywhere className can't reach).
 * These values mirror the @theme block in global.css and the design
 * reference in prompt_material/01-design-system.png exactly.
 */
export const colors = {
  // --- Brand / Primary ---
  primary: "#6C4EF5", // Lingua Purple
  primaryDeep: "#5B3BF6", // Lingua Deep Purple
  blue: "#4D8BFF", // Lingua Blue
  green: "#21C16B", // Lingua Green

  // --- Semantic ---
  success: "#21C16B",
  warning: "#FFC800",
  streak: "#FF8A00",
  error: "#FF4D4F",
  info: "#4D8BFF",

  // --- Neutrals ---
  ink: "#0D132B", // Text / Primary
  inkMuted: "#6B7280", // Text / Secondary
  border: "#E5E7EB", // Border
  surface: "#F6F7FB", // Surface
  background: "#FFFFFF", // Background
} as const;

export type ColorToken = keyof typeof colors;
