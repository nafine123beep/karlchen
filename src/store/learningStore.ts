/**
 * Learning Store - Zustand store for tutorial progress and stats
 */

import { create } from 'zustand';
import { TutorialStep, TutorialProgress, LearningStats, Achievement } from '@/types/learning.types';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LearningStore {
  // State
  tutorialProgress: TutorialProgress;
  stats: LearningStats;
  showTips: boolean;

  // Actions
  completeTutorialStep: (step: TutorialStep) => void;
  setCurrentTutorialStep: (step: TutorialStep) => void;
  resetTutorial: () => void;

  updateStats: (gameResult: {
    won: boolean;
    tricksTaken: number;
    points: number;
  }) => void;
  unlockAchievement: (achievementId: string) => void;

  setShowTips: (show: boolean) => void;

  // Getters
  getTutorialProgress: () => number; // 0-100
  isAchievementUnlocked: (achievementId: string) => boolean;

  // Internal
  checkAchievements: () => void;
}

const initialStats: LearningStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  totalTricksTaken: 0,
  totalPoints: 0,
  averageScore: 0,
  bestScore: 0,
  achievements: [],
};

const initialTutorialProgress: TutorialProgress = {
  completedSteps: [],
  currentStep: TutorialStep.INTRODUCTION,
  isCompleted: false,
};

export const useLearningStore = create<LearningStore>()(
  persist(
    (set, get) => ({
      // Initial State
      tutorialProgress: initialTutorialProgress,
      stats: initialStats,
      showTips: true,

      // Complete tutorial step
      completeTutorialStep: (step: TutorialStep) => {
        // TODO: Mark step as completed
        set(state => {
          const completedSteps = [...state.tutorialProgress.completedSteps];
          if (!completedSteps.includes(step)) {
            completedSteps.push(step);
          }

          const allSteps = Object.values(TutorialStep);
          const isCompleted = completedSteps.length === allSteps.length;

          return {
            tutorialProgress: {
              ...state.tutorialProgress,
              completedSteps,
              isCompleted,
            },
          };
        });
      },

      // Set current tutorial step
      setCurrentTutorialStep: (step: TutorialStep) => {
        set(state => ({
          tutorialProgress: {
            ...state.tutorialProgress,
            currentStep: step,
          },
        }));
      },

      // Reset tutorial
      resetTutorial: () => {
        set({
          tutorialProgress: initialTutorialProgress,
        });
      },

      // Update game stats
      updateStats: (gameResult: { won: boolean; tricksTaken: number; points: number }) => {
        // TODO: Update statistics
        set(state => {
          const newStats = { ...state.stats };
          newStats.gamesPlayed += 1;

          if (gameResult.won) {
            newStats.gamesWon += 1;
          } else {
            newStats.gamesLost += 1;
          }

          newStats.totalTricksTaken += gameResult.tricksTaken;
          newStats.totalPoints += gameResult.points;
          newStats.averageScore = newStats.totalPoints / newStats.gamesPlayed;

          if (gameResult.points > newStats.bestScore) {
            newStats.bestScore = gameResult.points;
          }

          return { stats: newStats };
        });

        // Check for achievements
        get().checkAchievements();
      },

      // Unlock achievement
      unlockAchievement: (achievementId: string) => {
        set(state => {
          const achievements = [...state.stats.achievements];
          const achievement = achievements.find(a => a.id === achievementId);

          if (achievement && !achievement.isUnlocked) {
            achievement.isUnlocked = true;
            achievement.unlockedAt = new Date();
          }

          return {
            stats: {
              ...state.stats,
              achievements,
            },
          };
        });
      },

      // Set show tips
      setShowTips: (show: boolean) => {
        set({ showTips: show });
      },

      // Get tutorial progress percentage
      getTutorialProgress: () => {
        const { completedSteps } = get().tutorialProgress;
        const allSteps = Object.values(TutorialStep);
        return Math.round((completedSteps.length / allSteps.length) * 100);
      },

      // Check if achievement is unlocked
      isAchievementUnlocked: (achievementId: string) => {
        const { achievements } = get().stats;
        const achievement = achievements.find(a => a.id === achievementId);
        return achievement?.isUnlocked ?? false;
      },

      // Private: Check for new achievements
      checkAchievements: () => {
        const { stats, unlockAchievement, isAchievementUnlocked } = get();

        // TODO: Implement achievement checks
        // First win
        if (stats.gamesWon >= 1 && !isAchievementUnlocked('first_win')) {
          unlockAchievement('first_win');
        }

        // 10 wins
        if (stats.gamesWon >= 10 && !isAchievementUnlocked('ten_wins')) {
          unlockAchievement('ten_wins');
        }

        // 50 wins
        if (stats.gamesWon >= 50 && !isAchievementUnlocked('fifty_wins')) {
          unlockAchievement('fifty_wins');
        }

        // Perfect game (240-0)
        if (stats.bestScore === 240 && !isAchievementUnlocked('perfect_game')) {
          unlockAchievement('perfect_game');
        }
      },
    }),
    {
      name: 'learning-storage', // Storage key
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist certain fields
      partialize: state => ({
        tutorialProgress: state.tutorialProgress,
        stats: state.stats,
        showTips: state.showTips,
      }),
    }
  )
);
