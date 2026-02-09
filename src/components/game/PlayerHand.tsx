/**
 * PlayerHand Component - Display human player's cards
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  FadeIn,
  Layout,
} from 'react-native-reanimated';
import { Card } from '@/components/cards/Card';
import { Card as CardModel } from '@/engine/models/Card';
import { Suit, Rank } from '@/types/card.types';

interface PlayerHandProps {
  cards: CardModel[];
  legalMoves: CardModel[];
  onCardPress: (cardId: string) => void;
  selectedCardId?: string | null;
  disabled?: boolean;
}

// Card overlap for fitting 12 cards
const CARD_OVERLAP = 45;
const CARD_WIDTH = 70;

export const PlayerHand: React.FC<PlayerHandProps> = ({
  cards,
  legalMoves,
  onCardPress,
  selectedCardId = null,
  disabled = false,
}) => {
  // Create a set of legal move IDs for quick lookup
  const legalMoveIds = useMemo(() => {
    return new Set(legalMoves.map(card => card.id));
  }, [legalMoves]);

  // Calculate total width needed for cards
  const totalWidth = cards.length > 0
    ? CARD_WIDTH + (cards.length - 1) * CARD_OVERLAP
    : 0;

  // Sort cards: trumps first, then by suit
  const sortedCards = useMemo(() => {
    return [...cards].sort((a, b) => {
      // Trump cards first
      if (a.isTrump && !b.isTrump) return -1;
      if (!a.isTrump && b.isTrump) return 1;

      // Within trumps, sort by trump order
      if (a.isTrump && b.isTrump) {
        return (a.trumpOrder ?? 0) - (b.trumpOrder ?? 0);
      }

      // Non-trumps: sort by suit then rank
      const suitOrder = { clubs: 0, spades: 1, hearts: 2, diamonds: 3 };
      const rankOrder = { 'J': 0, 'Q': 1, 'K': 2, '10': 3, 'A': 4 };

      const suitDiff = suitOrder[a.suit as keyof typeof suitOrder] - suitOrder[b.suit as keyof typeof suitOrder];
      if (suitDiff !== 0) return suitDiff;

      return rankOrder[a.rank as keyof typeof rankOrder] - rankOrder[b.rank as keyof typeof rankOrder];
    });
  }, [cards]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { minWidth: totalWidth + 32 },
        ]}
      >
        <View style={[styles.cardsContainer, { width: totalWidth }]}>
          {sortedCards.map((card, index) => {
            const isLegalMove = legalMoveIds.has(card.id);
            const isSelected = selectedCardId === card.id;
            // Only disable when entire hand is disabled (not player's turn)
            // Allow clicking any card - GameScreen will handle illegal moves
            const isDisabled = disabled;

            return (
              <Animated.View
                key={card.id}
                entering={FadeIn.delay(index * 50)}
                layout={Layout.springify()}
                style={[
                  styles.cardWrapper,
                  { left: index * CARD_OVERLAP, zIndex: isSelected ? 100 : index },
                ]}
              >
                <Card
                  suit={card.suit as Suit}
                  rank={card.rank as Rank}
                  isTrump={card.isTrump}
                  highlighted={isLegalMove}
                  selected={isSelected}
                  disabled={isDisabled}
                  onPress={() => onCardPress(card.id)}
                />
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 130,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 8,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  cardsContainer: {
    height: 115,
    position: 'relative',
  },
  cardWrapper: {
    position: 'absolute',
    top: 0,
  },
});

export default PlayerHand;
