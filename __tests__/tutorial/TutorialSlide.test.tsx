import React from 'react';
import { render } from '@testing-library/react-native';
import { TutorialSlide } from '@/components/tutorial/TutorialSlide';
import { TutorialSlide as TutorialSlideData } from '@/types/tutorial.types';

// Mock Card component (uses reanimated + svg)
jest.mock('@/components/cards/Card', () => {
  const { View, Text } = require('react-native');
  return {
    Card: ({ suit, rank }: any) => (
      <View><Text>{`${rank} ${suit}`}</Text></View>
    ),
  };
});

const baseSlide: TutorialSlideData = {
  id: 'test-slide',
  headline: 'Test Headline',
  text: 'Test paragraph text',
  visual: { type: 'cards' },
};

describe('TutorialSlide', () => {
  it('renders headline and text', () => {
    const { getByText } = render(
      <TutorialSlide slide={baseSlide} isActive={true} />
    );

    expect(getByText('Test Headline')).toBeTruthy();
    expect(getByText('Test paragraph text')).toBeTruthy();
  });

  it('returns null when isActive is false', () => {
    const { toJSON } = render(
      <TutorialSlide slide={baseSlide} isActive={false} />
    );

    expect(toJSON()).toBeNull();
  });

  it('renders multiple text paragraphs', () => {
    const slide: TutorialSlideData = {
      ...baseSlide,
      text: ['First paragraph', 'Second paragraph'],
    };

    const { getByText } = render(
      <TutorialSlide slide={slide} isActive={true} />
    );

    expect(getByText('First paragraph')).toBeTruthy();
    expect(getByText('Second paragraph')).toBeTruthy();
  });

  it('renders bullet points when provided', () => {
    const slide: TutorialSlideData = {
      ...baseSlide,
      bulletPoints: ['Point one', 'Point two', 'Point three'],
    };

    const { getByText } = render(
      <TutorialSlide slide={slide} isActive={true} />
    );

    expect(getByText('Point one')).toBeTruthy();
    expect(getByText('Point two')).toBeTruthy();
    expect(getByText('Point three')).toBeTruthy();
  });

  it('renders highlight text when provided', () => {
    const slide: TutorialSlideData = {
      ...baseSlide,
      highlightText: 'Important info!',
    };

    const { getByText } = render(
      <TutorialSlide slide={slide} isActive={true} />
    );

    expect(getByText('Important info!')).toBeTruthy();
  });

  it('renders cards visual for cards type', () => {
    const { getByText } = render(
      <TutorialSlide slide={baseSlide} isActive={true} />
    );

    // Card mock renders "rank suit" text
    expect(getByText('Q clubs')).toBeTruthy();
  });

  it('renders rules visual for rules type', () => {
    const slide: TutorialSlideData = {
      ...baseSlide,
      visual: { type: 'rules' },
    };

    const { getByText } = render(
      <TutorialSlide slide={slide} isActive={true} />
    );

    // RulesVisual shows a mini trick with Farbzwang annotations
    expect(getByText('Stich')).toBeTruthy();
    expect(getByText(/spielt ♠ aus/)).toBeTruthy();
    // Two players have "Farbzwang!" tags (Ben + Clara)
    const { getAllByText } = render(
      <TutorialSlide slide={slide} isActive={true} />
    );
    expect(getAllByText('Farbzwang!')).toHaveLength(2);
  });

  it('does not render visual when visual is undefined', () => {
    const slide: TutorialSlideData = {
      id: 'no-visual',
      headline: 'No Visual',
      text: 'Text only',
    };

    const { queryByText } = render(
      <TutorialSlide slide={slide} isActive={true} />
    );

    expect(queryByText('Stich')).toBeNull();
    expect(queryByText('Q clubs')).toBeNull();
  });

  it('renders suits visual for suits type', () => {
    const slide: TutorialSlideData = {
      ...baseSlide,
      visual: { type: 'suits' },
    };

    const { getByText } = render(
      <TutorialSlide slide={slide} isActive={true} />
    );

    expect(getByText('Kreuz')).toBeTruthy();
    expect(getByText('Pik')).toBeTruthy();
    expect(getByText('Herz')).toBeTruthy();
    expect(getByText('Karo')).toBeTruthy();
  });

  it('renders quiz question and options when quiz is provided', () => {
    const quizSlide: TutorialSlideData = {
      ...baseSlide,
      quiz: {
        question: 'Test question?',
        options: [
          { text: 'Option A', isCorrect: false },
          { text: 'Option B', isCorrect: true },
        ],
        feedbackCorrect: 'Correct!',
        feedbackIncorrect: 'Wrong!',
      },
    };

    const mockCallback = jest.fn();
    const { getByText } = render(
      <TutorialSlide slide={quizSlide} isActive={true} onQuizCorrect={mockCallback} />
    );

    expect(getByText('Test question?')).toBeTruthy();
    expect(getByText('Option A')).toBeTruthy();
    expect(getByText('Option B')).toBeTruthy();
  });

  it('does not render quiz when onQuizCorrect callback is not provided', () => {
    const quizSlide: TutorialSlideData = {
      ...baseSlide,
      quiz: {
        question: 'Test question?',
        options: [
          { text: 'Option A', isCorrect: false },
          { text: 'Option B', isCorrect: true },
        ],
        feedbackCorrect: 'Correct!',
        feedbackIncorrect: 'Wrong!',
      },
    };

    const { queryByText } = render(
      <TutorialSlide slide={quizSlide} isActive={true} />
    );

    expect(queryByText('Test question?')).toBeNull();
  });
});
