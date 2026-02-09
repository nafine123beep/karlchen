/**
 * AI Player - Wrapper around Player with AI decision making
 */

import { Player } from '@/engine/models/Player';
import { GameState } from '@/engine/models/GameState';
import { Card } from '@/engine/models/Card';
import { Team } from '@/types/game.types';
import { selectCardToPlay, shouldAnnounce } from './aiStrategies';
import { canAnnounce } from '@/engine/logic/teamLogic';
import { getLegalMoves } from '@/engine/logic/legalMoves';

export enum AILevel {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export class AIPlayer {
  private player: Player;
  private level: AILevel;
  private thinkingDelay: number; // Milliseconds

  constructor(player: Player, level: AILevel = AILevel.Medium) {
    if (player.isHuman) {
      throw new Error('Cannot create AIPlayer from human player');
    }

    this.player = player;
    this.level = level;
    this.thinkingDelay = this.getThinkingDelay();
  }

  /**
   * Get thinking delay based on AI level
   */
  private getThinkingDelay(): number {
    switch (this.level) {
      case AILevel.Easy:
        return 500; // 0.5s
      case AILevel.Medium:
        return 1000; // 1s
      case AILevel.Hard:
        return 1500; // 1.5s
    }
  }

  /**
   * Make AI decision for card to play
   * TODO: Returns card after thinking delay
   */
  async makeMove(gameState: GameState): Promise<Card | null> {
    // TODO: Implement AI move with delay
    // Simulate thinking time
    await this.sleep(this.thinkingDelay);

    // Select card based on level
    const card = this.selectCard(gameState);

    return card;
  }

  /**
   * Select card based on AI level
   */
  private selectCard(gameState: GameState): Card | null {
    // TODO: Implement different strategies per level
    switch (this.level) {
      case AILevel.Easy:
        return this.selectCardEasy(gameState);
      case AILevel.Medium:
        return this.selectCardMedium(gameState);
      case AILevel.Hard:
        return this.selectCardHard(gameState);
    }
  }

  /**
   * Easy AI: Random legal move
   */
  private selectCardEasy(gameState: GameState): Card | null {
    const legalMoves = getLegalMoves(this.player, gameState.currentTrick);
    if (legalMoves.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * legalMoves.length);
    return legalMoves[randomIndex];
  }

  /**
   * Medium AI: Basic strategy
   */
  private selectCardMedium(gameState: GameState): Card | null {
    // TODO: Use aiStrategies
    return selectCardToPlay(this.player, gameState);
  }

  /**
   * Hard AI: Advanced strategy with card counting
   * TODO: Future implementation
   */
  private selectCardHard(gameState: GameState): Card | null {
    // TODO: Implement hard AI with card counting
    // For now, use medium strategy
    return this.selectCardMedium(gameState);
  }

  /**
   * Decide whether to announce Re/Kontra
   */
  async decideAnnouncement(gameState: GameState): Promise<Team | null> {
    // TODO: Implement announcement decision
    await this.sleep(this.thinkingDelay / 2);

    if (!canAnnounce(this.player, gameState)) return null;

    // Use strategy to decide
    if (shouldAnnounce(this.player, gameState)) {
      return this.player.team;
    }

    return null;
  }

  /**
   * Get underlying player
   */
  getPlayer(): Player {
    return this.player;
  }

  /**
   * Sleep utility for thinking delay
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Update AI level
   */
  setLevel(level: AILevel): void {
    this.level = level;
    this.thinkingDelay = this.getThinkingDelay();
  }

  /**
   * Get current AI level
   */
  getLevel(): AILevel {
    return this.level;
  }
}
