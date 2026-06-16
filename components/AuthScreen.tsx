import { useSignIn, useSignUp, useSSO } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";

import { Image } from "@/components/Image";
import { AppleIcon, FacebookIcon, GoogleIcon } from "@/components/SocialIcons";
import { VerificationModal } from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { getClerkErrorMessage, withTimeout } from "@/lib/clerk";
import { validateEmail, validatePassword } from "@/lib/validation";
import { colors } from "@/theme";

// Finishes any pending browser-based auth session when the app is re-focused
// after an OAuth redirect. Safe to call at module scope.
WebBrowser.maybeCompleteAuthSession();

type SocialProvider = {
  label: string;
  Icon: (props: { size?: number }) => React.ReactElement;
  strategy: "oauth_google" | "oauth_facebook" | "oauth_apple";
};

const SOCIAL_PROVIDERS: SocialProvider[] = [
  { label: "Continue with Google", Icon: GoogleIcon, strategy: "oauth_google" },
  {
    label: "Continue with Facebook",
    Icon: FacebookIcon,
    strategy: "oauth_facebook",
  },
  { label: "Continue with Apple", Icon: AppleIcon, strategy: "oauth_apple" },
];

type AuthScreenProps = {
  title: string;
  subtitle: string;
  submitLabel: string;
  /**
   * "sign-up" collects an email + password and creates a new account.
   * "sign-in" is passwordless — it emails a one-time code (email-only design).
   */
  mode: "sign-up" | "sign-in";
  footerPrompt: string;
  footerActionLabel: string;
  onFooterAction: () => void;
};

/**
 * Shared layout for the Sign Up and Sign In screens. The two screens are
 * visually identical apart from their copy and the presence of the password
 * field, so they both render this and just configure it through props.
 *
 * Authentication is handled by Clerk:
 * - Sign Up: create account with email + password, then verify via email code.
 * - Sign In: passwordless — request an email code, then verify it.
 * - Social: browser-based OAuth via Clerk's SSO flow.
 */
