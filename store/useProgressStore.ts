/**
 * Local learning progress (no backend).
 *
 * Tracks which lessons the learner has completed, the lesson they last
 * opened (the "in progress" one), and their total XP. Everything is persisted
 * to the device with AsyncStorage so progress survives app restarts.
 *
 * The Lessons screen derives each card's status (completed / in progress /
 * not started) from this store — see `app/(tabs)/learn.tsx`.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProgressState {
  /** Ids of lessons the learner has finished. */
  completedLessons: string[];
  /** Id of the lesson the learner most recently opened, or null. */
  currentLessonId: string | null;
  /** Total XP earned across all completed lessons. */
  xp: number;

  /** True once a lesson id is in `completedLessons`. */
  isCompleted: (lessonId: string) => boolean;
  /** Remember which lesson the learner just opened (marks it "in progress"). */
  openLesson: (lessonId: string) => void;
  /** Mark a lesson complete and award its XP (idempotent). */
  completeLesson: (lessonId: string, xpReward: number) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      currentLessonId: null,
      xp: 0,

      isCompleted: (lessonId) => get().completedLessons.includes(lessonId),

      openLesson: (lessonId) => set({ currentLessonId: lessonId }),

      completeLesson: (lessonId, xpReward) =>
        set((state) => {
          // Don't double-count XP if the lesson is already complete.
          if (state.completedLessons.includes(lessonId)) {
            return state;
          }
          return {
            completedLessons: [...state.completedLessons, lessonId],
            xp: state.xp + xpReward,
          };
        }),
    }),
    {
      name: "progress-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Persist only the data, not the action functions.
      partialize: (state) => ({
        completedLessons: state.completedLessons,
        currentLessonId: state.currentLessonId,
        xp: state.xp,
      }),
    },
  ),
);
