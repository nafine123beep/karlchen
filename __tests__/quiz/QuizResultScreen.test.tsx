import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import QuizResultScreen from '@/screens/quiz/QuizResultScreen';
import { useQuizStore } from '@/store/quizStore';

// Mock navigation
const mockReplace = jest.fn();
const mockNavigation = {
  replace: mockReplace,
  navigate: jest.fn(),
  goBack: jest.fn(),
} as any;

const mockRoute = { params: {} } as any;

describe('QuizResultScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useQuizStore.getState().startQuiz();
  });

  it('shows score', () => {
    const questions = useQuizStore.getState().questions;
    // Answer all correctly
    for (let i = 0; i < questions.length; i++) {
      useQuizStore.getState().answerQuestion(questions[i].correctOptionIndex);
      useQuizStore.getState().nextQuestion();
    }

    const { getByText } = render(
      <QuizResultScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText(`${questions.length} / ${questions.length} richtig`)).toBeTruthy();
    expect(getByText('Sehr gut!')).toBeTruthy();
  });

  it('shows partial score', () => {
    const questions = useQuizStore.getState().questions;
    // Answer first 3 correctly, rest wrong
    for (let i = 0; i < questions.length; i++) {
      if (i < 3) {
        useQuizStore.getState().answerQuestion(questions[i].correctOptionIndex);
      } else {
        const wrongIndex = questions[i].correctOptionIndex === 0 ? 1 : 0;
        useQuizStore.getState().answerQuestion(wrongIndex);
      }
      useQuizStore.getState().nextQuestion();
    }

    const { getByText } = render(
      <QuizResultScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText(`3 / ${questions.length} richtig`)).toBeTruthy();
    expect(getByText('Weiter \u00fcben!')).toBeTruthy();
  });

  it('navigates to Home on menu button press', () => {
    const { getByText } = render(
      <QuizResultScreen navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.press(getByText('Zur\u00fcck zum Men\u00fc'));

    expect(mockReplace).toHaveBeenCalledWith('Home');
  });

  it('restarts quiz and navigates to Quiz', () => {
    const { getByText } = render(
      <QuizResultScreen navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.press(getByText('Quiz wiederholen'));

    expect(mockReplace).toHaveBeenCalledWith('Quiz');
    // Verify store was reset
    const state = useQuizStore.getState();
    expect(state.currentIndex).toBe(0);
    expect(state.isCompleted).toBe(false);
  });
});
