import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { TutorialQuiz } from '@/types/tutorial.types';

interface QuizSectionProps {
  quiz: TutorialQuiz;
  onCorrectAnswer: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ quiz, onCorrectAnswer }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelectedIndex(index);
    setAnswered(true);
    if (quiz.options[index].isCorrect) {
      onCorrectAnswer();
    }
  };

  const handleRetry = () => {
    setSelectedIndex(null);
    setAnswered(false);
  };

  const isCorrect = selectedIndex !== null && quiz.options[selectedIndex].isCorrect;

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{quiz.question}</Text>

      {quiz.options.map((option, index) => {
        let optionStyle = styles.optionDefault;
        if (answered && index === selectedIndex) {
          optionStyle = option.isCorrect ? styles.optionCorrect : styles.optionIncorrect;
        } else if (answered && option.isCorrect) {
          optionStyle = styles.optionCorrectHint;
        }

        return (
          <Pressable
            key={index}
            style={[styles.option, optionStyle]}
            onPress={() => handleSelect(index)}
            disabled={answered}
          >
            <Text style={styles.optionText}>{option.text}</Text>
          </Pressable>
        );
      })}

      {answered && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>
            {isCorrect ? quiz.feedbackCorrect : quiz.feedbackIncorrect}
          </Text>
          {!isCorrect && (
            <Pressable style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryText}>Nochmal versuchen</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    marginTop: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  optionDefault: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  optionCorrect: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  optionIncorrect: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  optionCorrectHint: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  optionText: {
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
  },
  feedbackContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
