/**
 * FEEDBACK_LOST_HIGH_TRUMP Trigger
 * Feedback: player unnecessarily lost a high trump
 */

import { Hint } from '@/types/hint.types';
import { Trick } from '@/engine/models/Trick';
import { Rank } from '@/types/card.types';

export function checkLostHighTrump(
  completedTrick: Trick,
  humanPlayerId: string
): Hint | null {
  const playerCard = completedTrick.getCardByPlayer(humanPlayerId);
  if (!playerCard) return null;

  // Check if player played high trump (10, Ace)
  if (!playerCard.isTrump) return null;
  if (![Rank.TEN, Rank.ACE].includes(playerCard.rank)) return null;

  // Check if player was leading and lost
  const leadCard = completedTrick.getLeadCard();
  if (leadCard?.id !== playerCard.id) return null;

  const winnerId = completedTrick.winnerId;
  if (!winnerId || winnerId === humanPlayerId) return null;

  return {
    id: 'FEEDBACK_LOST_HIGH_TRUMP',
    title: 'Hohen Trumpf verloren',
    message: 'Du hast einen wertvollen hohen Trumpf in diesem Stich verloren. Manchmal ist es besser, niedrigere Trumpfkarten zu spielen und die hohen für später aufzusparen.',
    severity: 'info',
    timing: 'feedback',
    learnMoreKey: 'tutorial.trump.conservation',
  };
}
