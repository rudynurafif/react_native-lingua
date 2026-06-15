import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

import { Image } from "@/components/Image";
import { AppleIcon, FacebookIcon, GoogleIcon } from "@/components/SocialIcons";
import { VerificationModal } from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { validateEmail, validatePassword } from "@/lib/validation";
import { colors } from "@/theme";

type SocialProvider = {
  label: string;
  Icon: (props: { size?: number }) => React.ReactElement;
};

const SOCIAL_PROVIDERS: SocialProvider[] = [
  { label: "Continue with Google", Icon: GoogleIcon },
  { label: "Continue with Facebook", Icon: FacebookIcon },
  { label: "Continue with Apple", Icon: AppleIcon },
];

type AuthScreenProps = {
  title: string;
  subtitle: string;
  submitLabel: string;
  /** Sign Up shows a password field; Sign In is email-only. */
  showPassword?: boolean;
  footerPrompt: string;
  footerActionLabel: string;
  onFooterAction: () => void;
};

/**
 * Shared layout for the Sign Up and Sign In screens. The two screens are
 * visually identical apart from their copy and the presence of the password
 * field, so they both render this and just configure it through props.
 */
export function AuthScreen({
  title,
  subtitle,
  submitLabel,
  showPassword = false,
  footerPrompt,
  footerActionLabel,
  onFooterAction,
}: AuthScreenProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Validate the inputs and only open the verification modal when they pass.
  const handleSubmit = () => {
    const nextEmailError = validateEmail(email);
    const nextPasswordError = showPassword ? validatePassword(password) : null;

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (!nextEmailError && !nextPasswordError) {
      setModalVisible(true);
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
          <View className="my-5 h-44 items-center justify-center">
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

          {/* Email field */}
          <View
            className={`rounded-2xl border px-4 py-2.5 ${
              emailError ? "border-error" : "border-border"
            }`}
          >
            <Text className="text-body-md text-ink-muted">Email</Text>
            <TextInput
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (emailError) setEmailError(null);
              }}
              placeholder="you@email.com"
              placeholderTextColor={colors.inkMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              className="text-body-lg p-0 text-ink"
            />
          </View>
          {emailError && (
            <Text className="text-body-sm mt-1.5 text-error">{emailError}</Text>
          )}

          {/* Password field (Sign Up only) */}
          {showPassword && (
            <>
              <View
                className={`mt-3 flex-row items-center rounded-2xl border px-4 py-2.5 ${
                  passwordError ? "border-error" : "border-border"
                }`}
              >
                <View className="flex-1">
                  <Text className="text-body-md text-ink-muted">Password</Text>
                  <TextInput
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);
                      if (passwordError) setPasswordError(null);
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
              {passwordError && (
                <Text className="text-body-sm mt-1.5 text-error">
                  {passwordError}
                </Text>
              )}
            </>
          )}

          {/* Submit */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleSubmit}
            className="mt-5 h-16 items-center justify-center rounded-2xl bg-primary"
          >
            <Text className="text-h4 text-background">{submitLabel}</Text>
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
          {SOCIAL_PROVIDERS.map(({ label, Icon }) => (
            <TouchableOpacity
              key={label}
              activeOpacity={0.9}
              className="mb-3 h-14 flex-row items-center justify-center rounded-2xl border border-border"
            >
              <View style={{ position: "absolute", left: 20 }}>
                <Icon size={22} />
              </View>
              <Text className="text-h4 text-ink">{label}</Text>
            </TouchableOpacity>
          ))}

          {/* Footer */}
          <View className="mt-4 flex-row items-center justify-center">
            <Text className="text-body-md text-ink-muted">{footerPrompt} </Text>
            <TouchableOpacity onPress={onFooterAction} hitSlop={8}>
              <Text className="text-body-md text-primary">
                {footerActionLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal
        visible={modalVisible}
        email={email}
        onClose={() => setModalVisible(false)}
        onComplete={() => {
          setModalVisible(false);
          router.replace("/");
        }}
      />
    </SafeAreaView>
  );
}
