import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { useQuizStore } from '@/store/quizStore';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizIntro'>;

const QuizIntroScreen: React.FC<Props> = ({ navigation }) => {
  const startQuiz = useQuizStore(state => state.startQuiz);
  const total = useQuizStore(state => state.questions.length);

  const handleStart = () => {
    startQuiz();
    navigation.replace('Quiz');
  };

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

      <View style={styles.content}>
        <Text style={styles.title}>Quiz</Text>
        <Text style={styles.subtitle}>
          Teste die wichtigsten Regeln: Farbzwang, Trumpf und Stichlogik.
        </Text>
        <Text style={styles.info}>{total} Fragen</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleStart}
      >
        <Text style={styles.buttonText}>Quiz starten</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  exitRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default QuizIntroScreen;
