/**
 * Card Component - SVG-based playing card display
 */

import React from 'react';
import { StyleSheet, Pressable, Platform } from 'react-native';
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

// Traditional French-style suit symbol paths (Französisches Blatt)
// All paths are designed for a 24x24 viewBox, centered at (12,12)
const SUIT_PATHS: Record<Suit, string> = {
  // Bold heart shape — two rounded lobes meeting at a point
  [Suit.HEARTS]:
    'M12 21 C12 21 3 14 3 8.5 C3 5.4 5.4 3 8.5 3 C10.1 3 11.4 3.8 12 5 C12.6 3.8 13.9 3 15.5 3 C18.6 3 21 5.4 21 8.5 C21 14 12 21 12 21Z',
  // Classic diamond — tall, narrow rhombus with slightly curved edges
  [Suit.DIAMONDS]:
    'M12 2 C12 2 6 9.5 4 12 C6 14.5 12 22 12 22 C12 22 18 14.5 20 12 C18 9.5 12 2 12 2Z',
  // Traditional spade — inverted heart body with a stem
  [Suit.SPADES]:
    'M12 2 C12 2 3 9 3 14 C3 17 5.5 18.5 8 17.5 C7 19 6 20.5 5 21 L19 21 C18 20.5 17 19 16 17.5 C18.5 18.5 21 17 21 14 C21 9 12 2 12 2Z',
  // Traditional club — three circular lobes with a stem
  [Suit.CLUBS]:
    'M12 3 C9.5 3 7.5 5 7.5 7 C7.5 8.5 8.5 9.8 10 10.2 C7.5 10.5 5.5 12.5 5.5 15 C5.5 17 7 18.5 9 18.5 C10 18.5 11 18 11.5 17.2 C11 18.5 10 19.5 8 21 L16 21 C14 19.5 13 18.5 12.5 17.2 C13 18 14 18.5 15 18.5 C17 18.5 18.5 17 18.5 15 C18.5 12.5 16.5 10.5 14 10.2 C15.5 9.8 16.5 8.5 16.5 7 C16.5 5 14.5 3 12 3Z',
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

const isWeb = Platform.OS === 'web';
const AnimatedPressable = isWeb ? Pressable : Animated.createAnimatedComponent(Pressable);

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

  // Animated styles for interactions (native only)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  // Handle press animations
  const handlePressIn = () => {
    if (!isWeb) scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    if (!isWeb) scale.value = withSpring(1);
  };

  // Selected card lifts up
  React.useEffect(() => {
    if (!isWeb) translateY.value = withSpring(selected ? -15 : 0);
  }, [selected]);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || !onPress}
      pointerEvents={disabled ? 'none' : 'auto'}
      style={[
        styles.container,
        { width, height },
        isWeb ? (disabled ? styles.disabledWeb : undefined) : animatedStyle,
        !isWeb && disabled && styles.disabled,
        isWeb && selected && { transform: [{ translateY: -15 }] },
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
          <G transform="translate(2, 20) scale(0.5)">
            <Path d={SUIT_PATHS[suit]} fill={color} />
          </G>
        </G>

        {/* Center suit symbol (large, bold — Französisches Blatt style) */}
        <G transform="translate(14, 29) scale(1.75)">
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
          <G transform="translate(2, 20) scale(0.5)">
            <Path d={SUIT_PATHS[suit]} fill={color} />
          </G>
        </G>

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
  disabledWeb: {
    opacity: 0.5,
    filter: 'grayscale(80%)',
  } as any,
});

export default Card;
