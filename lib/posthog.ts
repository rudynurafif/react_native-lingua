import PostHog from "posthog-react-native";
import Constants from "expo-constants";

const apiKey = Constants.expoConfig?.extra?.posthogProjectToken as
  | string
  | undefined;
const host = Constants.expoConfig?.extra?.posthogHost as string | undefined;

const isConfigured = !!apiKey && apiKey !== "phc_your_project_token_here";

// Only send analytics from release builds. In development (`__DEV__`) we keep
// PostHog disabled so local test sessions don't pollute production data — and
// so its network flush retries don't spam the Metro logs. Flip this to just
// `isConfigured` temporarily if you need to verify events while developing.
// const enabled = isConfigured && !__DEV__;
const enabled = isConfigured;

if (!isConfigured) {
  console.warn(
    "PostHog project token not configured. Analytics will be disabled. " +
      "Set POSTHOG_PROJECT_TOKEN in your .env file to enable analytics.",
  );
}

export const posthog = new PostHog(apiKey ?? "placeholder_key", {
  host,
  disabled: !enabled,
  captureAppLifecycleEvents: true,
  flushAt: 20,
  flushInterval: 10000,
  maxBatchSize: 100,
  maxQueueSize: 1000,
  preloadFeatureFlags: true,
  sendFeatureFlagEvent: true,
  featureFlagsRequestTimeoutMs: 10000,
  requestTimeout: 10000,
  fetchRetryCount: 3,
  fetchRetryDelay: 3000,
});
