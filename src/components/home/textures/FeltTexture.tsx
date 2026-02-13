/**
 * FeltTexture Component
 * SVG-based felt texture background for game table aesthetic
 */

import React from 'react';
import Svg, { Defs, Rect, LinearGradient, Stop, Pattern, Circle } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';
import { HOME_THEME } from '@/theme/homeTheme';

interface FeltTextureProps {
  width: number | string;
  height: number | string;
}

export const FeltTexture: React.FC<FeltTextureProps> = ({ width, height }) => {
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      <Defs>
        {/* Gradient for depth */}
        <LinearGradient id="feltGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={HOME_THEME.background.feltLight} stopOpacity="1" />
          <Stop offset="50%" stopColor={HOME_THEME.background.felt} stopOpacity="1" />
          <Stop offset="100%" stopColor={HOME_THEME.background.felt} stopOpacity="1" />
        </LinearGradient>

        {/* Noise pattern using dots for fabric texture effect */}
        <Pattern
          id="feltNoise"
          x="0"
          y="0"
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <Circle cx="2" cy="2" r="0.5" fill="#000" opacity="0.1" />
        </Pattern>
      </Defs>

      {/* Base felt color with gradient */}
      <Rect width="100%" height="100%" fill="url(#feltGradient)" />

      {/* Noise overlay for texture */}
      <Rect
        width="100%"
        height="100%"
        fill="url(#feltNoise)"
      />
    </Svg>
  );
};

/**
 * FeltBackground Component
 * Convenience wrapper for felt texture with overlay
 */
export const FeltBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View style={styles.container}>
      <FeltTexture width="100%" height="100%" />
      <View style={styles.vignette} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HOME_THEME.background.felt,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: HOME_THEME.background.feltOverlay,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
  },
});
