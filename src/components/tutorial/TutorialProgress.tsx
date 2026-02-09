/**
 * TutorialProgress Component - Dot-based progress indicator
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
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
});
