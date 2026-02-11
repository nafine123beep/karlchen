/**
 * SAVE_HIGH_TRUMPS Trigger
 * Info when using very high trump when lower trump would also win
 */

import { Hint, HintContext } from '@/types/hint.types';
import { getCurrentWinningCard } from '../utils';

export function checkSaveHighTrumps(context: HintContext): Hint | null {
  const { selectedCard, currentTrick, playerHand } = context;

  // Only for trump cards
  if (!selectedCard.isTrump) return null;

  // Only if not leading (trick has cards)
  if (currentTrick.getCards().length === 0) return null;

  // Is this a very high trump? (order < 6 = Queens/Jacks)
  const cardTrumpOrder = selectedCard.trumpOrder ?? 99;
  if (cardTrumpOrder >= 6) return null;

  // Get currently winning card
  const winningCard = getCurrentWinningCard(currentTrick);
  if (!winningCard) return null;

  // Would a lower trump also win?
  const lowerTrumpsThatWin = playerHand.filter(c => {
    if (!c.isTrump) return false;
    if (c.id === selectedCard.id) return false;

    const cTrumpOrder = c.trumpOrder ?? 99;

    // Lower means higher order number
    if (cTrumpOrder <= cardTrumpOrder) return false;

    // Would this card beat the current winner?
    if (winningCard.isTrump) {
      const winningOrder = winningCard.trumpOrder ?? 99;
      return cTrumpOrder < winningOrder;
    }

    // Winning card is not trump, any trump beats it
    return true;
  });

  if (lowerTrumpsThatWin.length === 0) return null;

  return {
    id: 'SAVE_HIGH_TRUMPS',
    title: 'Hohen Trumpf sparen?',
    message: 'Du könntest diesen Stich auch mit einem niedrigeren Trumpf gewinnen. Spare hohe Trümpfe für wichtigere Stiche.',
    severity: 'info',
    learnMoreKey: 'tutorial.strategy.trumps',
  };
}
