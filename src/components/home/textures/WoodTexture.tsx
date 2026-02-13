/**
 * WoodTexture Component
 * SVG-based wood grain texture for ornate buttons
 */

import React from 'react';
import Svg, { Defs, Rect, LinearGradient, Stop, Pattern, Path } from 'react-native-svg';
import { HOME_THEME } from '@/theme/homeTheme';

interface WoodTextureProps {
  width: number | string;
  height: number | string;
}

export const WoodTexture: React.FC<WoodTextureProps> = ({ width, height }) => {
  return (
    <Svg width={width} height={height}>
      <Defs>
        {/* Wood grain gradient */}
        <LinearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={HOME_THEME.wood.dark} stopOpacity="1" />
          <Stop offset="20%" stopColor={HOME_THEME.wood.primary} stopOpacity="1" />
          <Stop offset="40%" stopColor={HOME_THEME.wood.highlight} stopOpacity="1" />
          <Stop offset="60%" stopColor={HOME_THEME.wood.primary} stopOpacity="1" />
          <Stop offset="80%" stopColor={HOME_THEME.wood.dark} stopOpacity="1" />
          <Stop offset="100%" stopColor={HOME_THEME.wood.primary} stopOpacity="1" />
        </LinearGradient>

        {/* Vertical grain lines pattern */}
        <Pattern
          id="grainPattern"
          x="0"
          y="0"
          width="40"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <Path
            d="M 10 0 Q 12 50 10 100"
            stroke={HOME_THEME.wood.shadow}
            strokeWidth="0.5"
            fill="none"
            opacity="0.3"
          />
          <Path
            d="M 25 0 Q 23 50 25 100"
            stroke={HOME_THEME.wood.shadow}
            strokeWidth="0.5"
            fill="none"
            opacity="0.2"
          />
        </Pattern>
      </Defs>

      {/* Base wood color with gradient */}
      <Rect width="100%" height="100%" fill="url(#woodGradient)" />

      {/* Grain pattern overlay */}
      <Rect width="100%" height="100%" fill="url(#grainPattern)" />

      {/* Subtle highlight on top edge */}
      <Rect
        y="0"
        width="100%"
        height="4"
        fill={HOME_THEME.wood.highlight}
        opacity="0.3"
      />

      {/* Subtle shadow on bottom edge */}
      <Rect
        y="96%"
        width="100%"
        height="4%"
        fill={HOME_THEME.wood.shadow}
        opacity="0.4"
      />
    </Svg>
  );
};
