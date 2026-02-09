/**
 * Game Engine - Main orchestrator for Doppelkopf game logic
 *
 * Responsibilities:
 * - Initialize games
 * - Process player moves
 * - Manage game flow
 * - Apply game rules
 * - Calculate scores
 */

import { GameState } from './models/GameState';
import { Deck } from './models/Deck';
import { Player } from './models/Player';
import { Card } from './models/Card';
import { Trick } from './models/Trick';
import { GamePhase, Team, PlayerId } from '@/types/game.types';
import { initializeTrumpCards } from './logic/trumpLogic';
import { assignTeams } from './logic/teamLogic';
import { calculateTrickWinner } from './logic/trickLogic';
import {
  calculateFinalScore,
  calculateCurrentScore,
  detectFoxCatch,
  detectKarlchen,
  detectDoppelkopfTrick,
} from './logic/scoreLogic';
import { validateMove, getLegalMoves } from './logic/legalMoves';

export interface GameEngineConfig {
  playerNames?: [string, string, string, string];
  humanPlayerIndex?: number;
}

export class GameEngine {
  private gameState: GameState;

  constructor(config?: GameEngineConfig) {
    this.gameState = new GameState();
    this.initialize(config);
  }

  /**
   * Initialize a new game
   * TODO: Set up deck, deal cards, assign teams
   */
  private initialize(config?: GameEngineConfig): void {
    // TODO: Implement game initialization
    const playerNames: [string, string, string, string] = config?.playerNames ?? [
      'You',
      'AI 1',
      'AI 2',
      'AI 3',
    ];

    // Initialize players
    this.gameState.initializePlayers(playerNames);

    // Create and shuffle deck
    const deck = new Deck();
    const [hand1, hand2, hand3, hand4] = deck.deal();

    // Distribute cards
    this.gameState.players[0].receiveCards(hand1);
    this.gameState.players[1].receiveCards(hand2);
    this.gameState.players[2].receiveCards(hand3);
    this.gameState.players[3].receiveCards(hand4);

    // Initialize trump cards
    const allCards = this.getAllCards();
    initializeTrumpCards(allCards, this.gameState.trumpSuit);

    // Assign teams
    assignTeams(this.gameState);

    // Sort all hands
    this.gameState.players.forEach(player => player.sortHand());

    // Set phase to announcements
    this.gameState.setPhase(GamePhase.ANNOUNCEMENTS);
  }

  /**
   * Start the playing phase
   */
  startPlaying(): void {
    // TODO: Transition to playing phase
    this.gameState.setPhase(GamePhase.PLAYING);
  }

  /**
   * Play a card for the current player
   * TODO: Main action - validate, execute, advance game
   */
  playCard(cardId: string): { success: boolean; error?: string } {
    // TODO: Implement card playing
    const currentPlayer = this.gameState.getCurrentPlayer();
    const card = currentPlayer.hand.find(c => c.id === cardId);

    if (!card) {
      return { success: false, error: 'Card not found in hand' };
    }

    // Validate move
    const validation = validateMove(card, currentPlayer, this.gameState.currentTrick);
    if (!validation.valid) {
      return { success: false, error: validation.reason };
    }

    // Play the card
    const playedCard = currentPlayer.playCard(cardId);
    if (!playedCard) {
      return { success: false, error: 'Failed to play card' };
    }

    // Add to trick
    this.gameState.currentTrick.addCard(playedCard, currentPlayer.id);

    // Check if trick is complete
    if (this.gameState.currentTrick.isComplete()) {
      this.completeTrick();
    } else {
      // Advance to next player
      this.gameState.advanceToNextPlayer();
    }

    return { success: true };
  }

