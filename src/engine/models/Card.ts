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
   * Ace = 11, Ten = 10, King = 4, Queen = 3, Jack = 2, Nine = 0
   */
  private calculateValue(): number {
    const valueMap: Record<Rank, number> = {
      [Rank.ACE]: 11,
      [Rank.TEN]: 10,
      [Rank.KING]: 4,
      [Rank.QUEEN]: 3,
      [Rank.JACK]: 2,
      [Rank.NINE]: 0,
    };
    return valueMap[this.rank];
  }

  /**
   * Set this card as trump with specific ordering
   */
  setTrump(order: number): void {
    this.isTrump = true;
    this.trumpOrder = order;
  }

  /**
   * Compare this card to another by rank strength (non-trump only).
   * Returns positive if this card is stronger, negative if weaker, 0 if equal.
   */
  compareTo(other: Card): number {
    const RANK_STRENGTH: Record<Rank, number> = {
      [Rank.ACE]: 5,
      [Rank.TEN]: 4,
      [Rank.KING]: 3,
      [Rank.QUEEN]: 2,
      [Rank.JACK]: 1,
      [Rank.NINE]: 0,
    };
    return RANK_STRENGTH[this.rank] - RANK_STRENGTH[other.rank];
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
