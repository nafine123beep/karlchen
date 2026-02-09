/**
 * CardBack Component - Face-down card display for opponents
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Rect, G, Path, Defs, LinearGradient, Stop, Pattern, Circle } from 'react-native-svg';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';

// Card dimensions (match Card.tsx)
const CARD_WIDTH = 70;
const CARD_HEIGHT = 100;
const CARD_RADIUS = 8;

interface CardBackProps {
  size?: 'small' | 'medium' | 'large';
  rotation?: number;
}

// Size multipliers
const SIZE_MULTIPLIERS = {
  small: 0.7,
  medium: 1,
  large: 1.3,
};

export const CardBack: React.FC<CardBackProps> = ({
  size = 'medium',
  rotation = 0,
}) => {
  const sizeMultiplier = SIZE_MULTIPLIERS[size];
  const width = CARD_WIDTH * sizeMultiplier;
  const height = CARD_HEIGHT * sizeMultiplier;

  return (
    <Animated.View
      style={[
        styles.container,
        { width, height, transform: [{ rotate: `${rotation}deg` }] },
      ]}
    >
      <Svg width={width} height={height} viewBox={`0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`}>
        <Defs>
          {/* Card back gradient (deep blue/purple) */}
          <LinearGradient id="cardBackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#1e3a5f" />
            <Stop offset="50%" stopColor="#2d4a6f" />
            <Stop offset="100%" stopColor="#1e3a5f" />
          </LinearGradient>
          {/* Pattern gradient */}
          <LinearGradient id="patternGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#3b5998" />
            <Stop offset="100%" stopColor="#2d4a6f" />
          </LinearGradient>
          {/* Diamond pattern */}
          <Pattern id="diamondPattern" patternUnits="userSpaceOnUse" width="12" height="12">
            <Rect width="12" height="12" fill="url(#cardBackGradient)" />
            <Path
              d="M6 0 L12 6 L6 12 L0 6 Z"
              fill="none"
              stroke="#4a6fa5"
              strokeWidth="0.5"
              opacity="0.5"
            />
          </Pattern>
        </Defs>

        {/* Card shadow */}
        <Rect
          x={2}
          y={3}
          width={CARD_WIDTH - 4}
          height={CARD_HEIGHT - 4}
          rx={CARD_RADIUS}
          fill="rgba(0,0,0,0.15)"
        />

        {/* Card background */}
        <Rect
          x={2}
          y={2}
          width={CARD_WIDTH - 4}
          height={CARD_HEIGHT - 4}
          rx={CARD_RADIUS - 1}
          fill="url(#cardBackGradient)"
          stroke="#1a2d45"
          strokeWidth={1}
        />

        {/* Inner border */}
        <Rect
          x={6}
          y={6}
          width={CARD_WIDTH - 12}
          height={CARD_HEIGHT - 12}
          rx={CARD_RADIUS - 3}
          fill="none"
          stroke="#4a6fa5"
          strokeWidth={1.5}
          opacity={0.6}
        />

        {/* Diamond pattern fill */}
        <Rect
          x={8}
          y={8}
          width={CARD_WIDTH - 16}
          height={CARD_HEIGHT - 16}
          rx={CARD_RADIUS - 4}
          fill="url(#diamondPattern)"
        />

        {/* Center decoration - Karlchen logo placeholder */}
        <G transform={`translate(${CARD_WIDTH / 2}, ${CARD_HEIGHT / 2})`}>
          {/* Outer circle */}
          <Circle
            r={16}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={1.5}
            opacity={0.8}
          />
          {/* Inner circle */}
          <Circle
            r={10}
            fill="#1e3a5f"
            stroke="#f59e0b"
            strokeWidth={1}
            opacity={0.9}
          />
          {/* K letter for Karlchen */}
          <Path
            d="M-4 -6 L-4 6 M-4 0 L4 -6 M-4 0 L4 6"
            fill="none"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 4,
  },
});

export default CardBack;
