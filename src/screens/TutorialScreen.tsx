/**
 * Tutorial Screen - Interactive learning steps
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { useLearningStore } from '@/store/learningStore';
import { TUTORIAL_LESSONS } from '@/data/tutorialLessons';

type Props = NativeStackScreenProps<RootStackParamList, 'Tutorial'>;

const TutorialScreen: React.FC<Props> = ({ navigation }) => {
  const currentStep = useLearningStore(state => state.tutorialProgress.currentStep);
  const completeTutorialStep = useLearningStore(state => state.completeTutorialStep);

  // TODO: Get current lesson
  const currentLesson = TUTORIAL_LESSONS.find(lesson => lesson.step === currentStep);

  if (!currentLesson) {
    return (
      <View style={styles.container}>
        <Text>Tutorial not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{currentLesson.title}</Text>
        <Text style={styles.description}>{currentLesson.description}</Text>

        {/* TODO: Implement tutorial steps display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lernziele:</Text>
          {currentLesson.objectives.map((objective, index) => (
            <Text key={index} style={styles.listItem}>
              • {objective}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Anleitung:</Text>
          {currentLesson.instructions.map((instruction, index) => (
            <Text key={index} style={styles.listItem}>
              {index + 1}. {instruction}
            </Text>
          ))}
        </View>

        <Pressable
          style={styles.button}
          onPress={() => {
            // TODO: Complete step and navigate
            completeTutorialStep(currentStep);
            navigation.navigate('Game', { mode: 'tutorial' });
          }}
        >
          <Text style={styles.buttonText}>Lektion starten</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 24,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  listItem: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TutorialScreen;
