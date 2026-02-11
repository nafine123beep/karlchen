import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BasicTutorialScreen from '@/screens/tutorial/BasicTutorialScreen';
import { basicTutorialSlides } from '@/data/tutorial/tutorialSlides';

// Mock Card component (uses reanimated + svg)
jest.mock('@/components/cards/Card', () => {
  const { View, Text } = require('react-native');
  return {
    Card: ({ suit, rank }: any) => (
      <View><Text>{`${rank} ${suit}`}</Text></View>
    ),
  };
});

// Mock navigation
const mockReplace = jest.fn();
const mockNavigation = {
  replace: mockReplace,
  navigate: jest.fn(),
  goBack: jest.fn(),
} as any;

const mockRoute = { params: {} } as any;

// Mock learning store
const mockCompleteTutorialStep = jest.fn();
jest.mock('@/store/learningStore', () => ({
  useLearningStore: (selector: any) =>
    selector({ completeTutorialStep: mockCompleteTutorialStep }),
}));

describe('BasicTutorialScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders first slide on mount', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText(basicTutorialSlides[0].headline)).toBeTruthy();
    expect(getByText('Schritt 1 von 6')).toBeTruthy();
  });

  it('shows step badge on first slide', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('1 / 6')).toBeTruthy();
  });

  it('updates step badge when advancing', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.press(getByText('Weiter'));

    expect(getByText('2 / 6')).toBeTruthy();
  });

  it('shows Weiter button on first slide', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Weiter')).toBeTruthy();
  });

  it('does not show Zurück button on first slide', () => {
    const { queryByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(queryByText('Zurück')).toBeNull();
  });

  it('advances to next slide on Weiter press', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.press(getByText('Weiter'));

    expect(getByText(basicTutorialSlides[1].headline)).toBeTruthy();
    expect(getByText('Schritt 2 von 6')).toBeTruthy();
  });

  it('shows Zurück button after advancing', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.press(getByText('Weiter'));

    expect(getByText('Zurück')).toBeTruthy();
  });

  it('goes back to previous slide on Zurück press', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Advance to slide 2
    fireEvent.press(getByText('Weiter'));
    expect(getByText(basicTutorialSlides[1].headline)).toBeTruthy();

    // Go back to slide 1
    fireEvent.press(getByText('Zurück'));
    expect(getByText(basicTutorialSlides[0].headline)).toBeTruthy();
  });

  it('shows Tutorial abschließen on last slide', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Navigate to last slide (answer quiz on slide 3)
    for (let i = 0; i < basicTutorialSlides.length - 1; i++) {
      try {
        const correctOption = getByText('Kreuz bedienen, falls möglich');
        fireEvent.press(correctOption);
      } catch {
        // Not a quiz slide, continue
      }
      fireEvent.press(getByText('Weiter'));
    }

    expect(getByText('Tutorial abschließen')).toBeTruthy();
  });

  it('completes tutorial and navigates to Home on last slide', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Navigate to last slide (answer quiz on slide 3)
    for (let i = 0; i < basicTutorialSlides.length - 1; i++) {
      // If this is the quiz slide, answer the quiz first
      try {
        const correctOption = getByText('Kreuz bedienen, falls möglich');
        fireEvent.press(correctOption);
      } catch {
        // Not a quiz slide, continue
      }
      fireEvent.press(getByText('Weiter'));
    }

    // Press complete button
    fireEvent.press(getByText('Tutorial abschließen'));

    expect(mockCompleteTutorialStep).toHaveBeenCalledWith('introduction');
    expect(mockReplace).toHaveBeenCalledWith('Home');
  });

  it('disables Weiter button on quiz slide until answered correctly', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Navigate to slide 3 (the quiz slide, index 2)
    fireEvent.press(getByText('Weiter'));
    fireEvent.press(getByText('Weiter'));

    expect(getByText('Farben und Fehlfarbe')).toBeTruthy();

    // Pressing Weiter should NOT advance (quiz not answered)
    fireEvent.press(getByText('Weiter'));
    expect(getByText('Farben und Fehlfarbe')).toBeTruthy();

    // Answer the quiz correctly
    fireEvent.press(getByText('Kreuz bedienen, falls möglich'));

    // Now Weiter should work
    fireEvent.press(getByText('Weiter'));
    expect(getByText(basicTutorialSlides[3].headline)).toBeTruthy();
  });

  it('shows feedback on wrong quiz answer and allows retry', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Navigate to quiz slide
    fireEvent.press(getByText('Weiter'));
    fireEvent.press(getByText('Weiter'));

    // Choose wrong answer
    fireEvent.press(getByText('Eine beliebige Karte spielen'));

    // Should show incorrect feedback
    expect(getByText(/Nicht ganz/)).toBeTruthy();

    // Should show retry button
    fireEvent.press(getByText('Nochmal versuchen'));

    // Should be able to try again
    fireEvent.press(getByText('Kreuz bedienen, falls möglich'));
    expect(getByText(/Richtig/)).toBeTruthy();
  });
});
