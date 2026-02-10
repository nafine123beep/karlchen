/**
 * TrickArea Component - Display current trick (4 cards in center)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  ZoomOut,
} from 'react-native-reanimated';

const isWeb = Platform.OS === 'web';
import { Card } from '@/components/cards/Card';
import { Card as CardModel } from '@/engine/models/Card';
import { Suit, Rank } from '@/types/card.types';
import { TrickWinAnimation } from './TrickWinAnimation';

interface TrickCard {
  card: CardModel;
  playerId: string;
}

interface TrickAreaProps {
  cards: TrickCard[];
  winningCardId?: string | null;
  winnerPlayerId?: string | null;
  winnerName?: string;
  playerPositions: Record<string, 'bottom' | 'top' | 'left' | 'right'>;
  onTrickAnimationComplete?: () => void;
  isAnimating?: boolean;
}

// Animation entries based on player position
const POSITION_ANIMATIONS = {
  bottom: SlideInDown,
  top: SlideInUp,
  left: SlideInLeft,
  right: SlideInRight,
};

// Card position offsets from center
const POSITION_OFFSETS = {
  bottom: { top: 50, left: 0 },
  top: { top: -50, left: 0 },
  left: { top: 0, left: -50 },
  right: { top: 0, left: 50 },
};

export const TrickArea: React.FC<TrickAreaProps> = ({
  cards,
  winningCardId = null,
  winnerPlayerId = null,
  winnerName = '',
  playerPositions,
  onTrickAnimationComplete,
  isAnimating = false,
}) => {
  // Show win animation when trick is complete and we have winner info
  const showWinAnimation = isAnimating && cards.length === 4 && winnerPlayerId;

  if (showWinAnimation) {
    return (
      <View style={styles.container}>
        <View style={styles.trickBackground} />
        <TrickWinAnimation
          cards={cards}
          winnerPlayerId={winnerPlayerId}
          winnerName={winnerName}
          playerPositions={playerPositions}
          onAnimationComplete={onTrickAnimationComplete || (() => {})}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Trick area background */}
      <View style={styles.trickBackground}>
        {cards.length === 0 && (
          <Text style={styles.emptyText}>Stich</Text>
        )}
      </View>

      {/* Played cards */}
      {cards.map((trickCard, index) => {
        const position = playerPositions[trickCard.playerId] || 'bottom';
        const offset = POSITION_OFFSETS[position];
        const EnterAnimation = POSITION_ANIMATIONS[position];
        const isWinning = trickCard.card.id === winningCardId;

        const CardWrapper = isWeb ? View : Animated.View;
        const wrapperProps = isWeb ? {} : {
          entering: EnterAnimation.duration(300),
          exiting: ZoomOut.duration(200),
        };

        return (
          <CardWrapper
            key={trickCard.card.id}
            {...wrapperProps}
            style={[
              styles.cardPosition,
              {
                transform: [
                  { translateX: offset.left },
                  { translateY: offset.top },
                ],
                zIndex: index,
              },
            ]}
          >
            <View style={isWinning && styles.winningCard}>
              <Card
                suit={trickCard.card.suit as Suit}
                rank={trickCard.card.rank as Rank}
                isTrump={trickCard.card.isTrump}
                highlighted={isWinning}
              />
            </View>
          </CardWrapper>
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
  trickBackground: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
  },
  cardPosition: {
    position: 'absolute',
  },
  winningCard: {
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  completeIndicator: {
    position: 'absolute',
    bottom: -30,
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TrickArea;
