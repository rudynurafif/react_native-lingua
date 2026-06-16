import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { Image } from "@/components/Image";
import { colors } from "@/theme";

type LoadingImageProps = {
  /** Remote image URL. */
  uri: string;
  /** Tailwind classes for the wrapper — set the size and corner radius here. */
  className?: string;
  /** How the image fills its box. */
  contentFit?: "cover" | "contain";
};

/**
 * Remote image with a graceful loading state.
 *
 * While the picture downloads, a soft pulsing skeleton fills the box; once it's
 * ready the image fades in. Size and rounding come from `className` on the
 * wrapper (e.g. "h-12 w-12 rounded-xl"), so this works for both small
 * thumbnails and large hero images.
 */
export function LoadingImage({
  uri,
  className,
  contentFit = "cover",
}: LoadingImageProps) {
  const [loaded, setLoaded] = useState(false);

  // Gentle breathing opacity for the skeleton while loading.
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(0.4, { duration: 800 }), -1, true);
  }, [pulse]);

  const skeletonStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <View className={`overflow-hidden bg-surface ${className ?? ""}`}>
      <Image
        source={{ uri }}
        className="h-full w-full"
        contentFit={contentFit}
        transition={300}
        onLoadEnd={() => setLoaded(true)}
      />

      {!loaded && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.border },
            skeletonStyle,
          ]}
        />
      )}
    </View>
  );
}
