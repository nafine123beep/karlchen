/**
 * Card Model - Represents a single playing card in Doppelkopf
 */

import { Suit, Rank, ICard, CardId, CardData } from '@/types/card.types';

export class Card {
  readonly id: CardId;
  readonly suit: Suit;
  readonly rank: Rank;
  readonly value: number;
  isTrump: boolean;
  trumpOrder?: number;

  constructor(suit: Suit, rank: Rank, copyNumber: 1 | 2) {
    this.id = `${suit}_${rank}_${copyNumber}`;
    this.suit = suit;
    this.rank = rank;
    this.value = this.calculateValue();
    this.isTrump = false; // Will be set by trump logic
    this.trumpOrder = undefined;
  }

  /**
   * Calculate the point value of this card
   * Ace = 11, Ten = 10, King = 4, Queen = 3, Jack = 2
   */
  private calculateValue(): number {
    const valueMap: Record<Rank, number> = {
      [Rank.ACE]: 11,
      [Rank.TEN]: 10,
      [Rank.KING]: 4,
      [Rank.QUEEN]: 3,
      [Rank.JACK]: 2,
    };
    return valueMap[this.rank];
  }

  /**
   * Set this card as trump with specific ordering
   * TODO: Called by trump logic during game initialization
   */
  setTrump(order: number): void {
    // TODO: Implement trump setting
    this.isTrump = true;
    this.trumpOrder = order;
  }

  /**
   * Compare this card to another for sorting/winning
   * TODO: Implement comparison logic (trump vs non-trump, rank ordering)
   */
  compareTo(other: Card, leadSuit?: Suit): number {
    // TODO: Implement card comparison
    // Returns: positive if this > other, negative if this < other, 0 if equal
    return 0;
  }

  /**
   * Convert to plain data object for serialization
   */
  toData(): CardData {
    return {
      id: this.id,
      suit: this.suit,
      rank: this.rank,
      value: this.value,
      isTrump: this.isTrump,
      trumpOrder: this.trumpOrder,
    };
  }

  /**
   * Create Card instance from data object
   */
  static fromData(data: CardData): Card {
    // TODO: Implement deserialization
    // Parse copyNumber from id, reconstruct card
    const copyNumber = data.id.endsWith('_1') ? 1 : 2;
    const card = new Card(data.suit, data.rank, copyNumber as 1 | 2);
    card.isTrump = data.isTrump;
    card.trumpOrder = data.trumpOrder;
    return card;
  }

  /**
   * Get display string for debugging
   */
  toString(): string {
    const trumpMarker = this.isTrump ? '🔥' : '';
    return `${this.rank} of ${this.suit} ${trumpMarker}`.trim();
  }
}