export function AuthScreen({
  title,
  subtitle,
  submitLabel,
  mode,
  footerPrompt,
  footerActionLabel,
  onFooterAction,
}: AuthScreenProps) {
  const router = useRouter();
  const posthog = usePostHog();
  const isSignUp = mode === "sign-up";

  const { signUp, errors: signUpErrors } = useSignUp();
  const { signIn, errors: signInErrors } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Client-side validation errors (shown instantly, cleared on edit).
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  // Out-of-band error not tied to a field (OAuth / unexpected throw).
  const [formError, setFormError] = useState<string | null>(null);
  // Whether to surface Clerk's field-level errors (hidden again once the user
  // edits an input, so stale server errors don't linger).
  const [serverErrorsShown, setServerErrorsShown] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Clerk routes each error to the field it belongs to. Merge those with the
  // local validation errors so every message renders next to its own input.
  const clerkEmailError = isSignUp
    ? signUpErrors.fields.emailAddress
    : signInErrors.fields.identifier;
  const clerkPasswordError = isSignUp ? signUpErrors.fields.password : null;
  const clerkGlobalError =
    (isSignUp ? signUpErrors : signInErrors).global?.[0] ?? null;

  const emailDisplayError =
    emailError ??
    (serverErrorsShown ? (clerkEmailError?.message ?? null) : null);
  const passwordDisplayError =
    passwordError ??
    (serverErrorsShown ? (clerkPasswordError?.message ?? null) : null);
  const globalDisplayError =
    formError ??
    (serverErrorsShown ? (clerkGlobalError?.message ?? null) : null);

  // Clears any visible errors when the user starts editing a field.
  const clearErrorsOnEdit = () => {
    if (formError) setFormError(null);
    if (serverErrorsShown) setServerErrorsShown(false);
  };

  // After Clerk activates the session, land the user on the home route.
  const finishAuth = () => {
    setModalVisible(false);
    router.replace("/");
  };

  // Validate inputs, kick off the Clerk flow, then open the verification modal.
  const handleSubmit = async () => {
    const nextEmailError = validateEmail(email);
    const nextPasswordError = isSignUp ? validatePassword(password) : null;

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    if (nextEmailError || nextPasswordError) return;

    setFormError(null);
    setServerErrorsShown(false);
    setSubmitting(true);
    try {
      if (isSignUp) {
        // Create the account, then email a verification code.
        const created = await withTimeout(
          signUp.password({ emailAddress: email.trim(), password }),
        );
        if (created.error) {
          // Clerk has tagged this to a field — reveal its field-level errors.
          setServerErrorsShown(true);
          return;
        }

        const sent = await withTimeout(signUp.verifications.sendEmailCode());
        if (sent.error) {
          setServerErrorsShown(true);
          return;
        }
      } else {
        // Passwordless: email a one-time sign-in code.
        const sent = await withTimeout(
          signIn.emailCode.sendCode({ emailAddress: email.trim() }),
        );
        if (sent.error) {
          setServerErrorsShown(true);
          return;
        }
      }

      setVerifyError(null);
      setModalVisible(true);
    } catch (err) {
      setFormError(getClerkErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // Verify the 6-digit code, activate the session, and head home.
  const handleVerify = async (code: string) => {
    setVerifying(true);
    setVerifyError(null);
    try {
      if (isSignUp) {
        const verified = await withTimeout(
          signUp.verifications.verifyEmailCode({ code }),
        );
        if (verified.error) {
          setVerifyError(
            getClerkErrorMessage(
              verified.error,
              "Invalid code. Please try again.",
            ),
          );
          return;
        }

        if (signUp.status === "complete") {
          const finalized = await withTimeout(signUp.finalize());
          if (finalized.error) {
            setVerifyError(getClerkErrorMessage(finalized.error));
            return;
          }
          posthog.identify(email.trim(), {
            $set: { email: email.trim() },
            $set_once: { first_sign_up_date: new Date().toISOString() },
          });
          posthog.capture("user_signed_up");
          finishAuth();
        } else {
          setVerifyError("That code didn't work. Please try again.");
        }
      } else {
        const verified = await withTimeout(
          signIn.emailCode.verifyCode({ code }),
        );
        if (verified.error) {
          setVerifyError(
            getClerkErrorMessage(
              verified.error,
              "Invalid code. Please try again.",
            ),
          );
          return;
        }

        if (signIn.status === "complete") {
          const finalized = await withTimeout(signIn.finalize());
          if (finalized.error) {
            setVerifyError(getClerkErrorMessage(finalized.error));
            return;
          }
          posthog.identify(email.trim(), {
            $set: { email: email.trim() },
          });
          posthog.capture("user_signed_in");
          finishAuth();
        } else {
          setVerifyError("That code didn't work. Please try again.");
        }
      }
    } catch (err) {
      setVerifyError(
        getClerkErrorMessage(err, "Invalid code. Please try again."),
      );
    } finally {
      setVerifying(false);
    }
  };

  // Browser-based OAuth. Providers must be enabled in the Clerk Dashboard.
  const handleSocial = async (strategy: SocialProvider["strategy"]) => {
    setFormError(null);
    posthog.capture("social_auth_started", { provider: strategy, mode });
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: Linking.createURL("/"),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        posthog.capture("user_signed_in", { method: strategy });
        router.replace("/");
      }
    } catch (err) {
      setFormError(getClerkErrorMessage(err));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Fixed header — stays in place while the form scrolls */}
        <View className="px-6">
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="-ml-2 mt-2 h-10 w-10 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={26} color={colors.ink} />
          </TouchableOpacity>

          {/* Heading + subtitle */}
          <Text className="text-h1 mt-3 text-ink">{title}</Text>
          <Text className="text-body-md my-2 text-ink-muted">{subtitle}</Text>
        </View>

        <ScrollView
          className="px-6"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Mascot with floating sparkles */}
          <View className="mt-5 h-44 items-center justify-center">
            <Image
              source={images.mascotAuth}
              className="h-44 w-44"
              contentFit="contain"
            />
            <Ionicons
              name="sparkles"
              size={22}
              color={colors.primary}
              style={{ position: "absolute", top: 14, left: 40 }}
            />
            <Ionicons
              name="sparkles"
              size={16}
              color={colors.warning}
              style={{ position: "absolute", top: 36, left: 96 }}
            />
            <Ionicons
              name="sparkles"
              size={20}
              color={colors.blue}
              style={{ position: "absolute", top: 24, right: 44 }}
            />
            <Ionicons
              name="sparkles"
              size={16}
              color={colors.streak}
              style={{ position: "absolute", top: 84, right: 36 }}
            />
          </View>

          {/* Global error (OAuth / non-field) — kept at the top of the form */}
          {globalDisplayError && (
            <Text className="text-body-sm mb-3 text-center text-error">
              {globalDisplayError}
            </Text>
          )}

          {/* Email field */}
          <View
            className={`rounded-2xl border px-4 py-2.5 ${
              emailDisplayError ? "border-error" : "border-border"
            }`}
          >
            <Text className="text-body-md text-ink-muted">Email</Text>
            <TextInput
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (emailError) setEmailError(null);
                clearErrorsOnEdit();
              }}
              placeholder="you@email.com"
              placeholderTextColor={colors.inkMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              className="text-body-lg p-0 text-ink"
            />
          </View>
          {emailDisplayError && (
            <Text className="text-body-sm mt-1.5 text-error">
              {emailDisplayError}
            </Text>
          )}

          {/* Password field (Sign Up only) */}
          {isSignUp && (
            <>
              <View
                className={`mt-3 flex-row items-center rounded-2xl border px-4 py-2.5 ${
                  passwordDisplayError ? "border-error" : "border-border"
                }`}
              >
                <View className="flex-1">
                  <Text className="text-body-md text-ink-muted">Password</Text>
                  <TextInput
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);
                      if (passwordError) setPasswordError(null);
                      clearErrorsOnEdit();
                    }}
                    placeholder="••••••••"
                    placeholderTextColor={colors.inkMuted}
                    secureTextEntry={passwordHidden}
                    autoCapitalize="none"
                    className="text-body-lg p-0 text-ink"
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setPasswordHidden((hidden) => !hidden)}
                  hitSlop={8}
                >
                  <Ionicons
                    name={passwordHidden ? "eye-outline" : "eye-off-outline"}
                    size={22}
                    color={colors.inkMuted}
                  />
                </TouchableOpacity>
              </View>
              {passwordDisplayError && (
                <Text className="text-body-sm mt-1.5 text-error">
                  {passwordDisplayError}
                </Text>
              )}
            </>
          )}

          {/* Submit */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleSubmit}
            disabled={submitting}
            className={`mt-5 h-16 items-center justify-center rounded-2xl bg-primary ${
              submitting ? "opacity-60" : ""
            }`}
          >
            <Text className="text-h4 text-background">
              {submitting ? "Please wait…" : submitLabel}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="my-5 flex-row items-center">
            <View className="h-px flex-1 bg-border" />
            <Text className="text-body-sm px-3 text-ink-muted">
              or continue with
            </Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          {/* Social auth */}
          {SOCIAL_PROVIDERS.map(({ label, Icon, strategy }) => (
            <TouchableOpacity
              key={label}
              activeOpacity={0.9}
              onPress={() => handleSocial(strategy)}
              className="mb-3 h-14 flex-row items-center justify-center rounded-2xl border border-border"
            >
              <View style={{ position: "absolute", left: 20 }}>
                <Icon size={22} />
              </View>
              <Text className="text-h4 text-ink">{label}</Text>
            </TouchableOpacity>
          ))}

          {/* Clerk bot-protection target (sign-up). Invisible. */}
          {isSignUp && <View nativeID="clerk-captcha" />}
        </ScrollView>
      </KeyboardAvoidingView>

      {/*
       * Fixed footer — pinned to the bottom of the screen. It lives OUTSIDE the
       * KeyboardAvoidingView on purpose, so it stays put (the keyboard slides
       * over it) instead of being lifted above the keyboard while typing.
       */}
      <View className="border-t border-border px-6 pb-2 pt-6">
        <View className="flex-row items-center justify-center">
          <Text className="text-body-md text-ink-muted">{footerPrompt} </Text>
          <TouchableOpacity onPress={onFooterAction} hitSlop={8}>
            <Text className="text-body-md text-primary">
              {footerActionLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <VerificationModal
        visible={modalVisible}
        email={email}
        verifying={verifying}
        error={verifyError}
        onClose={() => setModalVisible(false)}
        onComplete={handleVerify}
      />
    </SafeAreaView>
  );
}
