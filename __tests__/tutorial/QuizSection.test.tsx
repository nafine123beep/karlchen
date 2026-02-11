import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { QuizSection } from '@/components/tutorial/QuizSection';
import { TutorialQuiz } from '@/types/tutorial.types';

const mockQuiz: TutorialQuiz = {
  question: 'Was ist richtig?',
  options: [
    { text: 'Falsche Antwort A', isCorrect: false },
    { text: 'Richtige Antwort B', isCorrect: true },
    { text: 'Falsche Antwort C', isCorrect: false },
  ],
  feedbackCorrect: 'Sehr gut!',
  feedbackIncorrect: 'Leider falsch.',
};

describe('QuizSection', () => {
  it('renders question and all options', () => {
    const { getByText } = render(
      <QuizSection quiz={mockQuiz} onCorrectAnswer={jest.fn()} />
    );

    expect(getByText('Was ist richtig?')).toBeTruthy();
    expect(getByText('Falsche Antwort A')).toBeTruthy();
    expect(getByText('Richtige Antwort B')).toBeTruthy();
    expect(getByText('Falsche Antwort C')).toBeTruthy();
  });

  it('calls onCorrectAnswer when correct option is selected', () => {
    const onCorrect = jest.fn();
    const { getByText } = render(
      <QuizSection quiz={mockQuiz} onCorrectAnswer={onCorrect} />
    );

    fireEvent.press(getByText('Richtige Antwort B'));

    expect(onCorrect).toHaveBeenCalledTimes(1);
  });

  it('does not call onCorrectAnswer when wrong option is selected', () => {
    const onCorrect = jest.fn();
    const { getByText } = render(
      <QuizSection quiz={mockQuiz} onCorrectAnswer={onCorrect} />
    );

    fireEvent.press(getByText('Falsche Antwort A'));

    expect(onCorrect).not.toHaveBeenCalled();
  });

  it('shows correct feedback on correct answer', () => {
    const { getByText } = render(
      <QuizSection quiz={mockQuiz} onCorrectAnswer={jest.fn()} />
    );

    fireEvent.press(getByText('Richtige Antwort B'));

    expect(getByText('Sehr gut!')).toBeTruthy();
  });

  it('shows incorrect feedback and retry button on wrong answer', () => {
    const { getByText } = render(
      <QuizSection quiz={mockQuiz} onCorrectAnswer={jest.fn()} />
    );

    fireEvent.press(getByText('Falsche Antwort A'));

    expect(getByText('Leider falsch.')).toBeTruthy();
    expect(getByText('Nochmal versuchen')).toBeTruthy();
  });

  it('resets state on retry and allows re-selection', () => {
    const onCorrect = jest.fn();
    const { getByText } = render(
      <QuizSection quiz={mockQuiz} onCorrectAnswer={onCorrect} />
    );

    // Wrong answer
    fireEvent.press(getByText('Falsche Antwort A'));
    expect(getByText('Leider falsch.')).toBeTruthy();

    // Retry
    fireEvent.press(getByText('Nochmal versuchen'));

    // Should be able to select again
    fireEvent.press(getByText('Richtige Antwort B'));
    expect(onCorrect).toHaveBeenCalledTimes(1);
    expect(getByText('Sehr gut!')).toBeTruthy();
  });

  it('does not show retry button on correct answer', () => {
    const { getByText, queryByText } = render(
      <QuizSection quiz={mockQuiz} onCorrectAnswer={jest.fn()} />
    );

    fireEvent.press(getByText('Richtige Antwort B'));

    expect(queryByText('Nochmal versuchen')).toBeNull();
  });
});
