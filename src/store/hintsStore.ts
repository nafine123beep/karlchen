/**
 * Hints Store - Tracks hint suppression per game session
 * Non-persisted, resets on new game
 */

import { create } from 'zustand';
import { HintId } from '@/types/hint.types';

interface HintsStore {
  // State
  shownHintsThisGame: Set<HintId>;
  hintsShownThisTrick: number;
  totalHintsShown: number;
  currentTrickIndex: number;

  // Actions
  recordHintShown: (hintId: HintId) => void;
  canShowHint: (hintId: HintId, isRuleViolation: boolean) => boolean;
  onTrickComplete: () => void;
  resetForNewGame: () => void;
  hasShownHintType: (hintId: HintId) => boolean;
}

export const useHintsStore = create<HintsStore>((set, get) => ({
  // Initial state
  shownHintsThisGame: new Set(),
  hintsShownThisTrick: 0,
  totalHintsShown: 0,
  currentTrickIndex: 0,

  // Record that a hint was shown
  recordHintShown: (hintId: HintId) => {
    set(state => ({
      shownHintsThisGame: new Set(state.shownHintsThisGame).add(hintId),
      hintsShownThisTrick: state.hintsShownThisTrick + 1,
      totalHintsShown: state.totalHintsShown + 1,
    }));
  },

  // Check if hint can be shown based on suppression rules
  canShowHint: (hintId: HintId, isRuleViolation: boolean) => {
    const state = get();

    // Rule violations (FOLLOW_SUIT_OR_TRUMP) always allowed - educational priority
    if (isRuleViolation) return true;

    // Max 8 hints per game total
    if (state.totalHintsShown >= 8) return false;

    // Max 1 hint per trick (rule violations exempt)
    if (state.hintsShownThisTrick >= 1) return false;

    // Don't repeat same hint type (except rule violations)
    if (state.shownHintsThisGame.has(hintId)) return false;

    return true;
  },

  // Reset trick counter when trick completes
  onTrickComplete: () => {
    set(state => ({
      hintsShownThisTrick: 0,
      currentTrickIndex: state.currentTrickIndex + 1,
    }));
  },

  // Reset all state for new game
  resetForNewGame: () => {
    set({
      shownHintsThisGame: new Set(),
      hintsShownThisTrick: 0,
      totalHintsShown: 0,
      currentTrickIndex: 0,
    });
  },

  // Check if hint type has been shown
  hasShownHintType: (hintId: HintId) => {
    return get().shownHintsThisGame.has(hintId);
  },
}));
