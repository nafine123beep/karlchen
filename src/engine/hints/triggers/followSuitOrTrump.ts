/**
 * FOLLOW_SUIT_OR_TRUMP Trigger
 * Warns when player attempts to play an illegal card (rule violation)
 */

import { Hint, HintContext } from '@/types/hint.types';
import { getRequiredSuit, SUIT_NAMES_DE } from '../utils';

export function checkFollowSuitOrTrump(context: HintContext): Hint | null {
  const { selectedCard, legalMoves, currentTrick } = context;

  // Is selected card NOT in legal moves?
  const isIllegal = !legalMoves.some(c => c.id === selectedCard.id);

  if (!isIllegal) return null;

  // Determine what suit/trump was required
  const requiredSuit = getRequiredSuit(currentTrick);

  if (requiredSuit === 'trump') {
    return {
      id: 'FOLLOW_SUIT_OR_TRUMP',
      title: 'Du musst Trumpf bedienen!',
      message: 'In Doppelkopf gilt Bedienzwang: Wenn Trumpf angespielt wurde und du noch Trumpfkarten hast, musst du eine davon spielen.',
      severity: 'warn',
      learnMoreKey: 'tutorial.rules.following',
      timing: 'rule',
    };
  } else if (requiredSuit) {
    const suitName = SUIT_NAMES_DE[requiredSuit];
    return {
      id: 'FOLLOW_SUIT_OR_TRUMP',
      title: `Du musst ${suitName} bedienen!`,
      message: `In Doppelkopf gilt Bedienzwang: Wenn ${suitName} angespielt wurde und du noch ${suitName}-Karten hast, musst du eine davon spielen.`,
      severity: 'warn',
      learnMoreKey: 'tutorial.rules.following',
      timing: 'rule',
    };
  }

  return null;
}
