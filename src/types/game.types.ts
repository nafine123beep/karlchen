/**
 * Game state and logic type definitions
 */

import { ICard, CardData, Suit } from './card.types';

// Teams
export enum Team {
  RE = 're',
  CONTRA = 'contra',
  UNKNOWN = 'unknown'
}

// Player Interface
export interface IPlayer {
  id: string;
  name: string;
  hand: ICard[];
  team: Team;
  isHuman: boolean;
  tricksWon: number;
  points: number;
}

// Stich (Trick)
export interface ITrick {
  cards: Array<{
    card: ICard;
    playerId: string;
  }>;
  winner: string | null;
  points: number;
}

// Game Phase
export enum GamePhase {
  SETUP = 'setup',
  DEALING = 'dealing',
  ANNOUNCEMENTS = 'announcements',
  PLAYING = 'playing',
  SCORING = 'scoring',
  FINISHED = 'finished'
}

// Game State
export interface IGameState {
  players: IPlayer[];
  currentTrick: ITrick;
  completedTricks: ITrick[];
  currentPlayerIndex: number;
  phase: GamePhase;
  reTeam: string[];      // Player IDs
  contraTeam: string[];  // Player IDs
  round: number;
}

export type PlayerId = string;

// Player data for serialization
export interface PlayerData {
  id: PlayerId;
  name: string;
  isHuman: boolean;
  team: Team;
  hand: CardData[];
  tricksTaken: number;
  hasAnnounced: boolean;
}

// Trick data for serialization
export interface TrickData {
  id: string;
  cards: Array<{
    cardId: string;
    playerId: PlayerId;
  }>;
  leadPlayerId: PlayerId;
  winnerId?: PlayerId;
}

// Game state data for serialization
export interface GameStateData {
  id: string;
  phase: GamePhase;
  players: PlayerData[];
  currentTrick: TrickData;
  completedTricks: TrickData[];
  currentPlayerIndex: number;
  trumpSuit: Suit;
  scores: {
    re: number;
    kontra: number;
  };
  specialPoints: SpecialPoints;
}

// Special points achieved during the game
export interface SpecialPoints {
  winner: Team | null;
  against90?: Team;
  against60?: Team;
  against30?: Team;
  schwarz?: Team;
  // Doppelkopf specials
  foxesCaught?: Array<{ caughtByTeam: Team; fromPlayerId: PlayerId }>;
  karlchen?: { team: Team; playerId: PlayerId };
  doppelkopfTricks?: Array<{ team: Team; playerId: PlayerId; points: number }>;
}
