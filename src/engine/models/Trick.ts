/**
 * Trick Model - Represents a single trick (4 cards played)
 */

import { Card } from './Card';
import { TrickData, PlayerId } from '@/types/game.types';
import { Suit } from '@/types/card.types';

export interface PlayedCard {
  card: Card;
  playerId: PlayerId;
}

export class Trick {
  readonly id: string;
  private playedCards: PlayedCard[];
  readonly leadPlayerId: PlayerId;
  winnerId?: PlayerId;

  constructor(leadPlayerId: PlayerId, trickNumber: number) {
    this.id = `trick_${trickNumber}`;
    this.leadPlayerId = leadPlayerId;
    this.playedCards = [];
    this.winnerId = undefined;
  }

  /**
   * Add a card to this trick
   * TODO: Validate that trick is not already complete
   */
  addCard(card: Card, playerId: PlayerId): boolean {
    // TODO: Implement card adding with validation
    if (this.playedCards.length >= 4) {
      return false; // Trick already complete
    }

    this.playedCards.push({ card, playerId });
    return true;
  }

  /**
   * Check if trick is complete (4 cards played)
   */
  isComplete(): boolean {
    return this.playedCards.length === 4;
  }

  /**
   * Get the lead card (first card played)
   */
  getLeadCard(): Card | null {
    return this.playedCards[0]?.card ?? null;
  }

  /**
   * Get the suit that was led
   * TODO: Returns null if lead card is trump
   */
  getLeadSuit(): Suit | null {
    const leadCard = this.getLeadCard();
    if (!leadCard || leadCard.isTrump) return null;
    return leadCard.suit;
  }

  /**
   * Get all cards in this trick
   */
  getCards(): Card[] {
    return this.playedCards.map(pc => pc.card);
  }

  /**
   * Get all played cards with player info (for UI)
   */
  get cards(): PlayedCard[] {
    return [...this.playedCards];
  }

  /**
   * Get card played by specific player
   */
  getCardByPlayer(playerId: PlayerId): Card | null {
    const played = this.playedCards.find(pc => pc.playerId === playerId);
    return played?.card ?? null;
  }

  /**
   * Calculate total point value of this trick
   * TODO: Sum up card values
   */
  getTotalValue(): number {
    // TODO: Implement value calculation
    return this.playedCards.reduce((sum, pc) => sum + pc.card.value, 0);
  }

  /**
   * Determine winner of this trick
   * TODO: This should be called by trickLogic, not internally
   */
  setWinner(playerId: PlayerId): void {
    this.winnerId = playerId;
  }

  /**
   * Get the order in which cards were played
   */
  getPlayOrder(): PlayerId[] {
    return this.playedCards.map(pc => pc.playerId);
  }

  /**
   * Get number of cards played so far
   */
  get size(): number {
    return this.playedCards.length;
  }

  /**
   * Convert to plain data object
   */
  toData(): TrickData {
    return {
      id: this.id,
      cards: this.playedCards.map(pc => ({
        cardId: pc.card.id,
        playerId: pc.playerId,
      })),
      leadPlayerId: this.leadPlayerId,
      winnerId: this.winnerId,
    };
  }

  /**
   * Create Trick from data object
   * TODO: Requires card lookup from game state
   */
  static fromData(data: TrickData, cardLookup: Map<string, Card>): Trick {
    // TODO: Implement deserialization
    const trickNumber = parseInt(data.id.split('_')[1]);
    const trick = new Trick(data.leadPlayerId, trickNumber);

    data.cards.forEach(({ cardId, playerId }) => {
      const card = cardLookup.get(cardId);
      if (card) {
        trick.addCard(card, playerId);
      }
    });

    trick.winnerId = data.winnerId;
    return trick;
  }

  /**
   * Get debug string
   */
  toString(): string {
    const cards = this.playedCards.map(pc => `${pc.playerId}: ${pc.card.toString()}`);
    return `Trick ${this.id} [${cards.join(', ')}] Winner: ${this.winnerId ?? 'TBD'}`;
  }
}
