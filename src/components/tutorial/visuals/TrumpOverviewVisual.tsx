import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/cards/Card';
import { Suit, Rank } from '@/types/card.types';

const TOP_TRUMPS = [
  { suit: Suit.HEARTS, rank: Rank.TEN },
  { suit: Suit.CLUBS, rank: Rank.QUEEN },
  { suit: Suit.SPADES, rank: Rank.QUEEN },
  { suit: Suit.HEARTS, rank: Rank.QUEEN },
  { suit: Suit.DIAMONDS, rank: Rank.QUEEN },
];

const REMAINING_TRUMPS = [
  { suit: Suit.CLUBS, rank: Rank.JACK },
  { suit: Suit.SPADES, rank: Rank.JACK },
  { suit: Suit.HEARTS, rank: Rank.JACK },
  { suit: Suit.DIAMONDS, rank: Rank.JACK },
  { suit: Suit.DIAMONDS, rank: Rank.ACE },
  { suit: Suit.DIAMONDS, rank: Rank.TEN },
  { suit: Suit.DIAMONDS, rank: Rank.KING },
  { suit: Suit.DIAMONDS, rank: Rank.NINE },
];

const FAN_SPACING = 40;
const FAN_ROTATION = 6;
const SMALL_W = 49;
const SMALL_H = 70;

export const TrumpOverviewVisual: React.FC = () => {
  const fanWidth = (TOP_TRUMPS.length - 1) * FAN_SPACING + SMALL_W;
  const fanCenter = Math.floor(TOP_TRUMPS.length / 2);

  return (
    <View style={styles.container}>
      {/* Tier 1: Top 5 in fan */}
      <View style={[styles.fanContainer, { width: fanWidth }]}>
        {TOP_TRUMPS.map((card, index) => {
          const rotation = (index - fanCenter) * FAN_ROTATION;
          const arcOffset = Math.abs(index - fanCenter) * 8;
          return (
            <View
              key={`top-${card.suit}-${card.rank}`}
              style={{
                position: 'absolute',
                left: index * FAN_SPACING,
                top: arcOffset,
                zIndex: index,
                transform: [{ rotate: `${rotation}deg` }],
              }}
            >
              <Card suit={card.suit} rank={card.rank} isTrump size="small" />
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>Weitere Trümpfe</Text>

      {/* Tier 2: Remaining 8 in compact row */}
      <View style={styles.bottomRow}>
        {REMAINING_TRUMPS.map((card, index) => (
          <Card
            key={`rest-${card.suit}-${card.rank}`}
            suit={card.suit}
            rank={card.rank}
            isTrump
            size="tiny"
          />
        ))}
      </View>

      <Text style={styles.footnote}>Jede Karte existiert 2× = 26 Trumpf</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  fanContainer: {
    height: SMALL_H + 20,
    alignSelf: 'center',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  footnote: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    marginTop: 8,
  },
});