  /**
   * Complete current trick and start new one
   */
  private completeTrick(): void {
    // Determine winner
    const winnerId = calculateTrickWinner(this.gameState.currentTrick);

    if (winnerId) {
      this.gameState.currentTrick.setWinner(winnerId);

      // Increment tricks taken for winner
      const winner = this.gameState.getPlayer(winnerId);
      if (winner) {
        winner.tricksTaken += 1;
      }

      // Track special achievements before moving trick to completed
      const trickNumber = this.gameState.completedTricks.length + 1;
      this.trackSpecialAchievements(this.gameState.currentTrick, winnerId, trickNumber);

      // Update scores
      const { re, kontra } = calculateCurrentScore(this.gameState);
      this.gameState.scores.re = re;
      this.gameState.scores.kontra = kontra;

      // Move trick to completed
      this.gameState.completeTrick();

      // Check if game is finished
      if (this.gameState.isGameFinished()) {
        this.finishGame();
      } else {
        // Start new trick, winner leads
        const winnerIndex = this.gameState.players.findIndex(p => p.id === winnerId);
        this.gameState.currentPlayerIndex = winnerIndex;
        this.gameState.startNewTrick();
      }
    }
  }

  /**
   * Track special achievements for a completed trick
   */
  private trackSpecialAchievements(trick: Trick, winnerId: PlayerId, trickNumber: number): void {
    // Check for Fox catch (Ace of Diamonds captured by opponent)
    const foxCatch = detectFoxCatch(trick, winnerId, this.gameState.players);
    if (foxCatch) {
      if (!this.gameState.specialPoints.foxesCaught) {
        this.gameState.specialPoints.foxesCaught = [];
      }
      this.gameState.specialPoints.foxesCaught.push(foxCatch);
    }

    // Check for Karlchen (winning trick 12 with Club Jack)
    const karlchen = detectKarlchen(trick, trickNumber, winnerId, this.gameState.players);
    if (karlchen) {
      this.gameState.specialPoints.karlchen = karlchen;
    }

    // Check for Doppelkopf trick (40+ points)
    const doppelkopf = detectDoppelkopfTrick(trick, winnerId, this.gameState.players);
    if (doppelkopf) {
      if (!this.gameState.specialPoints.doppelkopfTricks) {
        this.gameState.specialPoints.doppelkopfTricks = [];
      }
      this.gameState.specialPoints.doppelkopfTricks.push(doppelkopf);
    }
  }

  /**
   * Finish the game and calculate final scores
   */
  private finishGame(): void {
    // TODO: Calculate final scores and special points
    this.gameState.setPhase(GamePhase.SCORING);

    const finalScore = calculateFinalScore(this.gameState);
    this.gameState.scores.re = finalScore.rePoints;
    this.gameState.scores.kontra = finalScore.kontraPoints;
    this.gameState.specialPoints = {
      winner: finalScore.winner,
      ...finalScore.specialPoints,
    };

    this.gameState.setPhase(GamePhase.FINISHED);
  }

  /**
   * Get current game state (for UI updates)
   */
  getGameState(): GameState {
    return this.gameState;
  }

  /**
   * Get legal moves for current player
   */
  getLegalMovesForCurrentPlayer(): Card[] {
    const currentPlayer = this.gameState.getCurrentPlayer();
    return getLegalMoves(currentPlayer, this.gameState.currentTrick);
  }

  /**
   * Announce Re or Kontra for a player
   */
  announceTeam(playerId: PlayerId, team: Team): { success: boolean; error?: string } {
    // TODO: Implement announcement
    const player = this.gameState.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    const success = player.announceTeam(team as Team.RE | Team.CONTRA);
    if (!success) {
      return { success: false, error: 'Cannot announce at this time' };
    }

    return { success: true };
  }

  /**
   * Get all cards in play (for trump initialization)
   */
  private getAllCards(): Card[] {
    const cards: Card[] = [];
    this.gameState.players.forEach(player => {
      cards.push(...player.hand);
    });
    return cards;
  }

  /**
   * Reset game to initial state
   */
  reset(config?: GameEngineConfig): void {
    this.gameState = new GameState();
    this.initialize(config);
  }

  /**
   * Check if it's a human player's turn
   */
  isHumanTurn(): boolean {
    return this.gameState.getCurrentPlayer().isHuman;
  }

  /**
   * Get current player
   */
  getCurrentPlayer(): Player {
    return this.gameState.getCurrentPlayer();
  }

  /**
   * Export game state for persistence
   */
  exportState(): string {
    return JSON.stringify(this.gameState.toData());
  }

  /**
   * Import game state from persistence
   */
  importState(stateJson: string): void {
    const data = JSON.parse(stateJson);
    this.gameState = GameState.fromData(data);
  }
}
