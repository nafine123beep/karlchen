/**
 * Hint Utilities - Helper functions for hint detection
 */

import { Card } from '@/engine/models/Card';
import { Trick } from '@/engine/models/Trick';
import { Suit } from '@/types/card.types';
import { Team } from '@/types/game.types';
import { HintContext } from '@/types/hint.types';

// German suit names
export const SUIT_NAMES_DE: Record<Suit, string> = {
  [Suit.CLUBS]: 'Kreuz',
  [Suit.SPADES]: 'Pik',
  [Suit.HEARTS]: 'Herz',
  [Suit.DIAMONDS]: 'Karo',
};

/**
 * Get the currently winning card in a trick
 */
export function getCurrentWinningCard(trick: Trick): Card | null {
  const cards = trick.getCards();
  if (cards.length === 0) return null;

  const leadCard = trick.getLeadCard();
  if (!leadCard) return null;

  const leadSuit = trick.getLeadSuit();

  // Find highest card following Doppelkopf rules
  let winningCard = leadCard;

  for (const playedCard of cards) {
    if (playedCard.card.id === leadCard.id) continue;

    if (beats(playedCard.card, winningCard, leadSuit)) {
      winningCard = playedCard.card;
    }
  }

  return winningCard;
}

/**
 * Get the player ID who is currently winning the trick
 */
export function getCurrentWinningPlayer(trick: Trick): string | null {
  const winningCard = getCurrentWinningCard(trick);
  if (!winningCard) return null;

  const cards = trick.getCards();
  const winningPlay = cards.find(pc => pc.card.id === winningCard.id);

  return winningPlay?.playerId || null;
}

/**
 * Check if card can beat winningCard
 */
export function canBeat(card: Card, winningCard: Card, leadSuit?: Suit | null): boolean {
  return beats(card, winningCard, leadSuit);
}

/**
 * Determine if card1 beats card2 following Doppelkopf rules
 */
function beats(card1: Card, card2: Card, leadSuit?: Suit | null): boolean {
  // Both trump: compare trump order (lower order = stronger)
  if (card1.isTrump && card2.isTrump) {
    const order1 = card1.trumpOrder ?? 99;
    const order2 = card2.trumpOrder ?? 99;
    return order1 < order2;
  }

  // Trump beats non-trump
  if (card1.isTrump && !card2.isTrump) return true;
  if (!card1.isTrump && card2.isTrump) return false;

  // Both non-trump: must be same suit and higher rank
  if (card1.suit !== card2.suit) return false;

  // Compare rank values (A=11, 10=10, K=4, Q=3, J=2, 9=0)
  return card1.value > card2.value;
}

/**
 * Check if playerId is on the same team as playerTeam
 * Note: This only works reliably after team announcements
 */
export function isTeammate(
  playerId: string,
  playerTeam: Team,
  context: HintContext
): boolean {
  // Can only reliably determine teammates after announcements
  const { announcements } = context;

  // If no announcements yet, can't determine teams
  if (!announcements.re && !announcements.kontra) {
    return false; // Conservative: assume not teammate if unknown
  }

  // This is a simplification - in real game would need to track which player announced which team
  // For hint purposes, being conservative is better than revealing hidden information
  return false;
}

/**
 * Get required suit for current trick (if any)
 */
export function getRequiredSuit(trick: Trick): Suit | 'trump' | null {
  if (trick.getCards().length === 0) return null;

  const leadCard = trick.getLeadCard();
  if (!leadCard) return null;

  if (leadCard.isTrump) {
    return 'trump';
  }

  return leadCard.suit;
}
