import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/cards/Card';
import { Suit, Rank } from '@/types/card.types';

const POINT_CARDS = [
  { suit: Suit.HEARTS, rank: Rank.ACE, isTrump: false, points: 11 },
  { suit: Suit.SPADES, rank: Rank.TEN, isTrump: false, points: 10 },
  { suit: Suit.CLUBS, rank: Rank.KING, isTrump: false, points: 4 },
  { suit: Suit.DIAMONDS, rank: Rank.QUEEN, isTrump: true, points: 3 },
];

export const PointsVisual: React.FC = () => {
  return (
    <View style={styles.container}>
      {POINT_CARDS.map((card, index) => (
        <View key={index} style={styles.cardColumn}>
          <Card
            suit={card.suit}
            rank={card.rank}
            isTrump={card.isTrump}
            size="small"
          />
          <View style={styles.pointBadge}>
            <Text style={styles.pointValue}>{card.points}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 12,
    alignSelf: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  cardColumn: {
    alignItems: 'center',
  },
  pointBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  pointValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
