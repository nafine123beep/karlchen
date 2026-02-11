import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import QuizScreen from '@/screens/quiz/QuizScreen';
import { useQuizStore } from '@/store/quizStore';

// Mock navigation
const mockReplace = jest.fn();
const mockNavigation = {
  replace: mockReplace,
  navigate: jest.fn(),
  goBack: jest.fn(),
} as any;

const mockRoute = { params: {} } as any;

describe('QuizScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useQuizStore.getState().startQuiz();
  });

  it('renders first question and options', () => {
    const { getByText } = render(
      <QuizScreen navigation={mockNavigation} route={mockRoute} />
    );

    const question = useQuizStore.getState().questions[0];
    expect(getByText(question.questionText)).toBeTruthy();
    question.options.forEach(opt => {
      expect(getByText(opt)).toBeTruthy();
    });
  });

  it('shows progress badge', () => {
    const { getByText } = render(
      <QuizScreen navigation={mockNavigation} route={mockRoute} />
    );

    const total = useQuizStore.getState().questions.length;
    expect(getByText(`Frage 1 / ${total}`)).toBeTruthy();
  });

  it('shows feedback after selecting an answer', () => {
    const { getByText } = render(
      <QuizScreen navigation={mockNavigation} route={mockRoute} />
    );

    const question = useQuizStore.getState().questions[0];
    const correctOption = question.options[question.correctOptionIndex];

    fireEvent.press(getByText(correctOption));

    expect(getByText('Richtig!')).toBeTruthy();
    expect(getByText(question.explanation)).toBeTruthy();
  });

  it('shows Weiter button after answering', () => {
    const { getByText, queryByText } = render(
      <QuizScreen navigation={mockNavigation} route={mockRoute} />
    );

    // No Weiter button before answering
    expect(queryByText('Weiter')).toBeNull();

    const question = useQuizStore.getState().questions[0];
    fireEvent.press(getByText(question.options[0]));

    // Weiter button appears
    expect(getByText('Weiter')).toBeTruthy();
  });

  it('advances to next question on Weiter press', () => {
    const { getByText } = render(
      <QuizScreen navigation={mockNavigation} route={mockRoute} />
    );

    const questions = useQuizStore.getState().questions;

    // Answer first question
    fireEvent.press(getByText(questions[0].options[0]));
    fireEvent.press(getByText('Weiter'));

    // Should show second question
    expect(getByText(questions[1].questionText)).toBeTruthy();
  });

  it('shows incorrect feedback on wrong answer', () => {
    const { getByText } = render(
      <QuizScreen navigation={mockNavigation} route={mockRoute} />
    );

    const question = useQuizStore.getState().questions[0];
    const wrongIndex = question.correctOptionIndex === 0 ? 1 : 0;

    fireEvent.press(getByText(question.options[wrongIndex]));

    expect(getByText('Falsch')).toBeTruthy();
  });

  it('navigates to QuizResult on last question', () => {
    const questions = useQuizStore.getState().questions;

    // Advance to last question in store
    for (let i = 0; i < questions.length - 1; i++) {
      useQuizStore.getState().answerQuestion(0);
      useQuizStore.getState().nextQuestion();
    }

    const { getByText } = render(
      <QuizScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Answer last question
    const lastQ = questions[questions.length - 1];
    fireEvent.press(getByText(lastQ.options[0]));

    expect(getByText('Ergebnis anzeigen')).toBeTruthy();
    fireEvent.press(getByText('Ergebnis anzeigen'));

    expect(mockReplace).toHaveBeenCalledWith('QuizResult');
  });
});
