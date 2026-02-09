/**
 * BasicTutorialScreen - 5-slide introduction to Doppelkopf basics
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { TutorialSlide } from '@/components/tutorial/TutorialSlide';
import { TutorialProgress } from '@/components/tutorial/TutorialProgress';
import { basicTutorialSlides } from '@/data/tutorial/tutorialSlides';
import { useLearningStore } from '@/store/learningStore';
import { TutorialStep } from '@/types/learning.types';

type Props = NativeStackScreenProps<RootStackParamList, 'BasicTutorial'>;

const BasicTutorialScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const completeTutorialStep = useLearningStore(state => state.completeTutorialStep);

  const slide = basicTutorialSlides[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === basicTutorialSlides.length - 1;

  const handleNext = () => {
    if (isLast) {
      completeTutorialStep(TutorialStep.INTRODUCTION);
      navigation.replace('Home');
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Step badge */}
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>
          {currentIndex + 1} / {basicTutorialSlides.length}
        </Text>
      </View>

      {/* Slide content */}
      <View style={styles.slideArea}>
        <TutorialSlide key={slide.id} slide={slide} isActive={true} />
      </View>

      {/* Progress dots + label */}
      <TutorialProgress
        totalSteps={basicTutorialSlides.length}
        currentStep={currentIndex}
      />

      {/* Navigation buttons */}
      <View style={styles.buttonRow}>
        {!isFirst ? (
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>Zurück</Text>
          </Pressable>
        ) : (
          <View style={styles.buttonSpacer} />
        )}

        <Pressable
          style={({ pressed }) => [styles.nextButton, pressed && styles.buttonPressed]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {isLast ? 'Tutorial abschließen' : 'Weiter'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  stepBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  stepBadgeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '600',
  },
  slideArea: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  buttonSpacer: {
    flex: 1,
  },
  backButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.85,
  },
});

export default BasicTutorialScreen;
