/**
 * FOX_PROTECTION Trigger
 * Warns when playing Diamond Ace (Fox) when unlikely to win
 */

import { Suit, Rank } from '@/types/card.types';
import { Hint, HintContext } from '@/types/hint.types';
import { getCurrentWinningCard, canBeat } from '../utils';

export function checkFoxProtection(context: HintContext): Hint | null {
  const { selectedCard, currentTrick } = context;

  // Is this a Fox (Diamond Ace)?
  const isFox = selectedCard.suit === Suit.DIAMONDS && selectedCard.rank === Rank.ACE;
  if (!isFox) return null;

  // If leading, no warning (can lead fox strategically)
  if (currentTrick.getCards().length === 0) return null;

  // Check if trick is likely lost
  const winningCard = getCurrentWinningCard(currentTrick);
  if (!winningCard) return null;

  // Can selected fox beat winning card?
  const leadSuit = currentTrick.getLeadSuit();
  const foxCanWin = canBeat(selectedCard, winningCard, leadSuit);

  if (foxCanWin) return null; // Fox will win, no warning

  return {
    id: 'FOX_PROTECTION',
    title: 'Fuchs in Gefahr!',
    message: 'Der Karo-Ass (Fuchs) bringt Extrapunkte für die Gegner, wenn sie ihn fangen. Versuche ihn zu schützen oder nur in Stichen zu spielen, die du gewinnst.',
    severity: 'warn',
    learnMoreKey: 'tutorial.special.fox',
  };
}
