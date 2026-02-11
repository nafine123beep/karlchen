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

  it('does not show Zur\u00fcck button on first slide', () => {
    const { queryByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(queryByText('Zur\u00fcck')).toBeNull();
  });

  it('advances to next slide on Weiter press', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.press(getByText('Weiter'));

    expect(getByText(basicTutorialSlides[1].headline)).toBeTruthy();
    expect(getByText('Schritt 2 von 6')).toBeTruthy();
  });

  it('shows Zur\u00fcck button after advancing', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.press(getByText('Weiter'));

    expect(getByText('Zur\u00fcck')).toBeTruthy();
  });

  it('goes back to previous slide on Zur\u00fcck press', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Advance to slide 2
    fireEvent.press(getByText('Weiter'));
    expect(getByText(basicTutorialSlides[1].headline)).toBeTruthy();

    // Go back to slide 1
    fireEvent.press(getByText('Zur\u00fcck'));
    expect(getByText(basicTutorialSlides[0].headline)).toBeTruthy();
  });

  it('shows Weiter zum Quiz on last slide', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Navigate to last slide
    for (let i = 0; i < basicTutorialSlides.length - 1; i++) {
      fireEvent.press(getByText('Weiter'));
    }

    expect(getByText('Weiter zum Quiz')).toBeTruthy();
  });

  it('completes tutorial and navigates to QuizIntro on last slide', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Navigate to last slide
    for (let i = 0; i < basicTutorialSlides.length - 1; i++) {
      fireEvent.press(getByText('Weiter'));
    }

    // Press complete button
    fireEvent.press(getByText('Weiter zum Quiz'));

    expect(mockCompleteTutorialStep).toHaveBeenCalledWith('introduction');
    expect(mockReplace).toHaveBeenCalledWith('QuizIntro');
  });

  it('Step 3 shows no quiz UI elements', () => {
    const { getByText, queryByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Navigate to slide 3
    fireEvent.press(getByText('Weiter'));
    fireEvent.press(getByText('Weiter'));

    expect(getByText('Farben und Fehlfarbe')).toBeTruthy();

    // No quiz elements should be present
    expect(queryByText('Kreuz bedienen, falls m\u00f6glich')).toBeNull();
    expect(queryByText('Eine beliebige Karte spielen')).toBeNull();
    expect(queryByText('Immer Trumpf spielen')).toBeNull();
  });
});
