/**
 * TrickWinAnimation Component - Animates cards toward trick winner
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withDelay,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Card } from '@/components/cards/Card';
import { Card as CardModel } from '@/engine/models/Card';
import { Suit, Rank } from '@/types/card.types';

interface TrickCard {
  card: CardModel;
  playerId: string;
}

interface TrickWinAnimationProps {
  cards: TrickCard[];
  winnerPlayerId: string;
  winnerName: string;
  playerPositions: Record<string, 'bottom' | 'top' | 'left' | 'right'>;
  onAnimationComplete: () => void;
}

// Target positions for winner (where cards animate to)
const WINNER_TARGETS: Record<string, { x: number; y: number }> = {
  bottom: { x: 0, y: 80 },
  top: { x: 0, y: -80 },
  left: { x: -100, y: 0 },
  right: { x: 100, y: 0 },
};

// Starting offsets for each position
const POSITION_OFFSETS: Record<string, { x: number; y: number }> = {
  bottom: { x: 0, y: 50 },
  top: { x: 0, y: -50 },
  left: { x: -50, y: 0 },
  right: { x: 50, y: 0 },
};

const ANIMATION_DURATION = 600; // ms
const HIGHLIGHT_DELAY = 400; // ms to show winner before animation

interface AnimatedCardProps {
  trickCard: TrickCard;
  index: number;
  startOffset: { x: number; y: number };
  targetOffset: { x: number; y: number };
  isWinningCard: boolean;
  onComplete?: () => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  trickCard,
  index,
  startOffset,
  targetOffset,
  isWinningCard,
  onComplete,
}) => {
  const translateX = useSharedValue(startOffset.x);
  const translateY = useSharedValue(startOffset.y);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Highlight winning card first
    if (isWinningCard) {
      scale.value = withSequence(
        withTiming(1.15, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    }

    // After highlight delay, animate to winner
    translateX.value = withDelay(
      HIGHLIGHT_DELAY,
      withTiming(targetOffset.x, {
        duration: ANIMATION_DURATION,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    translateY.value = withDelay(
      HIGHLIGHT_DELAY,
      withTiming(targetOffset.y, {
        duration: ANIMATION_DURATION,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    // Fade out at the end
    opacity.value = withDelay(
      HIGHLIGHT_DELAY + ANIMATION_DURATION - 200,
      withTiming(0, { duration: 200 }, (finished) => {
        if (finished && onComplete) {
          runOnJS(onComplete)();
        }
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.cardPosition,
        { zIndex: isWinningCard ? 10 : index },
        animatedStyle,
      ]}
    >
      <View style={isWinningCard && styles.winningCard}>
        <Card
          suit={trickCard.card.suit as Suit}
          rank={trickCard.card.rank as Rank}
          isTrump={trickCard.card.isTrump}
          highlighted={isWinningCard}
        />
      </View>
    </Animated.View>
  );
};

export const TrickWinAnimation: React.FC<TrickWinAnimationProps> = ({
  cards,
  winnerPlayerId,
  winnerName,
  playerPositions,
  onAnimationComplete,
}) => {
  const winnerPosition = playerPositions[winnerPlayerId] || 'bottom';
  const targetOffset = WINNER_TARGETS[winnerPosition];

  // Find winning card (first card from winner, or just use winner's card)
  const winningCard = cards.find(tc => tc.playerId === winnerPlayerId);
  const winningCardId = winningCard?.card.id;

  // Track animation completion
  const completedRef = React.useRef(false);

  const handleCardAnimationComplete = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      // Small delay after fade to let UI settle
      setTimeout(onAnimationComplete, 100);
    }
  };

  return (
    <View style={styles.container}>
      {/* Winner indicator banner */}
      <Animated.View style={styles.winnerBanner}>
        <Text style={styles.winnerText}>{winnerName} gewinnt!</Text>
      </Animated.View>

      {/* Animated cards */}
      {cards.map((trickCard, index) => {
        const position = playerPositions[trickCard.playerId] || 'bottom';
        const startOffset = POSITION_OFFSETS[position];
        const isWinningCard = trickCard.card.id === winningCardId;

        return (
          <AnimatedCard
            key={trickCard.card.id}
            trickCard={trickCard}
            index={index}
            startOffset={startOffset}
            targetOffset={targetOffset}
            isWinningCard={isWinningCard}
            onComplete={index === cards.length - 1 ? handleCardAnimationComplete : undefined}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerBanner: {
    position: 'absolute',
    top: -40,
    backgroundColor: 'rgba(34, 197, 94, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    zIndex: 100,
  },
  winnerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardPosition: {
    position: 'absolute',
  },
  winningCard: {
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 10,
  },
});

export default TrickWinAnimation;
