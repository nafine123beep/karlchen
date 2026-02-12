import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { useQuizStore } from '@/store/quizStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

const QuizScreen: React.FC<Props> = ({ navigation }) => {
  const questions = useQuizStore(state => state.questions);
  const currentIndex = useQuizStore(state => state.currentIndex);
  const answerQuestion = useQuizStore(state => state.answerQuestion);
  const nextQuestion = useQuizStore(state => state.nextQuestion);
  const storedAnswers = useQuizStore(state => state.answers);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const isCorrect = selectedIndex === question.correctOptionIndex;

  const handleSelect = useCallback((index: number) => {
    if (answered) return;
    setSelectedIndex(index);
    setAnswered(true);
    answerQuestion(index);
  }, [answered, answerQuestion]);

  const handleNext = useCallback(() => {
    if (isLast) {
      nextQuestion();
      navigation.replace('QuizResult');
    } else {
      nextQuestion();
      setSelectedIndex(null);
      setAnswered(false);
    }
  }, [isLast, nextQuestion, navigation]);

  return (
    <View style={styles.container}>
      {/* Exit button */}
      <View style={styles.exitRow}>
        <Pressable
          style={({ pressed }) => [styles.exitButton, pressed && styles.buttonPressed]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.exitButtonText}>Beenden</Text>
        </Pressable>
      </View>

      {/* Progress badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          Frage {currentIndex + 1} / {questions.length}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.questionText}>{question.questionText}</Text>

        {question.options.map((option, index) => {
          let optionStyle = styles.optionDefault;
          if (answered && index === selectedIndex) {
            optionStyle = index === question.correctOptionIndex
              ? styles.optionCorrect
              : styles.optionIncorrect;
          } else if (answered && index === question.correctOptionIndex) {
            optionStyle = styles.optionCorrectHint;
          }

          return (
            <Pressable
              key={index}
              style={[styles.option, optionStyle]}
              onPress={() => handleSelect(index)}
              disabled={answered}
            >
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          );
        })}

        {answered && (
          <View style={styles.explanationContainer}>
            <Text style={[styles.feedbackLabel, isCorrect ? styles.correctLabel : styles.incorrectLabel]}>
              {isCorrect ? 'Richtig!' : 'Falsch'}
            </Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}
      </ScrollView>

      {/* Weiter button */}
      {answered && (
        <Pressable
          style={({ pressed }) => [styles.nextButton, pressed && styles.buttonPressed]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {isLast ? 'Ergebnis anzeigen' : 'Weiter'}
          </Text>
        </Pressable>
      )}
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
  exitRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  exitButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  exitButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  badgeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 24,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
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
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  explanationContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  correctLabel: {
    color: '#22c55e',
  },
  incorrectLabel: {
    color: '#ef4444',
  },
  explanationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  nextButtonText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default QuizScreen;
