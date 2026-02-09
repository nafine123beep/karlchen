/**
 * TutorialProgress Component - Dot-based progress indicator with step label
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TutorialProgressProps {
  totalSteps: number;
  currentStep: number;
}

export const TutorialProgress: React.FC<TutorialProgressProps> = ({
  totalSteps,
  currentStep,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.dotsRow}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentStep ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
      <Text style={styles.label}>
        Schritt {currentStep + 1} von {totalSteps}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    borderRadius: 50,
  },
  dotActive: {
    width: 12,
    height: 12,
    backgroundColor: '#ffffff',
  },
  dotInactive: {
    width: 8,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
  },
});
