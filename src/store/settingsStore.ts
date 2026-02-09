/**
 * Settings Store - Zustand store for app settings and preferences
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AILevel } from '@/engine/ai/AIPlayer';

interface AppSettings {
  // Game Settings
  aiDifficulty: AILevel;
  enableSounds: boolean;
  enableAnimations: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';

  // Learning Settings
  showTips: boolean;
  autoAdvanceTutorial: boolean;

  // UI Settings
  cardSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark' | 'auto';

  // Accessibility
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface SettingsStore extends AppSettings {
  // Actions
  setAIDifficulty: (difficulty: AILevel) => void;
  setEnableSounds: (enabled: boolean) => void;
  setEnableAnimations: (enabled: boolean) => void;
  setAnimationSpeed: (speed: 'slow' | 'normal' | 'fast') => void;
  setShowTips: (show: boolean) => void;
  setAutoAdvanceTutorial: (auto: boolean) => void;
  setCardSize: (size: 'small' | 'medium' | 'large') => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setHighContrast: (enabled: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;

  // Utilities
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => void;
}

const defaultSettings: AppSettings = {
  // Game Settings
  aiDifficulty: AILevel.Medium,
  enableSounds: true,
  enableAnimations: true,
  animationSpeed: 'normal',

  // Learning Settings
  showTips: true,
  autoAdvanceTutorial: false,

  // UI Settings
  cardSize: 'medium',
  theme: 'auto',

  // Accessibility
  highContrast: false,
  fontSize: 'medium',
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      // Initial State
      ...defaultSettings,

      // Game Settings Actions
      setAIDifficulty: (difficulty: AILevel) => {
        set({ aiDifficulty: difficulty });
      },

      setEnableSounds: (enabled: boolean) => {
        set({ enableSounds: enabled });
      },

      setEnableAnimations: (enabled: boolean) => {
        set({ enableAnimations: enabled });
      },

      setAnimationSpeed: (speed: 'slow' | 'normal' | 'fast') => {
        set({ animationSpeed: speed });
      },

      // Learning Settings Actions
      setShowTips: (show: boolean) => {
        set({ showTips: show });
      },

      setAutoAdvanceTutorial: (auto: boolean) => {
        set({ autoAdvanceTutorial: auto });
      },

      // UI Settings Actions
      setCardSize: (size: 'small' | 'medium' | 'large') => {
        set({ cardSize: size });
      },

      setTheme: (theme: 'light' | 'dark' | 'auto') => {
        set({ theme: theme });
      },

      // Accessibility Actions
      setHighContrast: (enabled: boolean) => {
        set({ highContrast: enabled });
      },

      setFontSize: (size: 'small' | 'medium' | 'large') => {
        set({ fontSize: size });
      },

      // Reset all settings to defaults
      resetSettings: () => {
        set(defaultSettings);
      },

      // Export settings as JSON string
      exportSettings: () => {
        const state = useSettingsStore.getState();
        const settings: AppSettings = {
          aiDifficulty: state.aiDifficulty,
          enableSounds: state.enableSounds,
          enableAnimations: state.enableAnimations,
          animationSpeed: state.animationSpeed,
          showTips: state.showTips,
          autoAdvanceTutorial: state.autoAdvanceTutorial,
          cardSize: state.cardSize,
          theme: state.theme,
          highContrast: state.highContrast,
          fontSize: state.fontSize,
        };
        return JSON.stringify(settings, null, 2);
      },

      // Import settings from JSON string
      importSettings: (settingsJson: string) => {
        try {
          const settings: AppSettings = JSON.parse(settingsJson);
          set(settings);
        } catch (error) {
          console.error('Failed to import settings:', error);
        }
      },
    }),
    {
      name: 'app-settings', // Storage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
