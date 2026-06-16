import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme";

const CIRCLE_SIZE = 52;
const ICON_SIZE = 24;
// Height of the icon row. The circle is centered inside it (and inside each
// tab's icon), so the indicator always lines up with the icons and never
// pokes above the bar.
const ROW_HEIGHT = 66;

/**
 * Per-route icon. Active tabs use the filled glyph (white, inside the circle);
 * inactive tabs use the outline glyph in the muted ink color.
 */
const TAB_ICONS: Record<
  string,
  (focused: boolean, color: string) => React.ReactNode
> = {
  home: (focused, color) => (
    <Ionicons
      name={focused ? "home" : "home-outline"}
      size={ICON_SIZE}
      color={color}
    />
  ),
  learn: (focused, color) => (
    <Ionicons
      name={focused ? "book" : "book-outline"}
      size={ICON_SIZE}
      color={color}
    />
  ),
  "ai-teacher": (focused, color) => (
    <MaterialCommunityIcons
      name={focused ? "robot-happy" : "robot-happy-outline"}
      size={ICON_SIZE}
      color={color}
    />
  ),
  chat: (focused, color) => (
    <Ionicons
      name={focused ? "chatbubble" : "chatbubble-outline"}
      size={ICON_SIZE}
      color={color}
    />
  ),
  profile: (focused, color) => (
    <Ionicons
      name={focused ? "person" : "person-outline"}
      size={ICON_SIZE}
      color={color}
    />
  ),
};

/**
 * Custom bottom tab bar.
 *
 * A colored circle marks the active tab and slides smoothly between tabs as
 * the selection changes. The active tab shows only its icon (inside the
 * circle); inactive tabs show their icon + label.
 */
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Total bar width, measured once on layout, used to place the circle.
  const [barWidth, setBarWidth] = useState(0);
  const translateX = useSharedValue(0);
  // Skip the slide-in animation the very first time we position the circle.
  const positioned = useRef(false);

  const onLayout = (e: LayoutChangeEvent) => {
    setBarWidth(e.nativeEvent.layout.width);
  };

  // Move the circle to the active tab whenever the selection (or width) changes.
  useEffect(() => {
    if (barWidth === 0) return;

    const tabWidth = barWidth / state.routes.length;
    const target = state.index * tabWidth + (tabWidth - CIRCLE_SIZE) / 2;

    if (positioned.current) {
      translateX.value = withSpring(target, {
        damping: 18,
        stiffness: 180,
        mass: 0.6,
      });
    } else {
      translateX.value = target;
      positioned.current = true;
    }
  }, [state.index, barWidth, state.routes.length, translateX]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      onLayout={onLayout}
      className="flex-row border-t border-border bg-background"
      // Shadow (platform-specific) + dynamic safe-area padding stay inline.
      style={[styles.shadow, { paddingBottom: insets.bottom || 12 }]}
    >
      {/* The sliding active indicator, drawn behind the icons. */}
      <Animated.View
        pointerEvents="none"
        style={[styles.circle, circleStyle]}
      />

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const focused = state.index === index;
        const renderIcon = TAB_ICONS[route.name];

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            // h-[66px] = ROW_HEIGHT, pt-[21px] = (ROW_HEIGHT - ICON_SIZE) / 2,
            // so the icon's center lands on the sliding circle's center.
            className="h-16.5 flex-1 items-center pt-5.25"
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={label}
          >
            <View className="h-6 items-center justify-center">
              {renderIcon?.(focused, focused ? "#ffffff" : colors.inkMuted)}
            </View>
            {!focused && (
              <Text
                className="mt-1 text-[11px] leading-3.5 font-poppins-medium text-ink-muted"
                numberOfLines={1}
              >
                {label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Platform-specific shadow — has no NativeWind equivalent.
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -2 },
      },
      android: { elevation: 12 },
    }),
  },
  // Animated.View styles stay in StyleSheet (paired with the animated transform).
  // Centered inside the icon row so it lines up exactly with the active icon.
  circle: {
    position: "absolute",
    top: (ROW_HEIGHT - CIRCLE_SIZE) / 2,
    left: 0,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: colors.primary,
  },
});
