/**
 * OrnateHeader Component
 * Decorative wooden header bar for HomeScreen
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WoodTexture } from './textures/WoodTexture';
import { HOME_THEME, HOME_LAYOUT, HOME_SHADOWS } from '@/theme/homeTheme';

interface OrnateHeaderProps {
  title: string;
  subtitle?: string;
  showMascot?: boolean;
}

export const OrnateHeader: React.FC<OrnateHeaderProps> = ({
  title,
  subtitle,
  showMascot = false,
}) => {
  return (
    <View style={[styles.container, HOME_SHADOWS.header]}>
      {/* Wood texture background */}
      <View style={StyleSheet.absoluteFill}>
        <WoodTexture width="100%" height="100%" />
      </View>

      {/* Semi-transparent overlay for better text contrast */}
      <View style={styles.overlay} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Optional mascot placeholder */}
      {showMascot && (
        <View style={styles.mascotContainer}>
          <Text style={styles.mascotPlaceholder}>🃏</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HOME_LAYOUT.header.height,
    paddingVertical: HOME_LAYOUT.header.paddingVertical,
    paddingHorizontal: HOME_LAYOUT.padding.screen,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  content: {
    alignItems: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: HOME_THEME.text.primary,
    textAlign: 'center',
    // Gold accent color
    // textShadowColor: HOME_THEME.gold.shadow,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: HOME_THEME.text.secondary,
    textAlign: 'center',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  mascotContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  mascotPlaceholder: {
    fontSize: 40,
  },
});
