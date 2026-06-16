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
// The icon font is drawn in a slightly taller line box than the glyph so its
// descenders (e.g. the chat bubble's tail) aren't clipped by the Text bounds
// on Android. The glyph stays centered, so we treat ICON_BOX as the icon's
// effective height for layout/alignment.
const ICON_BOX = ICON_SIZE + 8;
// Height of the icon row. The circle is centered inside it (and inside each
// tab's icon), so the indicator always lines up with the icons and never
// pokes above the bar.
const ROW_HEIGHT = 76;

/**
 * Vector icons render as Text, and Android clips glyphs to the Text's measured
 * height. Giving the icon a taller `lineHeight` adds room below so tall/round
 * glyphs aren't cut off; it stays visually centered within the box.
 */
const ICON_STYLE = {
  height: ICON_BOX,
  lineHeight: ICON_BOX,
  textAlign: "center",
} as const;

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
      style={ICON_STYLE}
    />
  ),
  learn: (focused, color) => (
    <Ionicons
      name={focused ? "book" : "book-outline"}
      size={ICON_SIZE}
      color={color}
      style={ICON_STYLE}
    />
  ),
  "ai-teacher": (focused, color) => (
    <MaterialCommunityIcons
      name={focused ? "robot-happy" : "robot-happy-outline"}
      size={ICON_SIZE}
      color={color}
      style={ICON_STYLE}
    />
  ),
  chat: (focused, color) => (
    <Ionicons
      name={focused ? "chatbubble" : "chatbubble-outline"}
      size={ICON_SIZE}
      color={color}
      style={ICON_STYLE}
    />
  ),
  profile: (focused, color) => (
    <Ionicons
      name={focused ? "person" : "person-outline"}
      size={ICON_SIZE}
      color={color}
      style={ICON_STYLE}
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

        // Parity with React Navigation's default tab bar: let screens listen
        // for long-press on a tab.
        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            // h-[76px] = ROW_HEIGHT, pt-[22px] = (ROW_HEIGHT - ICON_BOX) / 2,
            // so the icon's center lands on the sliding circle's center.
            className="h-19 flex-1 items-center pt-5.5"
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={label}
          >
            <View className="h-8 items-center justify-center">
              {renderIcon?.(focused, focused ? "#ffffff" : colors.inkMuted)}
            </View>
            {!focused && (
              <Text
                className="mt-1.5 text-[11px] leading-3.5 font-poppins-medium text-ink-muted"
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
