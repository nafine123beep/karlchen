/**
 * AI Strategies - Medium-level AI decision making for Doppelkopf
 *
 * Strategy Priority:
 * 1. Follow basic rules (Bedienen)
 * 2. Play high cards when leading
 * 3. Try to win tricks when partner is not winning
 * 4. Avoid wasting high trumps unnecessarily
 */

import { Card } from '@/engine/models/Card';
import { Player } from '@/engine/models/Player';
import { Trick } from '@/engine/models/Trick';
import { GameState } from '@/engine/models/GameState';
import { getLegalMoves, getWinningMoves } from '@/engine/logic/legalMoves';
import { getCurrentWinningPlayer } from '@/engine/logic/trickLogic';
import { getPartner, areTeammates } from '@/engine/logic/teamLogic';

/**
 * Select a card to play using medium-level strategy
 * TODO: Implement AI decision logic
 */
export function selectCardToPlay(player: Player, gameState: GameState): Card | null {
  // TODO: Implement AI card selection
  const legalMoves = getLegalMoves(player, gameState.currentTrick);

  if (legalMoves.length === 0) return null;
  if (legalMoves.length === 1) return legalMoves[0];

  // Different strategies based on trick position
  const trickSize = gameState.currentTrick.size;

  if (trickSize === 0) {
    // Leading the trick
    return selectLeadCard(player, gameState, legalMoves);
  } else {
    // Following in the trick
    return selectFollowCard(player, gameState, legalMoves);
  }
}

/**
 * Select card when leading a trick
 * Strategy: Play high trump or high non-trump to win
 */
function selectLeadCard(player: Player, gameState: GameState, legalMoves: Card[]): Card {
  // TODO: Implement lead card selection
  // Prefer high trump cards
  const trumpCards = legalMoves.filter(card => card.isTrump);
  if (trumpCards.length > 0) {
    return selectHighestCard(trumpCards);
  }

  // Otherwise, play high non-trump
  return selectHighestCard(legalMoves);
}

/**
 * Select card when following in a trick
 * Strategy: Win if possible, otherwise play low
 */
function selectFollowCard(player: Player, gameState: GameState, legalMoves: Card[]): Card {
  // TODO: Implement follow card selection
  const currentWinner = getCurrentWinningPlayer(gameState.currentTrick);
  const partner = getPartner(player, gameState);

  // Check if partner is winning
  const partnerIsWinning = partner && currentWinner === partner.id;

  if (partnerIsWinning) {
    // Partner winning: play low card to save high cards
    return selectLowestCard(legalMoves);
  } else {
    // Try to win the trick
    const winningMoves = getWinningMoves(player, gameState.currentTrick);
    if (winningMoves.length > 0) {
      // Win with lowest possible card
      return selectLowestCard(winningMoves);
    } else {
      // Can't win: play lowest card
      return selectLowestCard(legalMoves);
    }
  }
}

/**
 * Select highest value card from options
 */
function selectHighestCard(cards: Card[]): Card {
  // TODO: Implement highest card selection
  if (cards.length === 0) throw new Error('No cards to select from');

  // For trump cards, use trump order (lower = higher)
  const trumpCards = cards.filter(c => c.isTrump);
  if (trumpCards.length > 0) {
    return trumpCards.reduce((highest, card) => {
      const highestOrder = highest.trumpOrder ?? 999;
      const cardOrder = card.trumpOrder ?? 999;
      return cardOrder < highestOrder ? card : highest;
    });
  }

  // For non-trump, use card value
  return cards.reduce((highest, card) => (card.value > highest.value ? card : highest));
}

/**
 * Select lowest value card from options
 */
function selectLowestCard(cards: Card[]): Card {
  // TODO: Implement lowest card selection
  if (cards.length === 0) throw new Error('No cards to select from');

  // For trump cards, use trump order (higher = lower)
  const trumpCards = cards.filter(c => c.isTrump);
  if (trumpCards.length > 0) {
    return trumpCards.reduce((lowest, card) => {
      const lowestOrder = lowest.trumpOrder ?? -1;
      const cardOrder = card.trumpOrder ?? -1;
      return cardOrder > lowestOrder ? card : lowest;
    });
  }

  // For non-trump, use card value
  return cards.reduce((lowest, card) => (card.value < lowest.value ? card : lowest));
}

/**
 * Evaluate card strength (0-100)
 * Higher is better
 */
export function evaluateCardStrength(card: Card): number {
  // TODO: Implement card strength evaluation
  if (card.isTrump) {
    // Trump cards: lower order = higher strength
    const trumpOrder = card.trumpOrder ?? 99;
    return 100 - trumpOrder * 3;
  }

  // Non-trump: based on value
  return card.value * 5;
}

/**
 * Check if we should announce Re/Kontra
 * TODO: Basic strategy - announce if we have strong hand
 */
export function shouldAnnounce(player: Player, gameState: GameState): boolean {
  // TODO: Implement announcement decision
  // Count trump cards and high value cards
  const trumpCount = player.getTrumpCards().length;
  const highValueCards = player.hand.filter(card => card.value >= 10).length;

  // Announce if we have strong hand (6+ trumps or 5+ high cards)
  return trumpCount >= 6 || highValueCards >= 5;
}

/**
 * Simple random selection (fallback)
 */
export function selectRandomCard(cards: Card[]): Card {
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
}
