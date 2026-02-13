/**
 * EYES_MANAGEMENT Trigger
 * Info when discarding high-value card (10, Ace) in losing trick
 */

import { Hint, HintContext } from '@/types/hint.types';
import { getCurrentWinningCard, canBeat } from '../utils';

export function checkEyesManagement(context: HintContext): Hint | null {
  const { selectedCard, currentTrick, legalMoves } = context;

  // Only if trick has cards (not leading)
  if (currentTrick.getCards().length === 0) return null;

  // Is card high-value? (10 or Ace = 10+ points)
  const isHighValue = selectedCard.value >= 10;
  if (!isHighValue) return null;

  // Get currently winning card
  const winningCard = getCurrentWinningCard(currentTrick);
  if (!winningCard) return null;

  // Can player win this trick with any legal move?
  const leadSuit = currentTrick.getLeadSuit();
  const canWinTrick = legalMoves.some(card =>
    canBeat(card, winningCard, leadSuit)
  );

  if (canWinTrick) return null; // Player can win, no hint

  // Is this the only legal move?
  if (legalMoves.length === 1) return null; // Forced play, no choice

  // Has lower-value legal alternative?
  const hasLowerOption = legalMoves.some(c => c.value < selectedCard.value);
  if (!hasLowerOption) return null;

  return {
    id: 'EYES_MANAGEMENT',
    title: 'Augen abwerfen?',
    message: 'Du wirfst eine wertvolle Karte (10 oder Ass) in einen Stich ab, den du nicht gewinnst. Überlege, ob du eine niedrigere Karte spielen kannst.',
    severity: 'info',
    timing: 'preTactic',
  };
}
