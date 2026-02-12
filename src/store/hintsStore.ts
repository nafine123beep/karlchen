/**
 * Hints Store - Tracks hint suppression per game session
 * Non-persisted, resets on new game
 *
 * Enhancement: Added anti-spam controls for Learning Mode
 * - Per-game mute option
 * - Per-turn tactic hint limit
 * - Per-trick feedback hint limit
 * - 3-second cooldown between hints
 */

import { create } from 'zustand';
import { HintId } from '@/types/hint.types';

const HINT_COOLDOWN_MS = 3000; // 3 seconds

interface HintsStore {
  // Existing state
  shownHintsThisGame: Set<HintId>;
  hintsShownThisTrick: number;
  totalHintsShown: number;
  currentTrickIndex: number;

  // NEW: Enhanced anti-spam state
  hintsMuted: boolean;
  preMoveTacticsShownThisTurn: boolean;
  feedbackShownThisTrick: boolean;
  lastHintTimestamp: number | null;

  // Existing actions
  recordHintShown: (hintId: HintId) => void;
  canShowHint: (hintId: HintId, isRuleViolation: boolean) => boolean;
  onTrickComplete: () => void;
  resetForNewGame: () => void;
  hasShownHintType: (hintId: HintId) => boolean;

  // NEW: Enhanced anti-spam actions
  muteHints: () => void;
  unmuteHints: () => void;
  recordPreMoveTacticShown: () => void;
  recordFeedbackShown: () => void;
  onPlayerTurnStart: () => void;
  canShowPreMoveTactic: () => boolean;
  canShowFeedback: () => boolean;
}

export const useHintsStore = create<HintsStore>((set, get) => ({
  // Initial state
  shownHintsThisGame: new Set(),
  hintsShownThisTrick: 0,
  totalHintsShown: 0,
  currentTrickIndex: 0,

  // NEW: Enhanced anti-spam state
  hintsMuted: false,
  preMoveTacticsShownThisTurn: false,
  feedbackShownThisTrick: false,
  lastHintTimestamp: null,

  // Record that a hint was shown
  recordHintShown: (hintId: HintId) => {
    set(state => ({
      shownHintsThisGame: new Set(state.shownHintsThisGame).add(hintId),
      hintsShownThisTrick: state.hintsShownThisTrick + 1,
      totalHintsShown: state.totalHintsShown + 1,
      lastHintTimestamp: Date.now(), // NEW: Track timestamp for cooldown
    }));
  },

  // Check if hint can be shown based on suppression rules
  canShowHint: (hintId: HintId, isRuleViolation: boolean) => {
    const state = get();

    // Rule violations (FOLLOW_SUIT_OR_TRUMP) always allowed - educational priority
    if (isRuleViolation) return true;

    // NEW: Check if muted (except rule violations)
    if (state.hintsMuted) return false;

    // NEW: Check cooldown (3 seconds between hints)
    if (state.lastHintTimestamp && Date.now() - state.lastHintTimestamp < HINT_COOLDOWN_MS) {
      return false;
    }

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
      feedbackShownThisTrick: false, // NEW: Reset feedback flag
    }));
  },

  // Reset all state for new game
  resetForNewGame: () => {
    set({
      shownHintsThisGame: new Set(),
      hintsShownThisTrick: 0,
      totalHintsShown: 0,
      currentTrickIndex: 0,
      hintsMuted: false, // NEW: Unmute on new game
      preMoveTacticsShownThisTurn: false,
      feedbackShownThisTrick: false,
      lastHintTimestamp: null,
    });
  },

  // Check if hint type has been shown
  hasShownHintType: (hintId: HintId) => {
    return get().shownHintsThisGame.has(hintId);
  },

  // NEW: Mute hints for current game
  muteHints: () => {
    set({ hintsMuted: true });
  },

  // NEW: Unmute hints (called on new game)
  unmuteHints: () => {
    set({ hintsMuted: false });
  },

  // NEW: Record pre-move tactic shown
  recordPreMoveTacticShown: () => {
    set({ preMoveTacticsShownThisTurn: true });
  },

  // NEW: Record feedback shown
  recordFeedbackShown: () => {
    set({ feedbackShownThisTrick: true });
  },

  // NEW: Reset turn-level counters when player's turn starts
  onPlayerTurnStart: () => {
    set({ preMoveTacticsShownThisTurn: false });
  },

  // NEW: Check if pre-move tactic can be shown
  canShowPreMoveTactic: () => {
    const state = get();

    // Check if muted
    if (state.hintsMuted) return false;

    // Check if already shown this turn
    if (state.preMoveTacticsShownThisTurn) return false;

    // Check cooldown
    if (state.lastHintTimestamp && Date.now() - state.lastHintTimestamp < HINT_COOLDOWN_MS) {
      return false;
    }

    // Check total hints limit
    if (state.totalHintsShown >= 8) return false;

    return true;
  },

  // NEW: Check if feedback can be shown
  canShowFeedback: () => {
    const state = get();

    // Check if muted
    if (state.hintsMuted) return false;

    // Check if already shown this trick
    if (state.feedbackShownThisTrick) return false;

    // Check cooldown
    if (state.lastHintTimestamp && Date.now() - state.lastHintTimestamp < HINT_COOLDOWN_MS) {
      return false;
    }

    // Check total hints limit
    if (state.totalHintsShown >= 8) return false;

    return true;
  },
}));
