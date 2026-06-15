/**
 * Type definitions for the learning content system.
 *
 * The whole content tree is hardcoded TypeScript (no database):
 *
 *   Language  ->  Unit  ->  Lesson  ->  Activity
 *
 * A Lesson also carries the raw teaching material (vocabulary + phrases),
 * its learning goals, and an `aiTeacherPrompt` used later by the audio-based
 * Vision Agent teacher.
 *
 * Keep these types small and readable so new languages/units/lessons are easy
 * to add without touching the screens.
 */

/** Supported language codes. Add a new code here to introduce a language. */
export type LanguageCode =
  | "es" // Spanish
  | "fr" // French
  | "ja" // Japanese
  | "en" // English
  | "de" // German
  | "id" // Indonesian
  | "zh" // Chinese (Mandarin)
  | "it" // Italian
  | "pt" // Portuguese
  | "ko" // Korean
  | "ru" // Russian
  | "ar" // Arabic
  | "hi"; // Hindi

export interface Language {
  /** Stable id, same as the language code. */
  id: LanguageCode;
  /** English display name, e.g. "Spanish". */
  name: string;
  /** Name in the language itself, e.g. "Español". */
  nativeName: string;
  /**
   * ISO country code used to build the flag URL (flagcdn.com).
   * Often matches the language code, but not always — e.g. language "ja"
   * uses country "jp". Use `getFlagUrl` to turn this into an image URL.
   */
  countryCode: string;
  /** Short, friendly one-liner shown under the language. */
  description: string;
  /** Approximate number of learners, used for the "X learners" label. */
  learners: number;
  /** Whether the language is playable yet (false = "coming soon"). */
  available: boolean;
}

/**
 * How a lesson is delivered. The content shape is the same for all of them;
 * the type only changes how a screen presents it.
 *
 * - `video`      AI teacher video lesson (Stream Vision Agent)
 * - `audio`      audio-only lesson (Vision Agent voice teacher)
 * - `chat`       text chat with the AI tutor
 * - `vocabulary` flashcard-style vocabulary review
 */
export type LessonType = "video" | "audio" | "chat" | "vocabulary";

/**
 * Interactive exercise types inside a lesson.
 *
 * - `multipleChoice` pick the correct option
 * - `translate`      type/say the translation
 * - `listen`         hear it, then choose what you heard
 * - `speak`          repeat the phrase out loud
 * - `match`          match words to their translations
 */
export type ActivityType =
  | "multipleChoice"
  | "translate"
  | "listen"
  | "speak"
  | "match";

export interface ActivityOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface Activity {
  id: string;
  type: ActivityType;
  /** Question or instruction shown to the learner. */
  prompt: string;
  /** Choices for `multipleChoice` / `match` / `listen`. */
  options?: ActivityOption[];
  /** Expected answer for `translate` / `speak`. */
  answer?: string;
  /** Optional helper shown on request. */
  hint?: string;
}

export interface Vocabulary {
  id: string;
  /** Word in the target language. */
  word: string;
  /** Meaning in the user's language (English here). */
  translation: string;
  /** Simple pronunciation guide, e.g. "OH-lah". */
  phonetic?: string;
  /** Short example sentence in the target language. */
  example?: string;
}

export interface Phrase {
  id: string;
  /** Phrase in the target language. */
  text: string;
  /** Translation in English. */
  translation: string;
  /** Simple pronunciation guide. */
  phonetic?: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  languageId: LanguageCode;
  title: string;
  type: LessonType;
  /** Order of the lesson within its unit (1-based). */
  order: number;
  /** XP awarded on completion. */
  xpReward: number;
  /** What the learner should be able to do after this lesson. */
  goals: string[];
  vocabulary: Vocabulary[];
  phrases: Phrase[];
  activities: Activity[];
  /**
   * System prompt for the future audio-based Vision Agent teacher.
   * Describes the teacher persona and what to drill in this lesson.
   */
  aiTeacherPrompt: string;
}

export interface Unit {
  id: string;
  languageId: LanguageCode;
  title: string;
  description: string;
  /** Order of the unit within its language (1-based). */
  order: number;
  /** Accent color (hex) used to theme the unit in the UI. */
  color: string;
}
