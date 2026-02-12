/**
 * IllusionGameEngine - Lightweight game engine for the demo/learning game.
 *
 * Uses predefined card distributions and scripted AI moves.
 * Reuses existing game models and logic modules.
 * Skips announcements and special point tracking.
 */

import { GameState } from '@/engine/models/GameState';
import { Player } from '@/engine/models/Player';
import { Card } from '@/engine/models/Card';
import { Trick } from '@/engine/models/Trick';
import { GamePhase, Team } from '@/types/game.types';
import { initializeTrumpCards } from '@/engine/logic/trumpLogic';
import { assignTeams } from '@/engine/logic/teamLogic';
import { calculateTrickWinner } from '@/engine/logic/trickLogic';
import { calculateCurrentScore } from '@/engine/logic/scoreLogic';
import { validateMove, getLegalMoves } from '@/engine/logic/legalMoves';
import {
  ILLUSION_HANDS,
  ILLUSION_AI_MOVES,
  CardDef,
} from '@/data/illusionGame/illusionGameScript';

export class IllusionGameEngine {
  private gameState: GameState;
  private trickNumber: number;

  constructor() {
    this.gameState = new GameState();
    this.trickNumber = 0;
    this.initialize();
  }

  private initialize(): void {
    // Create 4 players
    this.gameState.initializePlayers(['Du', 'Gegner 1', 'Partner', 'Gegner 2']);

    // Assign predefined hands
    for (let i = 0; i < 4; i++) {
      const cards = ILLUSION_HANDS[i].map(
        (def: CardDef) => new Card(def.suit, def.rank, def.copyNumber)
      );
      this.gameState.players[i].receiveCards(cards);
    }

    // Initialize trump flags on all cards
    const allCards = this.gameState.players.flatMap(p => p.hand);
    initializeTrumpCards(allCards, this.gameState.trumpSuit);

    // Assign teams based on Queen of Clubs
    assignTeams(this.gameState);

    // Sort all hands for display
    this.gameState.players.forEach(p => p.sortHand());

    // Skip announcements, go directly to playing
    this.gameState.setPhase(GamePhase.PLAYING);

    // Human (player_0) leads first trick
    this.gameState.currentPlayerIndex = 0;
    this.gameState.currentTrick = new Trick('player_0', 1);
  }

  /**
   * Play a card for the human player.
   * Validates the move using existing legal move logic.
   */
  playHumanCard(cardId: string): { success: boolean; error?: string } {
    const humanPlayer = this.gameState.players[0];
    const card = humanPlayer.hand.find(c => c.id === cardId);

    if (!card) {
      return { success: false, error: 'Karte nicht gefunden' };
    }

    const validation = validateMove(card, humanPlayer, this.gameState.currentTrick);
    if (!validation.valid) {
      return { success: false, error: validation.reason };
    }

    const playedCard = humanPlayer.playCard(cardId);
    if (!playedCard) {
      return { success: false, error: 'Karte konnte nicht gespielt werden' };
    }

    this.gameState.currentTrick.addCard(playedCard, humanPlayer.id);
    this.gameState.advanceToNextPlayer();

    return { success: true };
  }

  /**
   * Play the scripted AI card for the current player.
   * Falls back to any legal move if the scripted card is unavailable or illegal.
   */
  playAICard(): { success: boolean; cardId: string; error?: string } {
    const currentPlayer = this.gameState.getCurrentPlayer();
    if (currentPlayer.isHuman) {
      return { success: false, cardId: '', error: 'Nicht der KI-Spieler' };
    }

    // Get scripted card for this trick
    const trickMoves = ILLUSION_AI_MOVES[this.trickNumber];
    const scriptedCardId = trickMoves?.[currentPlayer.id];

    let cardToPlay: Card | undefined;

    // Try scripted card first
    if (scriptedCardId) {
      const scriptedCard = currentPlayer.hand.find(c => c.id === scriptedCardId);
      if (scriptedCard) {
        const validation = validateMove(scriptedCard, currentPlayer, this.gameState.currentTrick);
        if (validation.valid) {
          cardToPlay = scriptedCard;
        }
      }
    }

    // Fallback: pick any legal move
    if (!cardToPlay) {
      const legalMoves = getLegalMoves(currentPlayer, this.gameState.currentTrick);
      if (legalMoves.length === 0) {
        return { success: false, cardId: '', error: 'Keine legalen Züge' };
      }
      cardToPlay = legalMoves[0];
    }

    const playedCard = currentPlayer.playCard(cardToPlay.id);
    if (!playedCard) {
      return { success: false, cardId: '', error: 'KI konnte Karte nicht spielen' };
    }

    this.gameState.currentTrick.addCard(playedCard, currentPlayer.id);

    // Check if trick is complete
    if (this.gameState.currentTrick.isComplete()) {
      this.completeTrick();
    } else {
      this.gameState.advanceToNextPlayer();
    }

    return { success: true, cardId: cardToPlay.id };
  }

  /**
   * Complete the current trick and start the next one.
   */
  private completeTrick(): void {
    const winnerId = calculateTrickWinner(this.gameState.currentTrick);

    if (winnerId) {
      this.gameState.currentTrick.setWinner(winnerId);

      const winner = this.gameState.getPlayer(winnerId);
      if (winner) {
        winner.tricksTaken += 1;
      }

      // Update scores
      const { re, kontra } = calculateCurrentScore(this.gameState);
      this.gameState.scores.re = re;
      this.gameState.scores.kontra = kontra;

      // Move trick to completed
      this.gameState.completeTrick();
      this.trickNumber++;

      console.log('[IllusionEngine] Trick completed:', {
        trickNumber: this.trickNumber,
        totalCompleted: this.gameState.completedTricks.length,
        isFinished: this.trickNumber >= 12,
      });

      // Check if game is finished (all 12 tricks)
      if (this.trickNumber >= 12) {
        console.log('[IllusionEngine] Game FINISHED - Setting phase to FINISHED');
        this.gameState.setPhase(GamePhase.FINISHED);
        console.log('[IllusionEngine] Phase set to:', this.gameState.phase);
      } else {
        // Winner leads next trick
        const winnerIndex = this.gameState.players.findIndex(p => p.id === winnerId);
        this.gameState.currentPlayerIndex = winnerIndex;
        this.gameState.startNewTrick();
      }
    }
  }

  // ---- Getters ----

  getGameState(): GameState {
    return this.gameState;
  }

  getTrickNumber(): number {
    return this.trickNumber;
  }

  getLegalMovesForHuman(): Card[] {
    const humanPlayer = this.gameState.players[0];
    return getLegalMoves(humanPlayer, this.gameState.currentTrick);
  }

  isHumanTurn(): boolean {
    return this.gameState.getCurrentPlayer().isHuman;
  }

  isFinished(): boolean {
    const finished = this.gameState.phase === GamePhase.FINISHED;
    console.log('[IllusionEngine] isFinished():', finished, '(phase:', this.gameState.phase, ')');
    return finished;
  }

  getCurrentPlayer(): Player {
    return this.gameState.getCurrentPlayer();
  }
}
