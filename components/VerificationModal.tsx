import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const CODE_LENGTH = 6;

type VerificationModalProps = {
  visible: boolean;
  /** Email we pretend the code was sent to — shown in the copy. */
  email?: string;
  onClose: () => void;
  /** Fired automatically once all 6 digits are entered. */
  onComplete: (code: string) => void;
};

/**
 * A bottom-sheet style modal that asks the user for the 6-digit code we
 * "emailed" them. It stays above the keyboard, uses the number pad, and
 * auto-submits the moment the last digit is typed.
 */
export function VerificationModal({
  visible,
  email,
  onClose,
  onComplete,
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  // Reset the code every time the modal opens so a re-open starts fresh.
  useEffect(() => {
    if (visible) {
      setCode("");
    }
  }, [visible]);

  const handleChange = (value: string) => {
    const digits = value.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    setCode(digits);

    if (digits.length === CODE_LENGTH) {
      Keyboard.dismiss();
      onComplete(digits);
    }
  };

  const focusInput = () => inputRef.current?.focus();

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

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className="rounded-t-3xl bg-background px-6 pb-12 pt-3">
            {/* Grabber */}
            <View className="mb-5 h-1.5 w-12 self-center rounded-full bg-border" />

            <Text className="text-h2 text-ink">Check your email</Text>
            <Text className="text-body-md mt-2 text-ink-muted">
              We sent a 6-digit verification code to{" "}
              <Text className="text-ink">{email || "your email"}</Text>. Enter
              it below to continue.
            </Text>

            {/* Code cells — tapping anywhere focuses the hidden input */}
            <Pressable
              onPress={focusInput}
              className="mt-7 flex-row justify-between"
            >
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
            </Pressable>

            {/* Hidden input that actually captures keystrokes */}
            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={handleChange}
              keyboardType="number-pad"
              maxLength={CODE_LENGTH}
              autoFocus
              textContentType="oneTimeCode"
              style={{ position: "absolute", opacity: 0, height: 1, width: 1 }}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
