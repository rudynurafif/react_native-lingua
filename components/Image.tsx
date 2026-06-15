import { Image as ExpoImage } from "expo-image";
import { styled } from "nativewind";

/**
 * expo-image's `Image` is a third-party component, so NativeWind doesn't
 * map `className` to its `style` prop out of the box. `styled()` registers
 * the interop (default mapping: className -> style) so we can size and
 * style images with Tailwind classes like any core component.
 */
export const Image = styled(ExpoImage);
