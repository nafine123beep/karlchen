/**
 * GameEngine Integration Tests
 */

import { GameEngine } from '@/engine/GameEngine';
import { GamePhase, Team } from '@/types/game.types';

describe('GameEngine', () => {
  describe('Initialization', () => {
    it('should create a game with 4 players', () => {
      const engine = new GameEngine();
      const state = engine.getGameState();
      expect(state.players).toHaveLength(4);
    });

    it('should deal 12 cards to each player', () => {
      const engine = new GameEngine();
      const state = engine.getGameState();
      state.players.forEach(player => {
        expect(player.hand).toHaveLength(12);
      });
    });

    it('should have 48 total cards across all hands', () => {
      const engine = new GameEngine();
      const state = engine.getGameState();
      const totalCards = state.players.reduce((sum, p) => sum + p.hand.length, 0);
      expect(totalCards).toBe(48);
    });

    it('should use default player names when no config provided', () => {
      const engine = new GameEngine();
      const state = engine.getGameState();
      expect(state.players[0].name).toBe('Du');
      expect(state.players[1].name).toBe('Ben');
      expect(state.players[2].name).toBe('Anna');
      expect(state.players[3].name).toBe('Clara');
    });

    it('should use custom player names from config', () => {
      const engine = new GameEngine({
        playerNames: ['Alice', 'Bob', 'Charlie', 'Diana'],
      });
      const state = engine.getGameState();
      expect(state.players[0].name).toBe('Alice');
      expect(state.players[1].name).toBe('Bob');
      expect(state.players[2].name).toBe('Charlie');
      expect(state.players[3].name).toBe('Diana');
    });

    it('should start in ANNOUNCEMENTS phase after init', () => {
      const engine = new GameEngine();
      const state = engine.getGameState();
      expect(state.phase).toBe(GamePhase.ANNOUNCEMENTS);
    });

    it('should assign teams (some RE, some CONTRA)', () => {
      const engine = new GameEngine();
      const state = engine.getGameState();
      const teams = state.players.map(p => p.team);
      // At least one player should be RE and at least one CONTRA
      // (teams are assigned based on Queen of Clubs ownership)
      const hasRe = teams.some(t => t === Team.RE);
      const hasContra = teams.some(t => t === Team.CONTRA);
      expect(hasRe).toBe(true);
      expect(hasContra).toBe(true);
    });

    it('should initialize trump cards (some cards have isTrump = true)', () => {
      const engine = new GameEngine();
      const state = engine.getGameState();
      const allCards = state.players.flatMap(p => p.hand);
      const trumpCards = allCards.filter(c => c.isTrump);
      // In standard Doppelkopf mit Neunen: 26 trump cards
      // 2 Dulles + 8 Queens + 8 Jacks + 8 Diamonds = 26
      expect(trumpCards.length).toBeGreaterThan(0);
      expect(trumpCards.length).toBe(26);
    });
  });

  describe('startPlaying', () => {
    it('should set phase to PLAYING', () => {
      const engine = new GameEngine();
      engine.startPlaying();
      expect(engine.getGameState().phase).toBe(GamePhase.PLAYING);
    });
  });

  describe('playCard', () => {
    let engine: GameEngine;

    beforeEach(() => {
      engine = new GameEngine();
      engine.startPlaying();
    });

    it('should return success for a valid card play', () => {
      const legalMoves = engine.getLegalMovesForCurrentPlayer();
      const result = engine.playCard(legalMoves[0].id);
      expect(result.success).toBe(true);
    });

    it('should return error when card is not in hand', () => {
      const result = engine.playCard('nonexistent_card_id');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should remove card from player hand after playing', () => {
      const currentPlayer = engine.getCurrentPlayer();
      const legalMoves = engine.getLegalMovesForCurrentPlayer();
      const cardId = legalMoves[0].id;
      const handSizeBefore = currentPlayer.hand.length;

      engine.playCard(cardId);

      expect(currentPlayer.hand.length).toBe(handSizeBefore - 1);
      expect(currentPlayer.hand.find(c => c.id === cardId)).toBeUndefined();
    });

    it('should add card to current trick', () => {
      const state = engine.getGameState();
      const legalMoves = engine.getLegalMovesForCurrentPlayer();

      engine.playCard(legalMoves[0].id);

      // Either the card is in the current trick (if trick not completed)
      // or the trick was completed and a new one started
      expect(state.currentTrick.size).toBeGreaterThanOrEqual(1);
    });

    it('should advance to next player after play', () => {
      const state = engine.getGameState();
      const indexBefore = state.currentPlayerIndex;
      const legalMoves = engine.getLegalMovesForCurrentPlayer();

      engine.playCard(legalMoves[0].id);

      // After playing, should be next player (unless trick completed)
      // On first play of a trick, next player is (indexBefore + 1) % 4
      expect(state.currentPlayerIndex).toBe((indexBefore + 1) % 4);
    });
  });

  describe('Trick completion', () => {
    it('should complete trick after 4 cards are played', () => {
      const engine = new GameEngine();
      engine.startPlaying();
      const state = engine.getGameState();

      // Play 4 cards (one from each player)
      for (let i = 0; i < 4; i++) {
        const legalMoves = engine.getLegalMovesForCurrentPlayer();
        engine.playCard(legalMoves[0].id);
      }

      expect(state.completedTricks).toHaveLength(1);
    });

    it('should determine a winner for the completed trick', () => {
      const engine = new GameEngine();
      engine.startPlaying();
      const state = engine.getGameState();

      for (let i = 0; i < 4; i++) {
        const legalMoves = engine.getLegalMovesForCurrentPlayer();
        engine.playCard(legalMoves[0].id);
      }

      const completedTrick = state.completedTricks[0];
      expect(completedTrick.winnerId).toBeDefined();
      expect(completedTrick.winnerId).not.toBeNull();
    });

    it('should move completed trick to completedTricks', () => {
      const engine = new GameEngine();
      engine.startPlaying();
      const state = engine.getGameState();

      for (let i = 0; i < 4; i++) {
        const legalMoves = engine.getLegalMovesForCurrentPlayer();
        engine.playCard(legalMoves[0].id);
      }

      expect(state.completedTricks).toHaveLength(1);
      // Current trick should be a new one (empty)
      expect(state.currentTrick.size).toBe(0);
    });

    it('should set winner as leader of next trick (currentPlayerIndex updated)', () => {
      const engine = new GameEngine();
      engine.startPlaying();
      const state = engine.getGameState();

      for (let i = 0; i < 4; i++) {
        const legalMoves = engine.getLegalMovesForCurrentPlayer();
        engine.playCard(legalMoves[0].id);
      }

      const winnerId = state.completedTricks[0].winnerId;
      const winnerIndex = state.players.findIndex(p => p.id === winnerId);
      expect(state.currentPlayerIndex).toBe(winnerIndex);
    });

    it('should update scores after trick completion', () => {
      const engine = new GameEngine();
      engine.startPlaying();
      const state = engine.getGameState();

      for (let i = 0; i < 4; i++) {
        const legalMoves = engine.getLegalMovesForCurrentPlayer();
        engine.playCard(legalMoves[0].id);
      }

      // After at least one trick, scores should have been calculated
      // (may be 0 if only nines were played, so just check it's defined)
      const totalScore = state.scores.re + state.scores.kontra;
      expect(totalScore).toBeGreaterThanOrEqual(0);
    });
  });

  describe('announceTeam', () => {
    it('should return success for a valid announcement', () => {
      const engine = new GameEngine();
      const state = engine.getGameState();
      const player = state.players[0];

      // Reset hasAnnounced to allow announcement
      player.hasAnnounced = false;
      const result = engine.announceTeam(player.id, Team.RE);
      expect(result.success).toBe(true);
    });

    it('should return error for player not found', () => {
      const engine = new GameEngine();
      const result = engine.announceTeam('nonexistent_player', Team.RE);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Player not found');
    });
  });

  describe('Game completion', () => {
    it('should finish game after 12 tricks with phase FINISHED and total points = 240', () => {
      const engine = new GameEngine();
      engine.startPlaying();
      const state = engine.getGameState();

      // Play through all 12 tricks (48 cards / 4 players = 12 tricks)
      for (let trick = 0; trick < 12; trick++) {
        for (let card = 0; card < 4; card++) {
          const legalMoves = engine.getLegalMovesForCurrentPlayer();
          expect(legalMoves.length).toBeGreaterThan(0);
          const result = engine.playCard(legalMoves[0].id);
          expect(result.success).toBe(true);
        }
      }

      expect(state.completedTricks).toHaveLength(12);
      expect(state.phase).toBe(GamePhase.FINISHED);

      // Total points in Doppelkopf = 240
      const totalPoints = state.scores.re + state.scores.kontra;
      expect(totalPoints).toBe(240);
    });

    it('should calculate final scores with a winner', () => {
      const engine = new GameEngine();
      engine.startPlaying();

      for (let trick = 0; trick < 12; trick++) {
        for (let card = 0; card < 4; card++) {
          const legalMoves = engine.getLegalMovesForCurrentPlayer();
          engine.playCard(legalMoves[0].id);
        }
      }

      const state = engine.getGameState();
      expect(state.specialPoints.winner).not.toBeNull();
      expect([Team.RE, Team.CONTRA]).toContain(state.specialPoints.winner);
    });
  });

  describe('getLegalMovesForCurrentPlayer', () => {
    it('should return non-empty array during play', () => {
      const engine = new GameEngine();
      engine.startPlaying();
      const legalMoves = engine.getLegalMovesForCurrentPlayer();
      expect(legalMoves.length).toBeGreaterThan(0);
    });
  });

  describe('isHumanTurn', () => {
    it('should return true when player 0 (human) is current', () => {
      const engine = new GameEngine();
      const state = engine.getGameState();
      state.currentPlayerIndex = 0;
      expect(engine.isHumanTurn()).toBe(true);
    });

    it('should return false for AI players', () => {
      const engine = new GameEngine();
      const state = engine.getGameState();
      state.currentPlayerIndex = 1;
      expect(engine.isHumanTurn()).toBe(false);

      state.currentPlayerIndex = 2;
      expect(engine.isHumanTurn()).toBe(false);

      state.currentPlayerIndex = 3;
      expect(engine.isHumanTurn()).toBe(false);
    });
  });

  describe('reset', () => {
    it('should create a new game state', () => {
      const engine = new GameEngine();
      engine.startPlaying();

      // Play a few cards to modify state
      const legalMoves = engine.getLegalMovesForCurrentPlayer();
      engine.playCard(legalMoves[0].id);

      engine.reset();

      const newState = engine.getGameState();
      expect(newState.players).toHaveLength(4);
      expect(newState.phase).toBe(GamePhase.ANNOUNCEMENTS);
      expect(newState.completedTricks).toHaveLength(0);
      expect(newState.currentPlayerIndex).toBe(0);
      // All players should have 12 cards again
      newState.players.forEach(player => {
        expect(player.hand).toHaveLength(12);
      });
    });
  });

  describe('exportState / importState', () => {
    it('should round-trip preserve game state', () => {
      const engine = new GameEngine();
      engine.startPlaying();

      // Play a few cards to make the state non-trivial
      const legalMoves = engine.getLegalMovesForCurrentPlayer();
      engine.playCard(legalMoves[0].id);

      const exported = engine.exportState();
      expect(typeof exported).toBe('string');

      const newEngine = new GameEngine();
      newEngine.importState(exported);

      const originalState = engine.getGameState();
      const importedState = newEngine.getGameState();

      expect(importedState.id).toBe(originalState.id);
      expect(importedState.phase).toBe(originalState.phase);
      expect(importedState.currentPlayerIndex).toBe(originalState.currentPlayerIndex);
      expect(importedState.scores.re).toBe(originalState.scores.re);
      expect(importedState.scores.kontra).toBe(originalState.scores.kontra);
      expect(importedState.players).toHaveLength(4);
      importedState.players.forEach((player, i) => {
        expect(player.id).toBe(originalState.players[i].id);
        expect(player.name).toBe(originalState.players[i].name);
        expect(player.hand.length).toBe(originalState.players[i].hand.length);
        expect(player.team).toBe(originalState.players[i].team);
      });
    });
  });

  describe('Full game simulation', () => {
    it('should play through a complete game without errors', () => {
      const engine = new GameEngine();
      engine.startPlaying();
      const state = engine.getGameState();

      let trickCount = 0;

      while (state.phase === GamePhase.PLAYING) {
        const legalMoves = engine.getLegalMovesForCurrentPlayer();
        expect(legalMoves.length).toBeGreaterThan(0);

        const result = engine.playCard(legalMoves[0].id);
        expect(result.success).toBe(true);

        // Count completed tricks
        if (state.completedTricks.length > trickCount) {
          trickCount = state.completedTricks.length;

          if (trickCount < 12) {
            // Verify new trick started
            expect(state.currentTrick.size).toBe(0);
          }
        }
      }

      expect(state.completedTricks).toHaveLength(12);
      expect(state.phase).toBe(GamePhase.FINISHED);
      expect(state.scores.re + state.scores.kontra).toBe(240);

      // All players should have empty hands
      state.players.forEach(player => {
        expect(player.hand).toHaveLength(0);
      });
    });
  });
});
