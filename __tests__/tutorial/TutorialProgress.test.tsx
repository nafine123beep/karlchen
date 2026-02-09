import React from 'react';
import { render } from '@testing-library/react-native';
import { TutorialProgress } from '@/components/tutorial/TutorialProgress';

describe('TutorialProgress', () => {
  it('renders correct number of dots', () => {
    const { toJSON } = render(
      <TutorialProgress totalSteps={5} currentStep={0} />
    );

    // The dotsRow View should contain 5 dot children
    const tree = toJSON() as any;
    const dotsRow = tree.children[0]; // First child is dotsRow
    expect(dotsRow.children).toHaveLength(5);
  });

  it('shows step label text', () => {
    const { getByText } = render(
      <TutorialProgress totalSteps={5} currentStep={0} />
    );

    expect(getByText('Schritt 1 von 5')).toBeTruthy();
  });

  it('shows correct step number for middle step', () => {
    const { getByText } = render(
      <TutorialProgress totalSteps={5} currentStep={2} />
    );

    expect(getByText('Schritt 3 von 5')).toBeTruthy();
  });

  it('shows correct step number for last step', () => {
    const { getByText } = render(
      <TutorialProgress totalSteps={5} currentStep={4} />
    );

    expect(getByText('Schritt 5 von 5')).toBeTruthy();
  });

  it('renders with different total steps', () => {
    const { getByText } = render(
      <TutorialProgress totalSteps={3} currentStep={1} />
    );

    expect(getByText('Schritt 2 von 3')).toBeTruthy();
  });
});
