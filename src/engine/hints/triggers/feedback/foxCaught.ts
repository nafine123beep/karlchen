/**
 * FEEDBACK_FOX_CAUGHT Trigger
 * Feedback: player's fox (Ace of Diamonds) was caught by opponent
 */

import { Hint } from '@/types/hint.types';
import { Trick } from '@/engine/models/Trick';
import { Suit, Rank } from '@/types/card.types';

export function checkFoxCaught(
  completedTrick: Trick,
  humanPlayerId: string
): Hint | null {
  const playerCard = completedTrick.getCardByPlayer(humanPlayerId);
  if (!playerCard) return null;

  // Check if player played Fox (Ace of Diamonds)
  const isFox = playerCard.suit === Suit.DIAMONDS && playerCard.rank === Rank.ACE;
  if (!isFox) return null;

  // Check if trick was lost
  if (completedTrick.winnerId === humanPlayerId) return null;

  return {
    id: 'FEEDBACK_FOX_CAUGHT',
    title: 'Fuchs gefangen!',
    message: 'Dein Fuchs (Karo-Ass) wurde vom Gegner gefangen. Der Fuchs ist 11 Augen wert und gibt dem Gegner einen Extrapunkt. Versuche, ihn besser zu schützen oder rechtzeitig abzuwerfen.',
    severity: 'warn',
    timing: 'feedback',
    learnMoreKey: 'tutorial.special.fox',
  };
}
