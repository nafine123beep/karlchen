/**
 * Game Store - Zustand store for active game state
 */

import { create } from 'zustand';
import { GameEngine } from '@/engine/GameEngine';
import { GameState } from '@/engine/models/GameState';
import { Card } from '@/engine/models/Card';
import { AIPlayer, AILevel } from '@/engine/ai/AIPlayer';
import { Team, PlayerId } from '@/types/game.types';

interface TrickWinInfo {
  winnerPlayerId: PlayerId;
  winnerName: string;
  winningCardId: string;
}

interface GameStore {
  // State
  engine: GameEngine | null;
  gameState: GameState | null;
  aiPlayers: AIPlayer[];
  isProcessing: boolean;
  error: string | null;
  // Reactivity
  stateVersion: number;
  // Animation state
  isAnimatingTrickWin: boolean;
  trickWinInfo: TrickWinInfo | null;
  lastCompletedTrickCards: Array<{ card: Card; playerId: string }> | null;

  // Actions
  startNewGame: (playerNames?: [string, string, string, string]) => void;
  playCard: (cardId: string) => Promise<void>;
  announceTeam: (playerId: PlayerId, team: Team) => void;
  processAITurn: () => Promise<void>;
  resetGame: () => void;
  setError: (error: string | null) => void;
  onTrickAnimationComplete: () => void;

  // Getters
  getLegalMoves: () => Card[];
  isPlayerTurn: () => boolean;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial State
  engine: null,
  gameState: null,
  aiPlayers: [],
  isProcessing: false,
  error: null,
  // Reactivity
  stateVersion: 0,
  // Animation state
  isAnimatingTrickWin: false,
  trickWinInfo: null,
  lastCompletedTrickCards: null,

  // Start new game
  startNewGame: (playerNames?) => {
    // TODO: Initialize game engine
    const engine = new GameEngine({ playerNames });
    const gameState = engine.getGameState();

    // Create AI players for non-human players
    const aiPlayers = gameState.players
      .filter(p => !p.isHuman)
      .map(p => new AIPlayer(p, AILevel.Medium));

    engine.startPlaying();

    set({
      engine,
      gameState: engine.getGameState(),
      aiPlayers,
      error: null,
      stateVersion: 0,
    });

    // If AI starts, trigger AI turn
    if (!engine.isHumanTurn()) {
      get().processAITurn();
    }
  },

