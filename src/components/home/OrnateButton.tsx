/**
 * OrnateButton Component
 * Decorative wooden button with gold ornamental border
 */

import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { WoodTexture } from './textures/WoodTexture';
import { GoldBorder } from './textures/GoldBorder';
import { HOME_THEME, HOME_LAYOUT, HOME_SHADOWS } from '@/theme/homeTheme';

interface OrnateButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'horizontal' | 'featured';
  subtitle?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const OrnateButton: React.FC<OrnateButtonProps> = ({
  title,
  onPress,
  variant = 'horizontal',
  subtitle,
  disabled = false,
  style,
}) => {
  const scale = useSharedValue(1);
  const isFeatured = variant === 'featured';
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setLayout({ width, height });
  };

  // Animated press effect
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 150,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        isFeatured ? styles.featured : styles.horizontal,
        HOME_SHADOWS.button,
        animatedStyle,
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={styles.pressable}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <View style={styles.background} onLayout={handleLayout}>
          {/* Wood texture background */}
          <View style={StyleSheet.absoluteFill}>
            <WoodTexture width="100%" height="100%" />
          </View>

          {/* Semi-transparent overlay for better text readability */}
          <View style={styles.overlay} />

          {/* Gold decorative border */}
          {layout.width > 0 && (
            <GoldBorder
              width={layout.width}
              height={layout.height}
              borderRadius={isFeatured ? HOME_LAYOUT.button.featured.borderRadius : HOME_LAYOUT.button.horizontal.borderRadius}
              showCornerOrnaments={isFeatured}
            />
          )}

          {/* Text content */}
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                isFeatured && styles.featuredTitle,
              ]}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: HOME_LAYOUT.button.horizontal.borderRadius,
    overflow: 'hidden',
  },
  horizontal: {
    height: HOME_LAYOUT.button.horizontal.height,
    flex: 1, // Allows buttons to share space in row
  },
  featured: {
    height: HOME_LAYOUT.button.featured.height,
    borderRadius: HOME_LAYOUT.button.featured.borderRadius,
    marginVertical: HOME_LAYOUT.button.featured.marginVertical,
    width: '90%', // Centered button takes 90% of container width
    alignSelf: 'center',
  },
  pressable: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)', // Slight darkening for text contrast
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: HOME_LAYOUT.padding.button,
    zIndex: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: HOME_THEME.text.primary,
    textAlign: 'center',
    // Text shadow for readability on textured background
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  featuredTitle: {
    fontSize: 26,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: HOME_THEME.text.secondary,
    marginTop: 4,
    textAlign: 'center',
    // Subtitle also needs shadow for readability
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
