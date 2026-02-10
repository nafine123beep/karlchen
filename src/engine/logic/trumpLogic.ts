/**
 * Trump Logic - Determines trump cards and their ordering in Doppelkopf
 *
 * Standard Doppelkopf Trump Order (highest to lowest):
 * 1. 🃛 10 of Hearts (Dulle) - if playing with that rule
 * 2. Queens (Kreuz-Dame > Pik-Dame > Herz-Dame > Karo-Dame)
 * 3. Jacks (Kreuz-Bube > Pik-Bube > Herz-Bube > Karo-Bube)
 * 4. Diamonds (A > 10 > K > 9)
 */

import { Card } from '@/engine/models/Card';
import { Suit, Rank } from '@/types/card.types';

/**
 * Check if a card is trump
 * TODO: Implement Doppelkopf trump rules
 */
export function isTrump(card: Card, trumpSuit: Suit = Suit.DIAMONDS): boolean {
  // TODO: Implement trump detection
  // All Queens are trump
  if (card.rank === Rank.QUEEN) return true;

  // All Jacks are trump
  if (card.rank === Rank.JACK) return true;

  // All cards of trump suit (default: Diamonds)
  if (card.suit === trumpSuit) return true;

  // 10 of Hearts (Dulle) - optional rule
  // if (card.rank === Rank.TEN && card.suit === Suit.HEARTS) return true;

  return false;
}

/**
 * Get trump order for a card (lower number = higher priority)
 * TODO: Returns undefined if not trump
 */
export function getTrumpOrder(card: Card): number | undefined {
  // Determine order purely from suit/rank (no card.isTrump guard)
  // so this works both before and after initializeTrumpCards

  // Queens (order 0-3)
  if (card.rank === Rank.QUEEN) {
    const queenOrder: Record<Suit, number> = {
      [Suit.CLUBS]: 0,    // Highest Queen
      [Suit.SPADES]: 1,
      [Suit.HEARTS]: 2,
      [Suit.DIAMONDS]: 3, // Lowest Queen
    };
    return queenOrder[card.suit];
  }

  // Jacks (order 4-7)
  if (card.rank === Rank.JACK) {
    const jackOrder: Record<Suit, number> = {
      [Suit.CLUBS]: 4,    // Highest Jack
      [Suit.SPADES]: 5,
      [Suit.HEARTS]: 6,
      [Suit.DIAMONDS]: 7, // Lowest Jack
    };
    return jackOrder[card.suit];
  }

  // Diamonds (order 8-11) - Queens and Jacks are handled above
  if (card.suit === Suit.DIAMONDS) {
    const diamondOrder: Partial<Record<Rank, number>> = {
      [Rank.ACE]: 8,
      [Rank.TEN]: 9,
      [Rank.KING]: 10,
      [Rank.NINE]: 11,
    };
    return diamondOrder[card.rank];
  }

  return undefined;
}

/**
 * Compare two trump cards
 * TODO: Returns positive if card1 > card2, negative if card1 < card2
 */
export function compareTrumpCards(card1: Card, card2: Card): number {
  // TODO: Implement trump comparison
  const order1 = card1.trumpOrder ?? getTrumpOrder(card1);
  const order2 = card2.trumpOrder ?? getTrumpOrder(card2);

  if (order1 === undefined || order2 === undefined) {
    throw new Error('Cannot compare non-trump cards');
  }

  return order1 - order2; // Lower order = higher priority, so we need to reverse
}

/**
 * Initialize all trump cards in a deck
 * TODO: Call this after deck creation to set trump flags and ordering
 */
export function initializeTrumpCards(cards: Card[], trumpSuit: Suit = Suit.DIAMONDS): void {
  cards.forEach(card => {
    if (isTrump(card, trumpSuit)) {
      const order = getTrumpOrder(card);
      if (order !== undefined) {
        card.setTrump(order);
      }
    }
  });
}

/**
 * Get all trump cards from a set of cards
 */
export function filterTrumpCards(cards: Card[]): Card[] {
  return cards.filter(card => card.isTrump);
}

/**
 * Get all non-trump cards from a set of cards
 */
export function filterNonTrumpCards(cards: Card[]): Card[] {
  return cards.filter(card => !card.isTrump);
}

/**
 * Count total number of trump cards (should be 26 in standard Doppelkopf mit Neunen)
 * TODO: 8 Queens + 8 Jacks + 10 Diamonds = 26 trump cards
 */
export function countTrumpCards(cards: Card[]): number {
  return filterTrumpCards(cards).length;
}
