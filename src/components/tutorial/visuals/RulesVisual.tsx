import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/cards/Card';
import { Suit, Rank } from '@/types/card.types';

// A mini trick: Anna leads Spades, everyone must follow (Farbzwang), Ace wins
const TRICK_CARDS = [
  { suit: Suit.SPADES, rank: Rank.TEN, name: 'Anna', tag: 'spielt ♠ aus', tagType: 'lead' as const },
  { suit: Suit.SPADES, rank: Rank.KING, name: 'Ben', tag: 'Farbzwang!', tagType: 'follow' as const },
  { suit: Suit.SPADES, rank: Rank.NINE, name: 'Clara', tag: 'Farbzwang!', tagType: 'follow' as const },
  { suit: Suit.SPADES, rank: Rank.ACE, name: 'Du', tag: 'höchste → Stich!', tagType: 'winner' as const },
];

const TAG_COLORS = {
  lead: '#f59e0b',
  follow: '#0891b2',
  winner: '#22c55e',
};

export const RulesVisual: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Top card — Anna leads */}
      <CardSlot card={TRICK_CARDS[0]} />

      {/* Middle row: Ben + Stich label + Clara */}
      <View style={styles.middleRow}>
        <CardSlot card={TRICK_CARDS[1]} />

        <View style={styles.centerBadge}>
          <Text style={styles.centerText}>Stich</Text>
        </View>

        <CardSlot card={TRICK_CARDS[2]} />
      </View>

      {/* Bottom card — Du wins */}
      <CardSlot card={TRICK_CARDS[3]} isWinner />
    </View>
  );
};

const CardSlot: React.FC<{
  card: (typeof TRICK_CARDS)[number];
  isWinner?: boolean;
}> = ({ card, isWinner }) => {
  const tagColor = TAG_COLORS[card.tagType];

  return (
    <View style={styles.slot}>
      <Text style={styles.playerName}>{card.name}</Text>
      <View style={isWinner ? styles.winnerBorder : undefined}>
        <Card suit={card.suit} rank={card.rank} size="small" />
      </View>
      <View style={[styles.tag, { backgroundColor: tagColor }]}>
        <Text style={styles.tagText}>{card.tag}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 260,
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 4,
  },
  centerBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    fontWeight: '600',
  },
  slot: {
    alignItems: 'center',
  },
  playerName: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  tag: {
    marginTop: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  winnerBorder: {
    borderWidth: 2,
    borderColor: '#22c55e',
    borderRadius: 10,
    padding: 2,
  },
});
