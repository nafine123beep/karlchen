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
    expect(getByText('Schritt 1 von 5')).toBeTruthy();
  });

  it('shows step badge on first slide', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('1 / 5')).toBeTruthy();
  });

  it('updates step badge when advancing', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.press(getByText('Weiter'));

    expect(getByText('2 / 5')).toBeTruthy();
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
    expect(getByText('Schritt 2 von 5')).toBeTruthy();
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

    // Navigate to last slide
    for (let i = 0; i < basicTutorialSlides.length - 1; i++) {
      fireEvent.press(getByText('Weiter'));
    }

    expect(getByText('Tutorial abschließen')).toBeTruthy();
  });

  it('completes tutorial and navigates to Home on last slide', () => {
    const { getByText } = render(
      <BasicTutorialScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Navigate to last slide
    for (let i = 0; i < basicTutorialSlides.length - 1; i++) {
      fireEvent.press(getByText('Weiter'));
    }

    // Press complete button
    fireEvent.press(getByText('Tutorial abschließen'));

    expect(mockCompleteTutorialStep).toHaveBeenCalledWith('introduction');
    expect(mockReplace).toHaveBeenCalledWith('Home');
  });
});
