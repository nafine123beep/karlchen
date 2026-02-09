/**
 * Card Component - SVG-based playing card display
 */

import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Svg, { Rect, Text as SvgText, G, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { Suit, Rank } from '@/types/card.types';

// Card dimensions
const CARD_WIDTH = 70;
const CARD_HEIGHT = 100;
const CARD_RADIUS = 8;

interface CardProps {
  suit: Suit;
  rank: Rank;
  isTrump?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  highlighted?: boolean;
  selected?: boolean;
  size?: 'small' | 'medium' | 'large';
}

// SVG paths for suit symbols
const SUIT_PATHS: Record<Suit, string> = {
  [Suit.HEARTS]: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  [Suit.DIAMONDS]: 'M12 2L2 12l10 10 10-10L12 2z',
  [Suit.SPADES]: 'M12 2C9 7 4 9 4 13c0 2.5 2 4 4 4-.5 1-1.5 2-3 3h14c-1.5-1-2.5-2-3-3 2 0 4-1.5 4-4 0-4-5-6-8-11z',
  [Suit.CLUBS]: 'M12 2c-2.5 0-4.5 2-4.5 4.5 0 1.5.7 2.8 1.8 3.7C7.3 10.8 6 12.7 6 15c0 2.8 2.2 5 5 5h2c2.8 0 5-2.2 5-5 0-2.3-1.3-4.2-3.3-4.8 1.1-.9 1.8-2.2 1.8-3.7C16.5 4 14.5 2 12 2z',
};

// Get colors for suits
const getSuitColor = (suit: Suit): string => {
  return suit === Suit.HEARTS || suit === Suit.DIAMONDS ? '#dc2626' : '#1f2937';
};

// Get rank display (German style for Doppelkopf)
const getRankDisplay = (rank: Rank): string => {
  const displays: Record<Rank, string> = {
    [Rank.NINE]: '9',
    [Rank.JACK]: 'B',
    [Rank.QUEEN]: 'D',
    [Rank.KING]: 'K',
    [Rank.TEN]: '10',
    [Rank.ACE]: 'A',
  };
  return displays[rank];
};

// Size multipliers
const SIZE_MULTIPLIERS = {
  small: 0.7,
  medium: 1,
  large: 1.3,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card: React.FC<CardProps> = ({
  suit,
  rank,
  isTrump = false,
  onPress,
  disabled = false,
  highlighted = false,
  selected = false,
  size = 'medium',
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const sizeMultiplier = SIZE_MULTIPLIERS[size];
  const width = CARD_WIDTH * sizeMultiplier;
  const height = CARD_HEIGHT * sizeMultiplier;
  const color = getSuitColor(suit);
  const rankDisplay = getRankDisplay(rank);

  // Animated styles for interactions
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  // Handle press animations
  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  // Selected card lifts up
  React.useEffect(() => {
    translateY.value = withSpring(selected ? -15 : 0);
  }, [selected]);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || !onPress}
      style={[
        styles.container,
        { width, height },
        animatedStyle,
        disabled && styles.disabled,
      ]}
    >
      <Svg width={width} height={height} viewBox={`0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`}>
        <Defs>
          {/* Card background gradient */}
          <LinearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#ffffff" />
            <Stop offset="100%" stopColor="#f8fafc" />
          </LinearGradient>
          {/* Trump glow gradient */}
          <LinearGradient id="trumpGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#fbbf24" />
            <Stop offset="100%" stopColor="#f59e0b" />
          </LinearGradient>
          {/* Highlighted border gradient */}
          <LinearGradient id="highlightBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#3b82f6" />
            <Stop offset="100%" stopColor="#2563eb" />
          </LinearGradient>
        </Defs>

        {/* Card shadow */}
        <Rect
          x={2}
          y={3}
          width={CARD_WIDTH - 4}
          height={CARD_HEIGHT - 4}
          rx={CARD_RADIUS}
          fill="rgba(0,0,0,0.1)"
        />

        {/* Trump indicator (golden border) */}
        {isTrump && (
          <Rect
            x={1}
            y={1}
            width={CARD_WIDTH - 2}
            height={CARD_HEIGHT - 2}
            rx={CARD_RADIUS}
            fill="none"
            stroke="url(#trumpGlow)"
            strokeWidth={3}
          />
        )}

        {/* Highlighted border (legal move indicator) */}
        {highlighted && !isTrump && (
          <Rect
            x={1}
            y={1}
            width={CARD_WIDTH - 2}
            height={CARD_HEIGHT - 2}
            rx={CARD_RADIUS}
            fill="none"
            stroke="url(#highlightBorder)"
            strokeWidth={3}
          />
        )}

        {/* Card background */}
        <Rect
          x={2}
          y={2}
          width={CARD_WIDTH - 4}
          height={CARD_HEIGHT - 4}
          rx={CARD_RADIUS - 1}
          fill="url(#cardBg)"
          stroke={highlighted ? '#3b82f6' : isTrump ? '#f59e0b' : '#e5e7eb'}
          strokeWidth={1}
        />

        {/* Top-left rank and suit */}
        <G>
          <SvgText
            x={8}
            y={18}
            fontSize={14}
            fontWeight="bold"
            fill={color}
            textAnchor="start"
          >
            {rankDisplay}
          </SvgText>
          <G transform="translate(5, 22) scale(0.4)">
            <Path d={SUIT_PATHS[suit]} fill={color} />
          </G>
        </G>

        {/* Center suit symbol (large) */}
        <G transform="translate(23, 38) scale(1)">
          <Path d={SUIT_PATHS[suit]} fill={color} />
        </G>

        {/* Bottom-right rank and suit (rotated) */}
        <G transform={`rotate(180, ${CARD_WIDTH / 2}, ${CARD_HEIGHT / 2})`}>
          <SvgText
            x={8}
            y={18}
            fontSize={14}
            fontWeight="bold"
            fill={color}
            textAnchor="start"
          >
            {rankDisplay}
          </SvgText>
          <G transform="translate(5, 22) scale(0.4)">
            <Path d={SUIT_PATHS[suit]} fill={color} />
          </G>
        </G>

        {/* Trump indicator icon */}
        {isTrump && (
          <G transform="translate(52, 4) scale(0.6)">
            <Path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              fill="#f59e0b"
            />
          </G>
        )}
      </Svg>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 4,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Card;
