/**
 * Global store for the learner's selected language.
 *
 * The choice is persisted to the device with AsyncStorage so it survives app
 * restarts. We also track whether the persisted value has finished loading
 * (`hasHydrated`) — until then we don't know if a language was chosen, so the
 * routing logic in `app/index.tsx` waits before redirecting.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { LanguageCode } from "@/types/learning";

interface LanguageState {
  /** The chosen language, or null if the learner hasn't picked one yet. */
  selectedLanguage: LanguageCode | null;
  /** True once the persisted value has been read back from AsyncStorage. */
  hasHydrated: boolean;
  /** Save the learner's language choice. */
  setLanguage: (language: LanguageCode) => void;
  /** Forget the choice (used by the "clear storage" test button). */
  clearLanguage: () => void;
  /** Internal: flip `hasHydrated` once rehydration completes. */
  setHasHydrated: (value: boolean) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguage: null,
      hasHydrated: false,
      setLanguage: (language) => set({ selectedLanguage: language }),
      clearLanguage: () => set({ selectedLanguage: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the choice itself — `hasHydrated` is runtime-only.
      partialize: (state) => ({ selectedLanguage: state.selectedLanguage }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
