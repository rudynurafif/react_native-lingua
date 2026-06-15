/**
 * Supported languages.
 *
 * Add a new language by adding a `LanguageCode` in `types/learning.ts` and a
 * new entry here, then add its units and lessons in `units.ts` / `lessons.ts`.
 */
import type { Language, LanguageCode } from "@/types/learning";

export const languages: Language[] = [
  {
    id: "es",
    name: "Spanish",
    nativeName: "Español",
    countryCode: "es",
    description: "Spoken in Spain and across Latin America.",
    learners: 28_400_000,
    available: true,
  },
  {
    id: "fr",
    name: "French",
    nativeName: "Français",
    countryCode: "fr",
    description: "The language of France, Canada, and West Africa.",
    learners: 19_400_000,
    available: true,
  },
  {
    id: "ja",
    name: "Japanese",
    nativeName: "日本語",
    // Language code is "ja", but Japan's flagcdn country code is "jp".
    countryCode: "jp",
    description: "Start with everyday greetings and hiragana sounds.",
    learners: 12_700_000,
    available: true,
  },

  // --- More world languages ----------------------------------------------
  {
    id: "en",
    name: "English",
    nativeName: "English",
    countryCode: "gb",
    description: "The world's most common second language.",
    learners: 41_000_000,
    available: true,
  },
  {
    id: "de",
    name: "German",
    nativeName: "Deutsch",
    countryCode: "de",
    description: "Spoken across Germany, Austria, and Switzerland.",
    learners: 8_100_000,
    available: true,
  },
  {
    id: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    countryCode: "id",
    description: "An easy-to-start language for over 270 million people.",
    learners: 3_200_000,
    available: true,
  },
  {
    id: "zh",
    name: "Chinese",
    nativeName: "中文",
    // Language code "zh" maps to China's country code "cn".
    countryCode: "cn",
    description: "Mandarin, the most spoken language in the world.",
    learners: 7_400_000,
    available: true,
  },
  {
    id: "it",
    name: "Italian",
    nativeName: "Italiano",
    countryCode: "it",
    description: "The melodic language of Italy.",
    learners: 6_100_000,
    available: true,
  },
  {
    id: "pt",
    name: "Portuguese",
    nativeName: "Português",
    // Most speakers are in Brazil, so we show the Brazilian flag.
    countryCode: "br",
    description: "Spoken in Brazil, Portugal, and beyond.",
    learners: 5_500_000,
    available: true,
  },
  {
    id: "ko",
    name: "Korean",
    nativeName: "한국어",
    // Language code "ko" maps to South Korea's country code "kr".
    countryCode: "kr",
    description: "Learn Hangul and everyday Korean.",
    learners: 9_300_000,
    available: true,
  },
  {
    id: "ru",
    name: "Russian",
    nativeName: "Русский",
    countryCode: "ru",
    description: "The most spoken Slavic language.",
    learners: 4_800_000,
    available: true,
  },
  {
    id: "ar",
    name: "Arabic",
    nativeName: "العربية",
    // Arabic isn't tied to one country; we use Saudi Arabia's flag.
    countryCode: "sa",
    description: "A major world language across the Middle East.",
    learners: 4_200_000,
    available: true,
  },
  {
    id: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    // Language code "hi" maps to India's country code "in".
    countryCode: "in",
    description: "One of India's most widely spoken languages.",
    learners: 3_900_000,
    available: true,
  },
];

/**
 * The handful of languages featured in the "Popular" section of the language
 * selection screen. Listed in the exact order they should appear (most
 * learners first), matching the design reference.
 */
const POPULAR_IDS: LanguageCode[] = ["es", "fr", "ja", "ko", "de", "zh"];

export const popularLanguages: Language[] = POPULAR_IDS.map(
  (id) => languages.find((language) => language.id === id)!,
);

/** Find a single language by its code. */
export const getLanguage = (id: LanguageCode): Language | undefined =>
  languages.find((language) => language.id === id);

/**
 * Build a flag image URL from a language's `countryCode`.
 * Pass `width` to pick a flagcdn size (e.g. 160, 320, 640).
 */
export const getFlagUrl = (language: Language, width: number = 320): string =>
  `https://flagcdn.com/w${width}/${language.countryCode}.png`;

/**
 * Format a learner count into a short, friendly label, e.g.
 * `28_400_000 -> "28.4M"`, `9_300_000 -> "9.3M"`, `820_000 -> "820K"`.
 */
export const formatLearners = (count: number): string => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${Math.round(count / 1_000)}K`;
  return `${count}`;
};
