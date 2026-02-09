import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '@/components/cards/Card';
import { Suit, Rank } from '@/types/card.types';

interface CardsVisualProps {
  data?: { showFullDeck?: boolean; showTopTrumps?: boolean };
}

const FULL_DECK_CARDS = [
  { suit: Suit.CLUBS, rank: Rank.QUEEN, isTrump: true },
  { suit: Suit.HEARTS, rank: Rank.ACE, isTrump: false },
  { suit: Suit.DIAMONDS, rank: Rank.TEN, isTrump: true },
  { suit: Suit.SPADES, rank: Rank.KING, isTrump: false },
  { suit: Suit.CLUBS, rank: Rank.NINE, isTrump: false },
];

const TOP_TRUMPS_CARDS = [
  { suit: Suit.HEARTS, rank: Rank.TEN, isTrump: true },
  { suit: Suit.CLUBS, rank: Rank.QUEEN, isTrump: true },
  { suit: Suit.SPADES, rank: Rank.QUEEN, isTrump: true },
  { suit: Suit.HEARTS, rank: Rank.QUEEN, isTrump: true },
  { suit: Suit.DIAMONDS, rank: Rank.QUEEN, isTrump: true },
];

const CARD_SPACING = 40;
const ROTATION_STEP = 6;
const SMALL_CARD_WIDTH = 49;
const SMALL_CARD_HEIGHT = 70;

export const CardsVisual: React.FC<CardsVisualProps> = ({ data }) => {
  const cards = data?.showTopTrumps ? TOP_TRUMPS_CARDS : FULL_DECK_CARDS;
  const center = Math.floor(cards.length / 2);
  const containerWidth = (cards.length - 1) * CARD_SPACING + SMALL_CARD_WIDTH;

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      {cards.map((card, index) => {
        const rotation = (index - center) * ROTATION_STEP;
        const arcOffset = Math.abs(index - center) * 8;
        return (
          <View
            key={`${card.suit}-${card.rank}-${index}`}
            style={{
              position: 'absolute',
              left: index * CARD_SPACING,
              top: arcOffset,
              zIndex: index,
              transform: [{ rotate: `${rotation}deg` }],
            }}
          >
            <Card
              suit={card.suit}
              rank={card.rank}
              isTrump={card.isTrump}
              size="small"
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SMALL_CARD_HEIGHT + 20,
    alignSelf: 'center',
    marginBottom: 24,
  },
});
