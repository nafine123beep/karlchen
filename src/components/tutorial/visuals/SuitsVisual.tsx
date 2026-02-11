import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SUITS = [
  { symbol: '\u2663', name: 'Kreuz', isRed: false, isTrump: false },
  { symbol: '\u2660', name: 'Pik', isRed: false, isTrump: false },
  { symbol: '\u2665', name: 'Herz', isRed: true, isTrump: false },
  { symbol: '\u2666', name: 'Karo', isRed: true, isTrump: true },
];

export const SuitsVisual: React.FC = () => {
  return (
    <View style={styles.container}>
      {SUITS.map((suit) => (
        <View key={suit.name} style={styles.suitCard}>
          <Text style={[styles.suitSymbol, { color: suit.isRed ? '#dc2626' : '#1f2937' }]}>
            {suit.symbol}
          </Text>
          <Text style={styles.suitName}>{suit.name}</Text>
          <View style={[styles.badge, suit.isTrump ? styles.trumpBadge : styles.fehlBadge]}>
            <Text style={styles.badgeText}>
              {suit.isTrump ? 'Trumpf' : 'Fehlfarbe'}
            </Text>
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
    gap: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  suitCard: {
    width: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  suitSymbol: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  suitName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  trumpBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.25)',
  },
  fehlBadge: {
    backgroundColor: 'rgba(8, 145, 178, 0.25)',
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#ffffff',
  },
});
