/**
 * Hint Engine - Main entry point for hint detection
 */

import { Hint, HintContext } from '@/types/hint.types';
import { useHintsStore } from '@/store/hintsStore';
import { checkTrumpBeatsSuit } from './triggers/trumpBeatsSuit';
import { checkSaveHighTrumps } from './triggers/saveHighTrumps';
import { checkFoxProtection } from './triggers/foxProtection';
import { checkEyesManagement } from './triggers/eyesManagement';
import { checkSchmieren } from './triggers/schmieren';
import { checkKarlchenLateGame } from './triggers/karlchenLateGame';

/**
 * Get hint for current game context
 * Returns first applicable hint that passes suppression checks
 */
export function getHint(context: HintContext): Hint | null {
  const hintsStore = useHintsStore.getState();

  // Check each trigger in priority order
  // Rule violations first, then strategic hints
  // Note: FOLLOW_SUIT_OR_TRUMP is handled directly in GameScreen
  // (before validation, in the illegal move path)
  const triggers = [
    checkTrumpBeatsSuit,          // Common beginner mistake
    checkSaveHighTrumps,          // Trump strategy
    checkFoxProtection,           // Special card protection
    checkEyesManagement,          // Point management
    checkSchmieren,               // Team strategy (rare due to conservative teammate check)
    checkKarlchenLateGame,        // Endgame bonus
  ];

  for (const trigger of triggers) {
    try {
      const hint = trigger(context);
      if (__DEV__) {
        console.log(`[Hints] ${trigger.name}: ${hint ? hint.id : 'null'}`);
      }
      if (hint) {
        // Check suppression
        const isRuleViolation = hint.id === 'FOLLOW_SUIT_OR_TRUMP';
        const canShow = hintsStore.canShowHint(hint.id, isRuleViolation);
        if (__DEV__) {
          console.log(`[Hints] canShowHint(${hint.id}): ${canShow}`);
        }
        if (canShow) {
          hintsStore.recordHintShown(hint.id);
          return hint;
        }
      }
    } catch (e) {
      if (__DEV__) {
        console.warn(`[Hints] ${trigger.name} error:`, e);
      }
    }
  }

  return null;
}
