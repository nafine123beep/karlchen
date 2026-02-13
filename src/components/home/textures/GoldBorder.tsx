/**
 * GoldBorder Component
 * SVG-based gold decorative border overlay for ornate buttons
 */

import React from 'react';
import Svg, { Defs, Rect, LinearGradient, Stop, Path } from 'react-native-svg';
import { HOME_THEME } from '@/theme/homeTheme';

interface GoldBorderProps {
  width: number | string;
  height: number | string;
  borderRadius?: number;
  showCornerOrnaments?: boolean;
}

export const GoldBorder: React.FC<GoldBorderProps> = ({
  width,
  height,
  borderRadius = 12,
  showCornerOrnaments = false,
}) => {
  const w = typeof width === 'number' ? width : 300;
  const h = typeof height === 'number' ? height : 100;

  return (
    <Svg width={width} height={height} style={{ position: 'absolute' }}>
      <Defs>
        {/* Gold gradient for realistic metallic look */}
        <LinearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={HOME_THEME.gold.light} stopOpacity="1" />
          <Stop offset="50%" stopColor={HOME_THEME.gold.primary} stopOpacity="1" />
          <Stop offset="100%" stopColor={HOME_THEME.gold.shadow} stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Outer gold border */}
      <Rect
        x="2"
        y="2"
        width={typeof width === 'number' ? width - 4 : '99%'}
        height={typeof height === 'number' ? height - 4 : '99%'}
        rx={borderRadius}
        ry={borderRadius}
        fill="none"
        stroke="url(#goldGradient)"
        strokeWidth="3"
      />

      {/* Inner highlight line */}
      <Rect
        x="6"
        y="6"
        width={typeof width === 'number' ? width - 12 : '97%'}
        height={typeof height === 'number' ? height - 12 : '97%'}
        rx={borderRadius - 2}
        ry={borderRadius - 2}
        fill="none"
        stroke={HOME_THEME.gold.light}
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Corner ornaments (optional) */}
      {showCornerOrnaments && (
        <>
          {/* Top-left corner ornament */}
          <Path
            d={`M 15 10 Q 10 10 10 15 L 10 20`}
            stroke={HOME_THEME.gold.accent}
            strokeWidth="1.5"
            fill="none"
          />
          <Path
            d={`M 10 15 L 20 15`}
            stroke={HOME_THEME.gold.accent}
            strokeWidth="1.5"
            fill="none"
          />

          {/* Top-right corner ornament */}
          <Path
            d={`M ${w - 15} 10 Q ${w - 10} 10 ${w - 10} 15 L ${w - 10} 20`}
            stroke={HOME_THEME.gold.accent}
            strokeWidth="1.5"
            fill="none"
          />
          <Path
            d={`M ${w - 10} 15 L ${w - 20} 15`}
            stroke={HOME_THEME.gold.accent}
            strokeWidth="1.5"
            fill="none"
          />

          {/* Bottom-left corner ornament */}
          <Path
            d={`M 15 ${h - 10} Q 10 ${h - 10} 10 ${h - 15} L 10 ${h - 20}`}
            stroke={HOME_THEME.gold.accent}
            strokeWidth="1.5"
            fill="none"
          />
          <Path
            d={`M 10 ${h - 15} L 20 ${h - 15}`}
            stroke={HOME_THEME.gold.accent}
            strokeWidth="1.5"
            fill="none"
          />

          {/* Bottom-right corner ornament */}
          <Path
            d={`M ${w - 15} ${h - 10} Q ${w - 10} ${h - 10} ${w - 10} ${h - 15} L ${w - 10} ${h - 20}`}
            stroke={HOME_THEME.gold.accent}
            strokeWidth="1.5"
            fill="none"
          />
          <Path
            d={`M ${w - 10} ${h - 15} L ${w - 20} ${h - 15}`}
            stroke={HOME_THEME.gold.accent}
            strokeWidth="1.5"
            fill="none"
          />
        </>
      )}
    </Svg>
  );
};
