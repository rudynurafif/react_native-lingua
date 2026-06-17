import { useAuth } from "@clerk/expo";
import { useEffect } from "react";

import { posthog } from "@/lib/posthog";
import { useLanguageStore } from "@/store/useLanguageStore";

/**
 * Identifies the signed-in learner with PostHog.
 *
 * Rendered once at the root (inside ClerkProvider) so it runs no matter which
 * screen completes authentication — the email-code flow, OAuth, or a returning
 * user whose session is restored from the token cache on launch. Whenever Clerk
 * reports an active session we call `identify` with the Clerk user id as the
 * distinct id, so a learner's events stay tied to one stable id across sign-ins
 * and devices.
 *
 * - `signup_date` is sent via `$set_once`, so PostHog records it only on the
 *   first identify and never overwrites it afterwards.
 * - `preferred_language` is sent via `$set` on every identify, so it stays in
 *   sync if the learner picks a different language later (the effect re-runs
 *   when the stored language changes).
 */
export function IdentifyUser() {
  const { isSignedIn, userId } = useAuth();
  const selectedLanguage = useLanguageStore((s) => s.selectedLanguage);

  useEffect(() => {
    if (!isSignedIn || !userId) return;

    posthog.identify(userId, {
      $set: { preferred_language: selectedLanguage ?? null },
      $set_once: { signup_date: new Date().toISOString() },
    });
  }, [isSignedIn, userId, selectedLanguage]);

  return null;
}