  // Play a card (human or AI)
  playCard: async (cardId: string) => {
    const { engine, isProcessing, isAnimatingTrickWin } = get();

    if (!engine || isProcessing || isAnimatingTrickWin) return;

    set({ isProcessing: true, error: null });

    try {
      // Get current trick state before playing
      const stateBefore = engine.getGameState();
      const trickCardsBefore = stateBefore.currentTrick?.cards || [];

      // Save card reference BEFORE engine.playCard() removes it from the hand
      const currentPlayer = engine.getCurrentPlayer();
      const currentPlayerId = currentPlayer.id;
      const playedCardRef = currentPlayer.hand.find(c => c.id === cardId);

      // Play card through engine
      const result = engine.playCard(cardId);

      if (!result.success) {
        set({ error: result.error ?? 'Invalid move', isProcessing: false });
        return;
      }

      // Get new state after playing
      const stateAfter = engine.getGameState();

      // Check if a trick was completed (trick had 3 cards, now has 0 or 4 complete)
      const trickJustCompleted =
        trickCardsBefore.length === 3 && stateAfter.currentTrick?.size === 0;

      if (trickJustCompleted && stateAfter.completedTricks?.length > 0) {
        // Get the just-completed trick
        const completedTrick = stateAfter.completedTricks[stateAfter.completedTricks.length - 1];
        const winnerId = completedTrick.winnerId;
        const winnerPlayer = stateAfter.players.find(p => p.id === winnerId);

        // Find winning card (the card played by winner)
        const playedCard = stateBefore.currentTrick?.cards.find(
          tc => tc.playerId === cardId
        );

        // Build trick cards for animation (including the card just played)
        const trickCardsForAnimation = [
          ...trickCardsBefore,
          {
            card: playedCardRef!,
            playerId: currentPlayerId,
          },
        ];

        // Find winning card ID
        const winningCard = completedTrick.getCards().find(card => {
          const playedByWinner = completedTrick
            .getCardByPlayer(winnerId || '');
          return playedByWinner && card.id === playedByWinner.id;
        });

        set({
          gameState: stateAfter,
          isProcessing: false,
          isAnimatingTrickWin: true,
          stateVersion: get().stateVersion + 1,
          trickWinInfo: winnerId
            ? {
                winnerPlayerId: winnerId,
                winnerName: winnerPlayer?.name || 'Spieler',
                winningCardId: winningCard?.id || '',
              }
            : null,
          lastCompletedTrickCards: trickCardsForAnimation,
        });

        // Don't process AI turns yet - wait for animation to complete
        return;
      }

      // Normal play (no trick completion) - update state
      set({
        gameState: stateAfter,
        isProcessing: false,
        stateVersion: get().stateVersion + 1,
      });

      // Process AI turns if needed
      if (!engine.isHumanTurn()) {
        await get().processAITurn();
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isProcessing: false,
      });
    }
  },

  // Process AI turn
  processAITurn: async () => {
    const { engine, aiPlayers } = get();

    if (!engine) return;

    set({ isProcessing: true });

    try {
      // Process AI turns until human's turn or trick animation needed
      while (!engine.isHumanTurn() && !engine.getGameState().isGameFinished()) {
        const currentPlayer = engine.getCurrentPlayer();
        const stateBefore = engine.getGameState();
        const trickCardsBefore = stateBefore.currentTrick?.cards || [];

        // Find AI player
        const aiPlayer = aiPlayers.find(ai => ai.getPlayer().id === currentPlayer.id);

        if (!aiPlayer) {
          throw new Error('AI player not found');
        }

        // Make AI move
        const card = await aiPlayer.makeMove(stateBefore);

        if (!card) {
          throw new Error('AI could not select a card');
        }

        // Play the card
        const result = engine.playCard(card.id);

        if (!result.success) {
          throw new Error(`AI move failed: ${result.error}`);
        }

        // Get new state after playing
        const stateAfter = engine.getGameState();

        // Check if a trick was completed
        const trickJustCompleted =
          trickCardsBefore.length === 3 && stateAfter.currentTrick?.size === 0;

        if (trickJustCompleted && stateAfter.completedTricks?.length > 0) {
          // Get the just-completed trick
          const completedTrick = stateAfter.completedTricks[stateAfter.completedTricks.length - 1];
          const winnerId = completedTrick.winnerId;
          const winnerPlayer = stateAfter.players.find(p => p.id === winnerId);

          // Build trick cards for animation
          const trickCardsForAnimation = [
            ...trickCardsBefore,
            { card, playerId: currentPlayer.id },
          ];

          // Find winning card
          const winningCard = completedTrick.getCardByPlayer(winnerId || '');

          set({
            gameState: stateAfter,
            isProcessing: false,
            isAnimatingTrickWin: true,
            stateVersion: get().stateVersion + 1,
            trickWinInfo: winnerId
              ? {
                  winnerPlayerId: winnerId,
                  winnerName: winnerPlayer?.name || 'Spieler',
                  winningCardId: winningCard?.id || '',
                }
              : null,
            lastCompletedTrickCards: trickCardsForAnimation,
          });

          // Stop processing - animation callback will continue
          return;
        }

        // Update state after each AI move
        set({ gameState: stateAfter, stateVersion: get().stateVersion + 1 });

        // Small delay between AI moves for UX
        if (!engine.isHumanTurn() && !stateAfter.isGameFinished()) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'AI error',
      });
    } finally {
      set({ isProcessing: false });
    }
  },

  // Announce Re/Kontra
  announceTeam: (playerId: PlayerId, team: Team) => {
    const { engine } = get();

    if (!engine) return;

    // TODO: Handle announcement
    const result = engine.announceTeam(playerId, team);

    if (!result.success) {
      set({ error: result.error ?? 'Cannot announce' });
      return;
    }

    set({
      gameState: engine.getGameState(),
      error: null,
    });
  },

  // Reset game
  resetGame: () => {
    set({
      engine: null,
      gameState: null,
      aiPlayers: [],
      isProcessing: false,
      error: null,
      isAnimatingTrickWin: false,
      trickWinInfo: null,
      lastCompletedTrickCards: null,
      stateVersion: 0,
    });
  },

  // Called when trick win animation completes
  onTrickAnimationComplete: async () => {
    const { engine } = get();

    // Clear animation state
    set({
      isAnimatingTrickWin: false,
      trickWinInfo: null,
      lastCompletedTrickCards: null,
      stateVersion: get().stateVersion + 1,
    });

    // Continue with AI turns if needed
    if (engine && !engine.isHumanTurn() && !engine.getGameState().isGameFinished()) {
      await get().processAITurn();
    }
  },

  // Set error
  setError: (error: string | null) => {
    set({ error });
  },

  // Get legal moves for current player
  getLegalMoves: () => {
    const { engine } = get();
    if (!engine) return [];
    return engine.getLegalMovesForCurrentPlayer();
  },

  // Check if it's player's turn
  isPlayerTurn: () => {
    const { engine } = get();
    return engine?.isHumanTurn() ?? false;
  },
}));
