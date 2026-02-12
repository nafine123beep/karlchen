/**
 * ObligationBanner - Proactive rule reminder for Learning Mode
 *
 * Displays a small persistent banner above the player's hand when
 * Farbzwang or Trumpfzwang applies. This complements reactive
 * illegal move popups with a proactive visual reminder.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ObligationBannerProps {
  suit: string; // "Trumpf" | "Herz" | "Pik" | "Karo" | "Kreuz"
  isTrump: boolean;
}

export const ObligationBanner: React.FC<ObligationBannerProps> = ({ suit, isTrump }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{isTrump ? '🏅' : '🎴'}</Text>
      <Text style={styles.text}>
        Du musst {suit} bedienen
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.25)', // Amber
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.5)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  text: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '600',
  },
});
