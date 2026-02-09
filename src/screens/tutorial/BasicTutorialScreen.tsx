/**
 * BasicTutorialScreen - 5-slide introduction to Doppelkopf basics
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { TutorialSlide } from '@/components/tutorial/TutorialSlide';
import { TutorialProgress } from '@/components/tutorial/TutorialProgress';
import { TUTORIAL_SLIDES } from '@/data/tutorial/tutorialSlides';
import { useLearningStore } from '@/store/learningStore';
import { TutorialStep } from '@/types/learning.types';

type Props = NativeStackScreenProps<RootStackParamList, 'BasicTutorial'>;

const BasicTutorialScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const completeTutorialStep = useLearningStore(state => state.completeTutorialStep);

  const slide = TUTORIAL_SLIDES[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === TUTORIAL_SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      completeTutorialStep(TutorialStep.INTRODUCTION);
      navigation.replace('Tutorial');
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    completeTutorialStep(TutorialStep.INTRODUCTION);
    navigation.replace('Tutorial');
  };

  return (
    <View style={[styles.container, { backgroundColor: slide.backgroundColor }]}>
      {/* Skip button */}
      <View style={styles.header}>
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Überspringen</Text>
        </Pressable>
      </View>

      {/* Slide content */}
      <View style={styles.slideArea}>
        <TutorialSlide slide={slide} isActive={true} />
      </View>

      {/* Progress dots */}
      <TutorialProgress
        totalSteps={TUTORIAL_SLIDES.length}
        currentStep={currentIndex}
      />

      {/* Navigation buttons */}
      <View style={styles.buttonRow}>
        {!isFirst ? (
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Zurück</Text>
          </Pressable>
        ) : (
          <View style={styles.buttonSpacer} />
        )}

        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {isLast ? 'Tutorial starten' : 'Weiter'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
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
});

export default BasicTutorialScreen;
