import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/cards/Card';
import { Suit, Rank } from '@/types/card.types';

// A mini trick: all Spades (Farbzwang), Ace wins (höchste Karte)
const TRICK_CARDS = [
  { suit: Suit.SPADES, rank: Rank.TEN, label: 'Anna' },
  { suit: Suit.SPADES, rank: Rank.KING, label: 'Ben' },
  { suit: Suit.SPADES, rank: Rank.ACE, label: 'Du', isWinner: true },
  { suit: Suit.SPADES, rank: Rank.NINE, label: 'Clara' },
];

export const RulesVisual: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Top card */}
      <View style={styles.topSlot}>
        <Text style={styles.playerLabel}>{TRICK_CARDS[0].label}</Text>
        <Card suit={TRICK_CARDS[0].suit} rank={TRICK_CARDS[0].rank} size="small" />
      </View>

      {/* Middle row: left + center label + right */}
      <View style={styles.middleRow}>
        <View style={styles.sideSlot}>
          <Text style={styles.playerLabel}>{TRICK_CARDS[1].label}</Text>
          <Card suit={TRICK_CARDS[1].suit} rank={TRICK_CARDS[1].rank} size="small" />
        </View>

        <View style={styles.centerBadge}>
          <Text style={styles.centerText}>Stich</Text>
        </View>

        <View style={styles.sideSlot}>
          <Text style={styles.playerLabel}>{TRICK_CARDS[3].label}</Text>
          <Card suit={TRICK_CARDS[3].suit} rank={TRICK_CARDS[3].rank} size="small" />
        </View>
      </View>

      {/* Bottom card (winner) */}
      <View style={styles.bottomSlot}>
        <View style={styles.winnerHighlight}>
          <Card suit={TRICK_CARDS[2].suit} rank={TRICK_CARDS[2].rank} size="small" />
        </View>
        <Text style={styles.winnerLabel}>{TRICK_CARDS[2].label} gewinnt!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 240,
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  topSlot: {
    alignItems: 'center',
    marginBottom: 6,
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 6,
  },
  sideSlot: {
    alignItems: 'center',
  },
  centerBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    fontWeight: '600',
  },
  bottomSlot: {
    alignItems: 'center',
  },
  winnerHighlight: {
    borderWidth: 2,
    borderColor: '#22c55e',
    borderRadius: 10,
    padding: 2,
  },
  playerLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 3,
  },
  winnerLabel: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
});
