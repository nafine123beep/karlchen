/**
 * FEEDBACK_GOOD_SCHMIEREN Trigger
 * Positive feedback: player successfully schmierened high points to teammate
 */

import { Hint } from '@/types/hint.types';
import { Trick } from '@/engine/models/Trick';

export function checkGoodSchmieren(
  completedTrick: Trick,
  humanPlayerId: string
): Hint | null {
  const playerCard = completedTrick.getCardByPlayer(humanPlayerId);
  if (!playerCard) return null;

  // Check if player schmierened (not leading, not winning)
  const leadCard = completedTrick.getLeadCard();
  if (!leadCard || leadCard.id === playerCard.id) return null;
  if (completedTrick.winnerId === humanPlayerId) return null;

  // Check if player added high points (10+ points)
  const cardPoints = playerCard.value;
  if (cardPoints < 10) return null;

  return {
    id: 'FEEDBACK_GOOD_SCHMIEREN',
    title: 'Gut geschmiert!',
    message: 'Du hast erfolgreich Augen in diesen Stich geschmiert. Das ist eine wichtige Teamstrategie, um wertvolle Punkte zu sichern.',
    severity: 'info',
    timing: 'feedback',
    learnMoreKey: 'tutorial.tactics.schmieren',
  };
}
