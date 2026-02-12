/**
 * Hint System Type Definitions
 *
 * Enhancement: Added timing classification for Learning Mode
 * - 'rule': Blocking rule violation hints
 * - 'preTactic': Non-blocking pre-move strategic suggestions
 * - 'feedback': Non-blocking post-trick explanations
 */

import { Card } from '@/engine/models/Card';
import { Trick } from '@/engine/models/Trick';
import { Team } from '@/types/game.types';

/**
 * Hint timing classification
 */
export type HintTiming = 'rule' | 'preTactic' | 'feedback';

/**
 * Hint identifiers
 */
export type HintId =
  // Rule hints (blocking)
  | 'FOLLOW_SUIT_OR_TRUMP'

  // Tactic hints (non-blocking, pre-move)
  | 'TRUMP_BEATS_SUIT'
  | 'SAVE_HIGH_TRUMPS'
  | 'FOX_PROTECTION'
  | 'EYES_MANAGEMENT'
  | 'SCHMIEREN'
  | 'KARLCHEN_LATE_GAME'

  // Feedback hints (non-blocking, post-trick)
  | 'FEEDBACK_LOST_HIGH_TRUMP'
  | 'FEEDBACK_FOX_CAUGHT'
  | 'FEEDBACK_GOOD_SCHMIEREN'
  | 'FEEDBACK_MISSED_WIN'
  | 'FEEDBACK_GOOD_FOX_PROTECTION';

/**
 * Hint object
 */
export interface Hint {
  id: HintId;
  title: string;           // German, short (e.g., "Bedienpflicht beachten!")
  message: string;         // German, detailed explanation (1-2 sentences)
  severity: 'info' | 'warn';
  learnMoreKey?: string;   // Optional tutorial reference
  timing: HintTiming;      // NEW: When hint is shown (rule/preTactic/feedback)
}

export interface HintContext {
  selectedCard: Card;
  playerHand: Card[];
  currentTrick: Trick;
  legalMoves: Card[];
  completedTricks: Trick[];
  trickIndex: number;
  playerTeam: Team;
  announcements: { re: boolean; kontra: boolean };
}
