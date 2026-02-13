/**
 * Trump Logic - Determines trump cards and their ordering in Doppelkopf
 *
 * Standard Doppelkopf Trump Order (highest to lowest):
 * 1. 🃛 10 of Hearts (Dulle) - highest trump
 * 2. Queens (Kreuz-Dame > Pik-Dame > Herz-Dame > Karo-Dame)
 * 3. Jacks (Kreuz-Bube > Pik-Bube > Herz-Bube > Karo-Bube)
 * 4. Diamonds (A > 10 > K > 9)
 *
 * Special rule: Second Dulle beats first Dulle (handled in trickLogic).
 */

import { Card } from '@/engine/models/Card';
import { Suit, Rank } from '@/types/card.types';

/**
 * Check if a card is a Dulle (Herz 10)
 */
export function isDulle(card: Card): boolean {
  return card.rank === Rank.TEN && card.suit === Suit.HEARTS;
}

/**
 * Check if a card is trump
 */
export function isTrump(card: Card, trumpSuit: Suit = Suit.DIAMONDS): boolean {
  // 10 of Hearts (Dulle) - highest trump
  if (isDulle(card)) return true;

  // All Queens are trump
  if (card.rank === Rank.QUEEN) return true;

  // All Jacks are trump
  if (card.rank === Rank.JACK) return true;

  // All cards of trump suit (default: Diamonds)
  if (card.suit === trumpSuit) return true;

  return false;
}

/**
 * Get trump order for a card (lower number = higher priority)
 * Returns undefined if not trump
 */
export function getTrumpOrder(card: Card): number | undefined {
  // Determine order purely from suit/rank (no card.isTrump guard)
  // so this works both before and after initializeTrumpCards

  // Dulle (order 0) - highest trump
  if (isDulle(card)) return 0;

  // Queens (order 1-4)
  if (card.rank === Rank.QUEEN) {
    const queenOrder: Record<Suit, number> = {
      [Suit.CLUBS]: 1,    // Highest Queen
      [Suit.SPADES]: 2,
      [Suit.HEARTS]: 3,
      [Suit.DIAMONDS]: 4, // Lowest Queen
    };
    return queenOrder[card.suit];
  }

  // Jacks (order 5-8)
  if (card.rank === Rank.JACK) {
    const jackOrder: Record<Suit, number> = {
      [Suit.CLUBS]: 5,    // Highest Jack
      [Suit.SPADES]: 6,
      [Suit.HEARTS]: 7,
      [Suit.DIAMONDS]: 8, // Lowest Jack
    };
    return jackOrder[card.suit];
  }

  // Diamonds (order 9-12) - Queens and Jacks are handled above
  if (card.suit === Suit.DIAMONDS) {
    const diamondOrder: Partial<Record<Rank, number>> = {
      [Rank.ACE]: 9,
      [Rank.TEN]: 10,
      [Rank.KING]: 11,
      [Rank.NINE]: 12,
    };
    return diamondOrder[card.rank];
  }

  return undefined;
}

/**
 * Compare two trump cards
 * Returns negative if card1 is stronger, positive if card2 is stronger
 */
export function compareTrumpCards(card1: Card, card2: Card): number {
  const order1 = card1.trumpOrder ?? getTrumpOrder(card1);
  const order2 = card2.trumpOrder ?? getTrumpOrder(card2);

  if (order1 === undefined || order2 === undefined) {
    throw new Error('Cannot compare non-trump cards');
  }

  return order1 - order2; // Lower order = higher priority
}

/**
 * Initialize all trump cards in a deck
 * Call this after deck creation to set trump flags and ordering
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
 * 2 Dulles + 8 Queens + 8 Jacks + 8 Diamonds = 26 trump cards
 */
export function countTrumpCards(cards: Card[]): number {
  return filterTrumpCards(cards).length;
}
