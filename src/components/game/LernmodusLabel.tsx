/**
 * LernmodusLabel - Banner showing "Offene Karten – Lernmodus"
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const LernmodusLabel: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📖</Text>
      <Text style={styles.text}>Offene Karten – Lernmodus</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(8, 145, 178, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(8, 145, 178, 0.5)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 8,
  },
  icon: {
    fontSize: 16,
  },
  text: {
    color: '#67e8f9',
    fontSize: 13,
    fontWeight: '600',
  },
});
