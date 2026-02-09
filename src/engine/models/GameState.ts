/**
 * GameState Model - Complete state of a Doppelkopf game
 */

import { Player } from './Player';
import { Trick } from './Trick';
import { Card } from './Card';
import { GamePhase, Team, GameStateData, PlayerData, TrickData, SpecialPoints } from '@/types/game.types';
import { Suit } from '@/types/card.types';

export class GameState {
  readonly id: string;
  phase: GamePhase;
  players: Player[]; // Always 4 players (index 0, 1, 2, 3)
  currentTrick: Trick;
  completedTricks: Trick[];
  currentPlayerIndex: number;
  trumpSuit: Suit;
  scores: {
    re: number;
    kontra: number;
  };
  specialPoints: SpecialPoints;

  constructor(gameId: string = `game_${Date.now()}`) {
    this.id = gameId;
    this.phase = GamePhase.DEALING;
    this.players = [];
    this.currentTrick = new Trick('player_0', 1);
    this.completedTricks = [];
    this.currentPlayerIndex = 0;
    this.trumpSuit = Suit.DIAMONDS; // Default trump suit in Doppelkopf
    this.scores = { re: 0, kontra: 0 };
    this.specialPoints = { winner: null };
  }

  /**
   * Initialize players for the game
   * TODO: Called during setup
   */
  initializePlayers(playerNames: [string, string, string, string]): void {
    // TODO: Create 4 players
    this.players = playerNames.map((name, index) =>
      new Player(`player_${index}`, name, index === 0) // Player 0 is human
    );
  }

  /**
   * Get current player whose turn it is
   */
  getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  /**
   * Get next player index (clockwise)
   */
  getNextPlayerIndex(): number {
    return (this.currentPlayerIndex + 1) % 4;
  }

  /**
   * Advance to next player
   */
  advanceToNextPlayer(): void {
    this.currentPlayerIndex = this.getNextPlayerIndex();
  }

  /**
   * Start a new trick
   * TODO: Called after previous trick is completed
   */
  startNewTrick(): void {
    // TODO: Implement new trick creation
    const trickNumber = this.completedTricks.length + 1;
    const leadPlayer = this.currentTrick.winnerId ?? `player_${this.currentPlayerIndex}`;
    this.currentTrick = new Trick(leadPlayer, trickNumber);
  }

  /**
   * Complete current trick and add to completed tricks
   */
  completeTrick(): void {
    if (this.currentTrick.isComplete()) {
      this.completedTricks.push(this.currentTrick);
    }
  }

  /**
   * Check if game is finished (all 10 tricks played, ohne Neunen)
   */
  isGameFinished(): boolean {
    return this.completedTricks.length === 10 && this.currentTrick.isComplete();
  }

  /**
   * Get player by ID
   */
  getPlayer(playerId: string): Player | null {
    return this.players.find(p => p.id === playerId) ?? null;
  }

  /**
   * Get players on specific team
   */
  getPlayersOnTeam(team: Team): Player[] {
    return this.players.filter(p => p.team === team);
  }

  /**
   * Update scores based on completed tricks
   * TODO: Should be called by scoreLogic
   */
  updateScores(): void {
    // TODO: Calculate scores from completed tricks
    // This will be implemented in scoreLogic.ts
  }

  /**
   * Transition to next game phase
   */
  setPhase(phase: GamePhase): void {
    this.phase = phase;
  }

  /**
   * Convert to plain data object for persistence
   */
  toData(): GameStateData {
    return {
      id: this.id,
      phase: this.phase,
      players: this.players.map(p => p.toData()),
      currentTrick: this.currentTrick.toData(),
      completedTricks: this.completedTricks.map(t => t.toData()),
      currentPlayerIndex: this.currentPlayerIndex,
      trumpSuit: this.trumpSuit,
      scores: { ...this.scores },
      specialPoints: { ...this.specialPoints },
    };
  }

  /**
   * Create GameState from data object
   */
  static fromData(data: GameStateData): GameState {
    // TODO: Implement full deserialization
    const gameState = new GameState(data.id);
    gameState.phase = data.phase;
    gameState.players = data.players.map((pd: PlayerData) => Player.fromData(pd));

    // Build card lookup map
    const cardLookup = new Map<string, Card>();
    gameState.players.forEach(player => {
      player.hand.forEach(card => {
        cardLookup.set(card.id, card);
      });
    });

    gameState.currentTrick = Trick.fromData(data.currentTrick, cardLookup);
    gameState.completedTricks = data.completedTricks.map((td: TrickData) =>
      Trick.fromData(td, cardLookup)
    );
    gameState.currentPlayerIndex = data.currentPlayerIndex;
    gameState.trumpSuit = data.trumpSuit;
    gameState.scores = { ...data.scores };
    gameState.specialPoints = { ...data.specialPoints };

    return gameState;
  }

  /**
   * Clone the game state (useful for AI simulations)
   */
  clone(): GameState {
    return GameState.fromData(this.toData());
  }
}
