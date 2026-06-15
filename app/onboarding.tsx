import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/Image";
import { images } from "@/constants/images";

/**
 * A small tilted speech bubble with a tail, used to decorate the mascot.
 * Colors are soft tints of the lingua design-system colors.
 *
 * Only the rotation (transform array) and the per-bubble offsets (dynamic
 * runtime values) use inline styles — everything else is NativeWind.
 */
function SpeechBubble({
  label,
  bubbleClassName,
  textClassName,
  rotate,
  tailSide,
  position,
}: {
  label: string;
  bubbleClassName: string;
  textClassName: string;
  rotate: string;
  tailSide: "left" | "right";
  position: { top: number; left?: number; right?: number };
}) {
  return (
    <View className="absolute" style={{ ...position, transform: [{ rotate }] }}>
      <View className={`rounded-2xl px-4 py-2 ${bubbleClassName}`}>
        <Text className={`text-h4 ${textClassName}`}>{label}</Text>
      </View>

      {/* Tail — a rotated square poking out from the bottom edge */}
      <View
        className={`absolute -bottom-0.75 h-3 w-3 rounded-xs ${bubbleClassName} ${
          tailSide === "left" ? "left-4" : "right-4"
        }`}
        style={{ transform: [{ rotate: "45deg" }] }}
      />
    </View>
  );
}

export default function Onboarding() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="flex-1 px-6">
        {/* Logo */}
        <View className="mt-2 flex-row items-center justify-center gap-2">
          <Image
            source={images.mascotLogo}
            className="h-8.5 w-8.5"
            contentFit="contain"
          />
          <Text className="text-h2 text-ink">lingua</Text>
        </View>

        {/* Heading + subtitle */}
        <View className="mt-10">
          <Text className="text-h1 text-ink">Your AI language</Text>
          <Text className="text-h1 text-primary">teacher.</Text>
          <Text className="text-body-lg mt-3 text-ink-muted">
            Real conversations, personalized lessons, anytime, anywhere.
          </Text>
        </View>

        {/* Mascot with floating speech bubbles */}
        <View className="flex-1 items-center justify-center">
          <View className="relative h-75 w-75 items-center justify-center">
            <Image
              source={images.mascotWelcome}
              className="h-75 w-75"
              contentFit="contain"
            />

            {/* Hello! — upper left, tilted left */}
            <SpeechBubble
              label="Hello!"
              bubbleClassName="bg-[#EBE9F7]"
              textClassName="text-ink"
              rotate="-9deg"
              tailSide="left"
              position={{ top: 56, left: 0 }}
            />

            {/* ¡Hola! — upper right, tilted right */}
            <SpeechBubble
              label="¡Hola!"
              bubbleClassName="bg-[#E8E8FC]"
              textClassName="text-primary"
              rotate="9deg"
              tailSide="left"
              position={{ top: 28, right: 0 }}
            />

            {/* 你好! — middle right, tilted right */}
            <SpeechBubble
              label="你好!"
              bubbleClassName="bg-[#FBE8E8]"
              textClassName="text-error"
              rotate="7deg"
              tailSide="left"
              position={{ top: 150, right: 8 }}
            />
          </View>
        </View>

        {/* Get Started button */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.back()}
          className="mb-4 h-16 flex-row items-center justify-center rounded-2xl bg-primary"
        >
          <Text className="text-h4 text-background">Get Started</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#ffffff"
            className="absolute right-6"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
