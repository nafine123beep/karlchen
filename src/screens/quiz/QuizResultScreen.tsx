import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { useQuizStore } from '@/store/quizStore';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizResult'>;

function getResultMessage(correct: number, total: number): string {
  const ratio = correct / total;
  if (ratio >= 0.9) return 'Sehr gut!';
  if (ratio >= 0.6) return 'Gut gemacht!';
  return 'Weiter \u00fcben!';
}

const QuizResultScreen: React.FC<Props> = ({ navigation }) => {
  const getScore = useQuizStore(state => state.getScore);
  const startQuiz = useQuizStore(state => state.startQuiz);
  const { correct, total } = getScore();
  const message = getResultMessage(correct, total);

  const handleRestart = () => {
    startQuiz();
    navigation.replace('Quiz');
  };

  const handleHome = () => {
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ergebnis</Text>
        <Text style={styles.score}>{correct} / {total} richtig</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={handleHome}
        >
          <Text style={styles.secondaryButtonText}>Zurück zum Menü</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
          onPress={handleRestart}
        >
          <Text style={styles.primaryButtonText}>Quiz wiederholen</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  score: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  message: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
  },
  buttonRow: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
  },
});

export default QuizResultScreen;
