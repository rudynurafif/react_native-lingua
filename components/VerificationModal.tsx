import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme";

const CODE_LENGTH = 6;

type VerificationModalProps = {
  visible: boolean;
  /** Email the code was sent to — shown in the copy. */
  email?: string;
  /** True while the code is being verified against Clerk. */
  verifying?: boolean;
  /** Error message from a failed verification attempt, if any. */
  error?: string | null;
  onClose: () => void;
  /** Fired automatically once all 6 digits are entered. */
  onComplete: (code: string) => void;
};

/**
 * A bottom-sheet style modal that asks the user for the 6-digit code Clerk
 * emailed them. It stays above the keyboard, uses the number pad, and
 * auto-submits the moment the last digit is typed.
 */
export function VerificationModal({
  visible,
  email,
  verifying = false,
  error,
  onClose,
  onComplete,
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();

  // Reset the code every time the modal opens so a re-open starts fresh.
  useEffect(() => {
    if (visible) {
      setCode("");
    }
  }, [visible]);

  // Lift the sheet above the keyboard ourselves. A RN `Modal` renders in its
  // own Android window that ignores the activity's `adjustResize`, so
  // `KeyboardAvoidingView` doesn't push content up there — the keyboard would
  // cover the code inputs. Instead we track the keyboard height and pad the
  // sheet by it. (iOS uses the *will* events for a smoother slide.)
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) =>
      setKeyboardHeight(e.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Raises the soft keyboard. On Android, calling `.focus()` on a TextInput
  // that the OS still considers focused (e.g. after the keyboard was dismissed
  // with the back button) is a no-op, and focusing right as the modal mounts
  // is unreliable — so we blur first and focus on the next tick.
  const focusInput = () => {
    const input = inputRef.current;
    if (!input) return;

    if (Platform.OS === "android") {
      input.blur();
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      input.focus();
    }
  };

  // After a failed attempt, clear the entry so the user can retype cleanly.
  useEffect(() => {
    if (error) {
      setCode("");
      focusInput();
    }
  }, [error]);

  const handleChange = (value: string) => {
    if (verifying) return;

    const digits = value.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    setCode(digits);

    if (digits.length === CODE_LENGTH) {
      Keyboard.dismiss();
      onComplete(digits);
    }
  };

  // How far to lift the sheet so it sits right above the keyboard.
  // In edge-to-edge mode (Expo SDK 54+), Android reports the keyboard height
  // only up to the navigation-bar inset, so lifting by the raw height leaves
  // the sheet a little short and the bar clips the code inputs. Add the bottom
  // inset back on Android to fully clear the keyboard. iOS reports the full
  // height already, so it's used as-is.
  const liftAboveKeyboard =
    keyboardHeight > 0 && Platform.OS === "android"
      ? keyboardHeight + insets.bottom
      : keyboardHeight;

  // Bottom padding inside the sheet. With the keyboard up the navigation bar is
  // hidden behind it, so a fixed pad is enough. With the keyboard down (and
  // edge-to-edge on), add the bottom inset so the content clears the system
  // bar instead of sitting flush against it.
  const sheetPaddingBottom = keyboardHeight > 0 ? 48 : 48 + insets.bottom;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onShow={focusInput}
      statusBarTranslucent
    >
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        {/* Dim backdrop — tap to dismiss */}
        <Pressable
          onPress={onClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(13,19,43,0.45)" }]}
        />

        <View
          className="rounded-t-3xl bg-background px-6 pt-3"
          style={{
            marginBottom: liftAboveKeyboard,
            paddingBottom: sheetPaddingBottom,
          }}
        >
          {/* Grabber */}
            <View className="mb-5 h-1.5 w-12 self-center rounded-full bg-border" />

            <Text className="text-h2 text-ink">Check your email</Text>
            <Text className="text-body-md mt-2 text-ink-muted">
              We sent a 6-digit verification code to{" "}
              <Text className="text-ink">{email || "your email"}</Text>. Enter
              it below to continue.
            </Text>

            {/*
             * Code entry. The cells are purely visual; a transparent TextInput
             * is layered on top of them (absolute fill) so a tap lands directly
             * on the input — the most reliable way to raise the Android soft
             * keyboard. A tiny/offscreen hidden input does not focus reliably.
             */}
            <View className="mt-7">
              <View className="flex-row justify-between" pointerEvents="none">
                {Array.from({ length: CODE_LENGTH }).map((_, index) => {
                  const digit = code[index] ?? "";
                  const isActive = index === code.length;

                  return (
                    <View
                      key={index}
                      className={`h-15 w-12 items-center justify-center rounded-2xl border ${
                        digit || isActive
                          ? "border-primary bg-[#F1EEFE]"
                          : "border-border bg-surface"
                      }`}
                    >
                      <Text className="text-h2 text-ink">{digit}</Text>
                    </View>
                  );
                })}
              </View>

              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={handleChange}
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                editable={!verifying}
                caretHidden
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                style={[StyleSheet.absoluteFill, { opacity: 0 }]}
              />
            </View>

            {/* Verifying spinner / error feedback */}
            {verifying && (
              <View className="mt-4 flex-row items-center justify-center">
                <ActivityIndicator color={colors.primary} />
                <Text className="text-body-sm ml-2 text-ink-muted">
                  Verifying…
                </Text>
              </View>
            )}
            {!verifying && error && (
              <Text className="text-body-sm mt-4 text-center text-error">
                {error}
              </Text>
            )}
        </View>
      </View>
    </Modal>
  );
}
