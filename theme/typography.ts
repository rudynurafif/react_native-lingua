/**
 * lingua — Typography scale
 *
 * Mirrors the type scale in the design reference. Each entry bundles the
 * font family, size, and absolute line height (px) — line heights are the
 * design's ratio rounded to the nearest pixel, since React Native expects
 * an absolute lineHeight. Prefer the matching `text-*` utility from
 * global.css in JSX; use these tokens only where className can't reach.
 */
import { fonts } from "./fonts";

export const typography = {
  h1: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 38 }, // Page / Screen Title — 1.2
  h2: { fontFamily: fonts.semibold, fontSize: 24, lineHeight: 31 }, // Section Title — 1.3
  h3: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 26 }, // Card / Module Title — 1.3
  h4: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 22 }, // Subheading — 1.4
  bodyLg: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 26 }, // Important content — 1.6
  bodyMd: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 22 }, // Body text — 1.6
  bodySm: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 21 }, // Supporting text — 1.6
  caption: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 15 }, // Labels, meta text — 1.4
} as const;

export type TypographyToken = keyof typeof typography;
