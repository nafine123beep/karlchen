/**
 * SCHMIEREN Trigger
 * Info when partner is winning and player could add points
 */

import { Hint, HintContext } from '@/types/hint.types';
import { getCurrentWinningPlayer, isTeammate } from '../utils';

export function checkSchmieren(context: HintContext): Hint | null {
  const { selectedCard, currentTrick, playerTeam, legalMoves } = context;

  // Only if trick has 2 or 3 cards (player is 3rd or 4th)
  const trickSize = currentTrick.getCards().length;
  if (trickSize < 2) return null;

  // Who is currently winning?
  const winningPlayerId = getCurrentWinningPlayer(currentTrick);
  if (!winningPlayerId) return null;

  // Is winner on player's team? (Conservative check)
  const winnerIsPartner = isTeammate(winningPlayerId, playerTeam, context);

  // Note: Since isTeammate is conservative and usually returns false,
  // this hint may not trigger often unless announcements are made
  // This is intentional - better to avoid hinting than reveal hidden info
  if (!winnerIsPartner) return null;

  // Selected card is low-value?
  if (selectedCard.value >= 10) return null; // Already playing high value

  // Player has higher-value cards in legal moves?
  const higherValueOptions = legalMoves.filter(c => c.value > selectedCard.value);
  if (higherValueOptions.length === 0) return null;

  return {
    id: 'SCHMIEREN',
    title: 'Schmieren möglich!',
    message: 'Dein Partner gewinnt gerade diesen Stich. Du könntest "schmieren" - eine wertvolle Karte (10, Ass) hinzufügen, um mehr Punkte für euer Team zu holen.',
    severity: 'info',
    learnMoreKey: 'tutorial.strategy.schmieren',
    timing: 'preTactic',
  };
}
