/**
 * Home Screen Theme Constants
 * Game-themed design tokens for ornate UI
 */

export const HOME_THEME = {
  background: {
    felt: '#1a4d2e', // Dark green felt (poker table)
    feltLight: '#2d6b47', // Lighter felt for gradients
    feltOverlay: 'rgba(0, 0, 0, 0.2)', // Vignette overlay
  },
  wood: {
    primary: '#6b4423', // Medium wood brown
    dark: '#5a3a1f', // Dark wood for gradients
    shadow: '#3d2815', // Dark wood shadow
    highlight: '#9d6b3f', // Light wood highlight
  },
  gold: {
    primary: '#d4af37', // Classic gold
    accent: '#ffd700', // Bright gold
    shadow: '#b8941f', // Dark gold
    light: '#e8c547', // Light gold for highlights
  },
  text: {
    primary: '#ffffff', // White text
    secondary: '#f8f8f8', // Off-white
    accent: '#d4af37', // Gold accent text
  },
};

export const HOME_LAYOUT = {
  padding: {
    screen: 20,
    section: 16,
    button: 16,
  },
  button: {
    horizontal: {
      height: 80,
      borderRadius: 12,
      gap: 12,
    },
    featured: {
      height: 140,
      borderRadius: 16,
      marginVertical: 24,
    },
  },
  header: {
    height: 120,
    paddingVertical: 24,
  },
};

export const HOME_SHADOWS = {
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  header: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
};
