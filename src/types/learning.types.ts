/**
 * Learning and tutorial type definitions
 */

import { ICard } from './card.types';

// Tutorial Step Enum (for lesson progression)
export enum TutorialStep {
  INTRODUCTION = 'introduction',
  CARD_RANKS = 'card_ranks',
  TRUMP_CARDS = 'trump_cards',
  TEAMS = 'teams',
  TRICKS = 'tricks',
  SCORING = 'scoring',
  FIRST_GAME = 'first_game',
}

// Tip Category Enum (for categorizing explanations)
export enum TipCategory {
  Trump = 'trump',
  TeamPlay = 'teamplay',
  Scoring = 'scoring',
  Strategy = 'strategy',
  Rules = 'rules',
}

// Tutorial Progress tracking
export interface TutorialProgress {
  completedSteps: TutorialStep[];
  currentStep: TutorialStep;
  isCompleted: boolean;
}

// Learning Statistics
export interface LearningStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  totalTricksTaken: number;
  totalPoints: number;
  averageScore: number;
  bestScore: number;
  achievements: Achievement[];
}

// Achievement definition
export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: Date;
  isUnlocked: boolean;
}

// Tutorial Schritt
export interface ITutorialStep {
  id: string;
  title: string;
  description: string;
  targetCards?: ICard[];  // Welche Karten sollen highlighted werden?
  correctAction?: string; // Was ist der richtige Zug?
  explanation?: string;   // Erklärung nach dem Zug
}

// Lern-Fortschritt
export interface ILearningProgress {
  completedLessons: string[];
  currentLesson: string | null;
  mistakeCount: number;
  tipsUsed: number;
  gamesPlayed: number;
  winRate: number;
}

// Tip/Suggestion
export interface ITip {
  cardId: string;
  title: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

// Explanation Types
export interface IExplanation {
  id: string;
  title: string;
  shortText: string;
  detailedText: string;
  examples?: string[];
}
