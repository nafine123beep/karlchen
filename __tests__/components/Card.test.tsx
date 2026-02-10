/**
 * Card Component Tests - Verify trump card visual indicators
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Card } from '@/components/cards/Card';
import { Suit, Rank } from '@/types/card.types';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (component: any) => component,
    },
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: (fn: () => any) => fn(),
    withSpring: (v: any) => v,
  };
});

// Track props passed to SVG Rect elements to verify golden border
const renderedRects: any[] = [];

jest.mock('react-native-svg', () => {
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => <View {...props} />,
    Rect: (props: any) => {
      renderedRects.push(props);
      return <View testID={`rect-${props.stroke || 'none'}`} {...props} />;
    },
    Text: (props: any) => <Text {...props} />,
    G: (props: any) => <View {...props} />,
    Path: (props: any) => <View testID="path" {...props} />,
    Defs: (props: any) => <View {...props} />,
    LinearGradient: (props: any) => <View {...props} />,
    Stop: (props: any) => <View {...props} />,
  };
});

describe('Card component - trump visual indicators', () => {
  beforeEach(() => {
    renderedRects.length = 0;
  });

  it('should render golden border (trumpGlow gradient) for trump cards', () => {
    render(<Card suit={Suit.CLUBS} rank={Rank.QUEEN} isTrump={true} />);

    // Find rect with trump glow stroke
    const trumpBorderRect = renderedRects.find(
      r => r.stroke === 'url(#trumpGlow)',
    );
    expect(trumpBorderRect).toBeDefined();
    expect(trumpBorderRect.strokeWidth).toBe(3);
  });

  it('should NOT render golden border for non-trump cards', () => {
    render(<Card suit={Suit.HEARTS} rank={Rank.ACE} isTrump={false} />);

    const trumpBorderRect = renderedRects.find(
      r => r.stroke === 'url(#trumpGlow)',
    );
    expect(trumpBorderRect).toBeUndefined();
  });

  it('should use golden stroke on card background for trump cards', () => {
    render(<Card suit={Suit.DIAMONDS} rank={Rank.NINE} isTrump={true} />);

    // Card background rect uses #f59e0b stroke for trump
    const bgRect = renderedRects.find(r => r.stroke === '#f59e0b');
    expect(bgRect).toBeDefined();
  });

  it('should use default gray stroke on card background for non-trump cards', () => {
    render(<Card suit={Suit.HEARTS} rank={Rank.ACE} isTrump={false} />);

    // Card background rect uses #e5e7eb stroke for non-trump
    const bgRect = renderedRects.find(r => r.stroke === '#e5e7eb');
    expect(bgRect).toBeDefined();
  });

  it('should NOT render a star icon for trump cards', () => {
    const { queryAllByTestId } = render(
      <Card suit={Suit.CLUBS} rank={Rank.QUEEN} isTrump={true} />,
    );

    // Star was an SVG Path with a specific star path data inside a G at translate(52,4)
    // After removal, there should be no star-related path elements beyond suit symbols
    // We verify by counting Path elements: 3 expected (top-left suit, center suit, bottom-right suit)
    const paths = queryAllByTestId('path');
    expect(paths).toHaveLength(3);
  });

  it('should render exactly 3 suit paths for non-trump cards too', () => {
    const { queryAllByTestId } = render(
      <Card suit={Suit.HEARTS} rank={Rank.ACE} isTrump={false} />,
    );

    const paths = queryAllByTestId('path');
    expect(paths).toHaveLength(3);
  });
});
