<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Lingua Expo app. PostHog is initialised in `lib/posthog.ts` via `expo-constants` extras (loaded from `.env` at build time), wrapped with `PostHogProvider` in the root layout, and instrumented across four key screens. Screen tracking fires automatically on every route change via `posthog.screen()`. Users are identified by email on successful sign-up and sign-in, and reset on sign-out.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user completes email verification and account creation | `components/AuthScreen.tsx` |
| `user_signed_in` | Existing user completes email code or OAuth sign-in | `components/AuthScreen.tsx` |
| `social_auth_started` | User taps a social OAuth button (Google, Facebook, Apple) | `components/AuthScreen.tsx` |
| `language_selected` | User confirms their chosen learning language | `app/languages.tsx` |
| `lesson_continued` | User taps Continue on the home screen to resume a unit | `app/(tabs)/home.tsx` |
| `plan_item_tapped` | User taps one of Today's Plan items (lesson, conversation, words) | `app/(tabs)/home.tsx` |
| `user_signed_out` | User signs out from the profile screen (churn signal) | `app/(tabs)/profile.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/473484/dashboard/1721694)
- [Acquisition funnel: Sign-up → Language → First lesson](https://us.posthog.com/project/473484/insights/NkNHYyR9)
- [New sign-ups over time](https://us.posthog.com/project/473484/insights/sjmyOaM7)
- [Language popularity](https://us.posthog.com/project/473484/insights/GaiWelAu)
- [Daily active learners (lesson_continued)](https://us.posthog.com/project/473484/insights/b9bmVSjk)
- [Churn signal: sign-outs over time](https://us.posthog.com/project/473484/insights/vHqRHEqm)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any team bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. Currently `identify` is called on each successful email or OAuth sign-in, which covers returning users. Verify this fires correctly by signing in with an existing account and checking PostHog for the identified event.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
