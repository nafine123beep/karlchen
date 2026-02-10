/**
 * OpponentHand Component - Display AI player's face-down cards
 */

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

const isWeb = Platform.OS === 'web';
import { CardBack } from '@/components/cards/CardBack';
import { Card } from '@/components/cards/Card';
import { Card as CardModel } from '@/engine/models/Card';
import { Suit, Rank } from '@/types/card.types';

type Position = 'top' | 'left' | 'right';

interface OpponentHandProps {
  cardCount: number;
  playerName: string;
  position: Position;
  isCurrentTurn?: boolean;
  tricksWon?: number;
  cards?: CardModel[];
  showOpen?: boolean;
}

// Card overlap based on position
const CARD_OVERLAP = {
  top: 20,
  left: 15,
  right: 15,
};

export const OpponentHand: React.FC<OpponentHandProps> = ({
  cardCount,
  playerName,
  position,
  isCurrentTurn = false,
  tricksWon = 0,
  cards,
  showOpen = false,
}) => {
  const isVertical = position === 'left' || position === 'right';
  const overlap = CARD_OVERLAP[position];
  const cardSize = 'small';

  // Generate card positions
  const renderCards = () => {
    const rendered = [];
    for (let i = 0; i < cardCount; i++) {
      const style = isVertical
        ? { top: i * overlap }
        : { left: i * overlap };

      const CardWrapper = isWeb ? View : Animated.View;
      const wrapperProps = isWeb ? {} : {
        entering: FadeIn.delay(i * 30),
        layout: Layout.springify(),
      };

      const rotation = isVertical ? (position === 'left' ? 90 : -90) : 0;
      const cardContent = showOpen && cards && cards[i] ? (
        <View style={rotation !== 0 ? { transform: [{ rotate: `${rotation}deg` }] } : undefined}>
          <Card
            suit={cards[i].suit as Suit}
            rank={cards[i].rank as Rank}
            isTrump={cards[i].isTrump}
            size={cardSize}
          />
        </View>
      ) : (
        <CardBack
          size={cardSize}
          rotation={rotation}
        />
      );

      rendered.push(
        <CardWrapper
          key={showOpen && cards && cards[i] ? cards[i].id : i}
          {...wrapperProps}
          style={[styles.cardWrapper, style, { zIndex: i }]}
        >
          {cardContent}
        </CardWrapper>
      );
    }
    return rendered;
  };

  // Calculate container dimensions
  const cardWidth = 70 * 0.7; // small size multiplier
  const cardHeight = 100 * 0.7;

  const containerWidth = isVertical
    ? cardHeight
    : cardWidth + (cardCount - 1) * overlap;

  const containerHeight = isVertical
    ? cardWidth + (cardCount - 1) * overlap
    : cardHeight;

  return (
    <View style={[styles.container, styles[`container_${position}`]]}>
      {/* Player name and info */}
      <View style={[styles.infoContainer, styles[`info_${position}`]]}>
        <Text
          style={[styles.playerName, isCurrentTurn && styles.currentTurn]}
          numberOfLines={1}
        >
          {playerName}
        </Text>
        <Text style={styles.tricksText}>
          Stiche: {tricksWon}
        </Text>
        {isCurrentTurn && (
          <View style={styles.turnIndicator} />
        )}
      </View>

      {/* Cards */}
      <View
        style={[
          styles.cardsContainer,
          {
            width: containerWidth,
            height: containerHeight,
          },
        ]}
      >
        {renderCards()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  container_top: {
    flexDirection: 'column',
  },
  container_left: {
    flexDirection: 'row',
  },
  container_right: {
    flexDirection: 'row-reverse',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  info_top: {
    marginBottom: 4,
  },
  info_left: {
    marginRight: 8,
    marginBottom: 0,
  },
  info_right: {
    marginLeft: 8,
    marginBottom: 0,
  },
  playerName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 80,
  },
  currentTurn: {
    color: '#fbbf24',
  },
  tricksText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    marginTop: 2,
  },
  turnIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginTop: 4,
  },
  cardsContainer: {
    position: 'relative',
  },
  cardWrapper: {
    position: 'absolute',
  },
});

export default OpponentHand;
