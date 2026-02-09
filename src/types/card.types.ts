/**
 * Card-related type definitions for Doppelkopf
 */

// Kartenfarben (Suits)
export enum Suit {
  CLUBS = 'clubs',      // Kreuz
  SPADES = 'spades',    // Pik
  HEARTS = 'hearts',    // Herz
  DIAMONDS = 'diamonds' // Karo
}

// Kartenwerte (Ranks) - ohne Neunen
export enum Rank {
  JACK = 'J',    // Bube
  QUEEN = 'Q',   // Dame
  KING = 'K',    // König
  TEN = '10',
  ACE = 'A'
}

// Card Interface
export interface ICard {
  suit: Suit;
  rank: Rank;
  value: number;      // Punkte (Augen): Ass=11, 10=10, König=4, Dame=3, Bube=2
  isTrump: boolean;   // Wird dynamisch berechnet
  id: string;         // Unique ID (z.B. "clubs-Q-1" für erste Kreuz-Dame)
}

// Trump-Reihenfolge (höher = stärker)
export enum TrumpOrder {
  CLUBS_QUEEN = 14,
  SPADES_QUEEN = 13,
  HEARTS_QUEEN = 12,
  DIAMONDS_QUEEN = 11,
  CLUBS_JACK = 10,
  SPADES_JACK = 9,
  HEARTS_JACK = 8,
  DIAMONDS_JACK = 7,
  DIAMONDS_ACE = 6,
  DIAMONDS_TEN = 5,
  DIAMONDS_KING = 4,
}

export type CardId = string;

// Card data for serialization
export interface CardData {
  id: CardId;
  suit: Suit;
  rank: Rank;
  value: number;
  isTrump: boolean;
  trumpOrder?: number;
}
