/**
 * Deck Model - Manages the 40-card Doppelkopf deck (ohne Neunen, 2x 20 cards)
 */

import { Card } from './Card';
import { Suit, Rank } from '@/types/card.types';

export class Deck {
  private cards: Card[] = [];

  constructor() {
    this.initializeDeck();
  }

  /**
   * Create the full Doppelkopf deck (ohne Neunen)
   * 2 copies of each card (J, Q, K, 10, A) in all 4 suits = 40 cards
   */
  private initializeDeck(): void {
    const suits = [Suit.HEARTS, Suit.DIAMONDS, Suit.SPADES, Suit.CLUBS];
    const ranks = [Rank.JACK, Rank.QUEEN, Rank.KING, Rank.TEN, Rank.ACE];

    suits.forEach(suit => {
      ranks.forEach(rank => {
        // Create 2 copies of each card
        this.cards.push(new Card(suit, rank, 1));
        this.cards.push(new Card(suit, rank, 2));
      });
    });
  }

  /**
   * Shuffle the deck using Fisher-Yates algorithm
   * TODO: Implement proper shuffling
   */
  shuffle(): void {
    // TODO: Implement Fisher-Yates shuffle
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  /**
   * Deal cards to 4 players (10 cards each)
   */
  deal(): [Card[], Card[], Card[], Card[]] {
    this.shuffle();

    const hand1 = this.cards.slice(0, 10);
    const hand2 = this.cards.slice(10, 20);
    const hand3 = this.cards.slice(20, 30);
    const hand4 = this.cards.slice(30, 40);

    return [hand1, hand2, hand3, hand4];
  }

  /**
   * Get total number of cards in deck
   */
  get size(): number {
    return this.cards.length;
  }

  /**
   * Get all cards (for testing/debugging)
   */
  getCards(): Card[] {
    return [...this.cards];
  }

  /**
   * Reset deck to initial state
   */
  reset(): void {
    this.cards = [];
    this.initializeDeck();
  }

  /**
   * Find specific card by ID
   */
  findCard(cardId: string): Card | undefined {
    return this.cards.find(card => card.id === cardId);
  }
}
