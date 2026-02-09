import React from 'react';
import { render } from '@testing-library/react-native';
import { TutorialSlide } from '@/components/tutorial/TutorialSlide';
import { TutorialSlide as TutorialSlideData } from '@/types/tutorial.types';

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

  it('renders visual placeholder with correct label', () => {
    const { getByText } = render(
      <TutorialSlide slide={baseSlide} isActive={true} />
    );

    expect(getByText('Karten-Ansicht')).toBeTruthy();
  });

  it('renders correct label for each visual type', () => {
    const types = [
      { type: 'cards' as const, label: 'Karten-Ansicht' },
      { type: 'players' as const, label: 'Spieler-Ansicht' },
      { type: 'points' as const, label: 'Punkte-Ansicht' },
      { type: 'rules' as const, label: 'Regel-Ansicht' },
    ];

    types.forEach(({ type, label }) => {
      const slide: TutorialSlideData = {
        ...baseSlide,
        visual: { type },
      };

      const { getByText } = render(
        <TutorialSlide slide={slide} isActive={true} />
      );

      expect(getByText(label)).toBeTruthy();
    });
  });

  it('does not render visual placeholder when visual is undefined', () => {
    const slide: TutorialSlideData = {
      id: 'no-visual',
      headline: 'No Visual',
      text: 'Text only',
    };

    const { queryByText } = render(
      <TutorialSlide slide={slide} isActive={true} />
    );

    expect(queryByText('Karten-Ansicht')).toBeNull();
    expect(queryByText('Spieler-Ansicht')).toBeNull();
  });
});
