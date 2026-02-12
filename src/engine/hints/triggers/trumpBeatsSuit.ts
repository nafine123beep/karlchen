/**
 * TRUMP_BEATS_SUIT Trigger
 * Info when playing non-trump card while trump is already in trick
 */

import { Hint, HintContext } from '@/types/hint.types';
import { getCurrentWinningCard } from '../utils';

export function checkTrumpBeatsSuit(context: HintContext): Hint | null {
  const { selectedCard, currentTrick, playerHand } = context;

  // Only if trick has cards (not leading)
  if (currentTrick.getCards().length === 0) return null;

  // Player selected non-trump card
  if (selectedCard.isTrump) return null;

  // Check if any card in trick is trump
  const trickHasTrump = currentTrick.getCards().some(c => c.isTrump);
  if (!trickHasTrump) return null;

  // Check if current winning card is trump
  const winningCard = getCurrentWinningCard(currentTrick);
  if (!winningCard?.isTrump) return null;

  // Player has trump cards?
  const playerTrumps = playerHand.filter(c => c.isTrump);
  if (playerTrumps.length === 0) return null;

  return {
    id: 'TRUMP_BEATS_SUIT',
    title: 'Trumpf sticht immer!',
    message: 'Ein Gegner hat bereits Trumpf gespielt. Deine Nicht-Trumpf-Karte kann diesen Stich nicht gewinnen, auch wenn sie hoch ist.',
    severity: 'info',
    timing: 'preTactic',
    learnMoreKey: 'tutorial.trump.priority',
  };
}
