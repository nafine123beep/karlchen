/**
 * Player Model - Represents a single player in the game
 */

import { Card } from './Card';
import { Suit } from '@/types/card.types';
import { Team, PlayerData, PlayerId } from '@/types/game.types';
import { CardData } from '@/types/card.types';

export class Player {
  readonly id: PlayerId;
  name: string;
  isHuman: boolean;
  team: Team;
  hand: Card[];
  tricksTaken: number;
  hasAnnounced: boolean;

  constructor(id: PlayerId, name: string, isHuman: boolean = false) {
    this.id = id;
    this.name = name;
    this.isHuman = isHuman;
    this.team = Team.UNKNOWN;
    this.hand = [];
    this.tricksTaken = 0;
    this.hasAnnounced = false;
  }

  /**
   * Add cards to player's hand
   */
  receiveCards(cards: Card[]): void {
    this.hand.push(...cards);
  }

  /**
   * Play a card from hand
   */
  playCard(cardId: string): Card | null {
    const card = this.hand.find(c => c.id === cardId);
    if (!card) return null;

    this.hand = this.hand.filter(c => c.id !== cardId);
    return card;
  }

  /**
   * Check if player has specific card in hand
   */
  hasCard(cardId: string): boolean {
    return this.hand.some(card => card.id === cardId);
  }

  /**
   * Get all cards of specific suit
   */
  getCardsOfSuit(suit: Suit): Card[] {
    return this.hand.filter(card => card.suit === suit && !card.isTrump);
  }

  /**
   * Get all trump cards in hand
   */
  getTrumpCards(): Card[] {
    return this.hand.filter(card => card.isTrump);
  }

  /**
   * Announce Re or Kontra
   */
  announceTeam(team: Team.RE | Team.CONTRA): boolean {
    // Check if player has required cards for announcement
    if (this.hasAnnounced) return false;

    this.team = team;
    this.hasAnnounced = true;
    return true;
  }

  /**
   * Get number of cards in hand
   */
  get handSize(): number {
    return this.hand.length;
  }

  /**
   * Convert to plain data object
   */
  toData(): PlayerData {
    return {
      id: this.id,
      name: this.name,
      isHuman: this.isHuman,
      team: this.team,
      hand: this.hand.map(card => card.toData()),
      tricksTaken: this.tricksTaken,
      hasAnnounced: this.hasAnnounced,
    };
  }

  /**
   * Create Player from data object
   */
  static fromData(data: PlayerData): Player {
    const player = new Player(data.id, data.name, data.isHuman);
    player.team = data.team;
    player.hand = data.hand.map((cardData: CardData) => Card.fromData(cardData));
    player.tricksTaken = data.tricksTaken;
    player.hasAnnounced = data.hasAnnounced;
    return player;
  }

  /**
   * Sort hand by trump order and suit
   */
  sortHand(): void {
    // Trump cards first (by trumpOrder), then by suit and rank
    this.hand.sort((a, b) => {
      if (a.isTrump && !b.isTrump) return -1;
      if (!a.isTrump && b.isTrump) return 1;
      if (a.isTrump && b.isTrump) {
        return (a.trumpOrder ?? 0) - (b.trumpOrder ?? 0);
      }
      return a.compareTo(b);
    });
  }
}
