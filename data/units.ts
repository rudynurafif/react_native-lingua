/**
 * Units group lessons into themed sections for each language
 * (like Duolingo's "Basics 1", "Phrases", ...).
 *
 * Keep unit ids prefixed with the language code, e.g. `es-unit-1`, so they
 * stay unique and easy to scan.
 */
import type { LanguageCode, Unit } from "@/types/learning";

export const units: Unit[] = [
  // ---------------------------------------------------------------- Spanish
  {
    id: "es-unit-1",
    languageId: "es",
    title: "Basics 1",
    description: "Greet people and introduce yourself.",
    order: 1,
    color: "#58CC02",
  },
  {
    id: "es-unit-2",
    languageId: "es",
    title: "Everyday Phrases",
    description: "Polite phrases for daily conversations.",
    order: 2,
    color: "#1CB0F6",
  },

  // ----------------------------------------------------------------- French
  {
    id: "fr-unit-1",
    languageId: "fr",
    title: "Basics 1",
    description: "Say hello and meet new people.",
    order: 1,
    color: "#CE82FF",
  },

  // --------------------------------------------------------------- Japanese
  {
    id: "ja-unit-1",
    languageId: "ja",
    title: "Greetings",
    description: "First words and polite greetings.",
    order: 1,
    color: "#FF4B4B",
  },

  // ----------------------------------------------------------------- English
  {
    id: "en-unit-1",
    languageId: "en",
    title: "Basics 1",
    description: "Greet people and introduce yourself.",
    order: 1,
    color: "#58CC02",
  },

  // ------------------------------------------------------------------ German
  {
    id: "de-unit-1",
    languageId: "de",
    title: "Basics 1",
    description: "Say hello and meet new people.",
    order: 1,
    color: "#1CB0F6",
  },

  // -------------------------------------------------------------- Indonesian
  {
    id: "id-unit-1",
    languageId: "id",
    title: "Basics 1",
    description: "Everyday greetings in Bahasa Indonesia.",
    order: 1,
    color: "#CE82FF",
  },

  // ----------------------------------------------------------------- Chinese
  {
    id: "zh-unit-1",
    languageId: "zh",
    title: "Greetings",
    description: "First words in Mandarin Chinese.",
    order: 1,
    color: "#FF9600",
  },

  // ----------------------------------------------------------------- Italian
  {
    id: "it-unit-1",
    languageId: "it",
    title: "Basics 1",
    description: "Greet people the Italian way.",
    order: 1,
    color: "#FFC800",
  },

  // -------------------------------------------------------------- Portuguese
  {
    id: "pt-unit-1",
    languageId: "pt",
    title: "Basics 1",
    description: "Greetings and polite words.",
    order: 1,
    color: "#58CC02",
  },

  // ------------------------------------------------------------------ Korean
  {
    id: "ko-unit-1",
    languageId: "ko",
    title: "Greetings",
    description: "First polite greetings in Korean.",
    order: 1,
    color: "#1CB0F6",
  },

  // ----------------------------------------------------------------- Russian
  {
    id: "ru-unit-1",
    languageId: "ru",
    title: "Greetings",
    description: "First words and polite greetings.",
    order: 1,
    color: "#CE82FF",
  },

  // ------------------------------------------------------------------ Arabic
  {
    id: "ar-unit-1",
    languageId: "ar",
    title: "Greetings",
    description: "First words and polite greetings.",
    order: 1,
    color: "#FF9600",
  },

  // ------------------------------------------------------------------- Hindi
  {
    id: "hi-unit-1",
    languageId: "hi",
    title: "Greetings",
    description: "First words and polite greetings.",
    order: 1,
    color: "#FFC800",
  },
];

/** All units for a language, sorted by their display order. */
export const getUnitsByLanguage = (languageId: LanguageCode): Unit[] =>
  units
    .filter((unit) => unit.languageId === languageId)
    .sort((a, b) => a.order - b.order);

/** Find a single unit by id. */
export const getUnit = (id: string): Unit | undefined =>
  units.find((unit) => unit.id === id);
