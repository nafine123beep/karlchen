/**
 * Feedback Hint Engine - Post-trick hint orchestrator for Learning Mode
 *
 * Analyzes completed tricks and returns educational feedback hints.
 * Separate from HintEngine because:
 * - Different timing (post-trick vs pre-move)
 * - Different context (completed tricks vs current game state)
 * - Different suppression rules (per-trick vs per-turn limits)
 */

import { Hint } from '@/types/hint.types';
import { Trick } from '@/engine/models/Trick';
import { useHintsStore } from '@/store/hintsStore';
import { checkLostHighTrump, checkFoxCaught, checkGoodSchmieren } from './triggers/feedback';

export interface FeedbackContext {
  completedTrick: Trick;
  humanPlayerId: string;
  trickIndex: number;
}

/**
 * Get feedback hint for completed trick
 * Returns first applicable feedback hint that passes suppression checks
 */
export function getFeedbackHint(context: FeedbackContext): Hint | null {
  const hintsStore = useHintsStore.getState();

  // Check if feedback can be shown
  if (!hintsStore.canShowFeedback()) {
    return null;
  }

  // Check triggers in priority order (negative feedback first, then positive)
  const triggers = [
    (ctx: FeedbackContext) => checkFoxCaught(ctx.completedTrick, ctx.humanPlayerId),
    (ctx: FeedbackContext) => checkLostHighTrump(ctx.completedTrick, ctx.humanPlayerId),
    (ctx: FeedbackContext) => checkGoodSchmieren(ctx.completedTrick, ctx.humanPlayerId),
  ];

  for (const trigger of triggers) {
    try {
      const hint = trigger(context);
      if (hint) {
        hintsStore.recordFeedbackShown();
        hintsStore.recordHintShown(hint.id);
        return hint;
      }
    } catch (e) {
      if (__DEV__) {
        console.warn(`[FeedbackHints] Trigger error:`, e);
      }
    }
  }

  return null;
}
