/**
 * AI Player Tests - Verify AI follows Bedienpflicht and plays randomly
 */

import { Card } from '@/engine/models/Card';
import { Player } from '@/engine/models/Player';
import { Trick } from '@/engine/models/Trick';
import { GameState } from '@/engine/models/GameState';
import { AIPlayer, AILevel } from '@/engine/ai/AIPlayer';
import { getLegalMoves } from '@/engine/logic/legalMoves';
import { Suit, Rank } from '@/types/card.types';
import { GamePhase } from '@/types/game.types';

// Remove AI thinking delay for fast tests
jest.useFakeTimers();

// Helper: create a card with optional trump flag
function createCard(suit: Suit, rank: Rank, copy: 1 | 2 = 1, trump = false): Card {
  const card = new Card(suit, rank, copy);
  if (trump) card.setTrump(0);
  return card;
}

// Helper: create a minimal GameState with a given trick and AI player hand
function createGameState(aiPlayer: Player, currentTrick: Trick): GameState {
  const state = new GameState('test_game');
  state.phase = GamePhase.PLAYING;

  // Create 4 players, AI is at index 1
  const human = new Player('player_0', 'Human', true);
  human.hand = [createCard(Suit.HEARTS, Rank.ACE)];

  state.players = [human, aiPlayer, new Player('player_2', 'Bot2'), new Player('player_3', 'Bot3')];
  state.currentPlayerIndex = 1; // AI's turn
  state.currentTrick = currentTrick;

  return state;
}

// Helper to resolve AI makeMove (which uses setTimeout internally)
async function resolveAIMove(ai: AIPlayer, gameState: GameState): Promise<Card | null> {
  const movePromise = ai.makeMove(gameState);
  jest.runAllTimers();
  return movePromise;
}

describe('AIPlayer', () => {
  afterAll(() => {
    jest.useRealTimers();
  });

  describe('obligation active - must follow suit', () => {
    it('should only play legal cards when suit obligation applies', async () => {
      // Lead: Hearts Ace
      const trick = new Trick('player_0', 1);
      trick.addCard(createCard(Suit.HEARTS, Rank.ACE), 'player_0');

      // AI has Hearts and Clubs — must play Hearts
      const heartsCard = createCard(Suit.HEARTS, Rank.NINE);
      const clubsCard = createCard(Suit.CLUBS, Rank.ACE);

      const aiPlayerModel = new Player('player_1', 'AI Bot', false);
      aiPlayerModel.hand = [heartsCard, clubsCard];

      const ai = new AIPlayer(aiPlayerModel, AILevel.Easy);
      const gameState = createGameState(aiPlayerModel, trick);

      const card = await resolveAIMove(ai, gameState);

      expect(card).not.toBeNull();
      expect(card!.id).toBe(heartsCard.id);
    });

    it('should only play trump when trump obligation applies', async () => {
      // Lead: Trump card
      const trick = new Trick('player_0', 1);
      trick.addCard(createCard(Suit.DIAMONDS, Rank.ACE, 1, true), 'player_0');

      // AI has trump and non-trump — must play trump
      const trumpCard = createCard(Suit.CLUBS, Rank.QUEEN, 1, true);
      const nonTrumpCard = createCard(Suit.HEARTS, Rank.ACE);

      const aiPlayerModel = new Player('player_1', 'AI Bot', false);
      aiPlayerModel.hand = [trumpCard, nonTrumpCard];

      const ai = new AIPlayer(aiPlayerModel, AILevel.Medium);
      const gameState = createGameState(aiPlayerModel, trick);

      const card = await resolveAIMove(ai, gameState);

      expect(card).not.toBeNull();
      expect(card!.id).toBe(trumpCard.id);
    });
  });

  describe('no obligation - any card playable', () => {
    it('should play any card when leading the trick', async () => {
      const trick = new Trick('player_1', 1); // AI leads

      const hand = [
        createCard(Suit.HEARTS, Rank.ACE),
        createCard(Suit.CLUBS, Rank.NINE),
        createCard(Suit.DIAMONDS, Rank.KING, 1, true),
      ];

      const aiPlayerModel = new Player('player_1', 'AI Bot', false);
      aiPlayerModel.hand = [...hand];

      const ai = new AIPlayer(aiPlayerModel, AILevel.Easy);
      const gameState = createGameState(aiPlayerModel, trick);

      const card = await resolveAIMove(ai, gameState);

      expect(card).not.toBeNull();
      const handIds = hand.map(c => c.id);
      expect(handIds).toContain(card!.id);
    });

    it('should play any card when player cannot follow suit', async () => {
      // Lead: Spades
      const trick = new Trick('player_0', 1);
      trick.addCard(createCard(Suit.SPADES, Rank.ACE), 'player_0');

      // AI has no Spades
      const hand = [
        createCard(Suit.HEARTS, Rank.NINE),
        createCard(Suit.CLUBS, Rank.ACE),
      ];

      const aiPlayerModel = new Player('player_1', 'AI Bot', false);
      aiPlayerModel.hand = [...hand];

      const ai = new AIPlayer(aiPlayerModel, AILevel.Hard);
      const gameState = createGameState(aiPlayerModel, trick);

      const card = await resolveAIMove(ai, gameState);

      expect(card).not.toBeNull();
      const handIds = hand.map(c => c.id);
      expect(handIds).toContain(card!.id);
    });
  });

  describe('AI never plays an illegal card', () => {
    it('should always pick from legal moves over 50 random trials', async () => {
      // Lead: Hearts
      const trick = new Trick('player_0', 1);
      trick.addCard(createCard(Suit.HEARTS, Rank.ACE), 'player_0');

      // AI has 2 Hearts and 3 non-Hearts
      const hand = [
        createCard(Suit.HEARTS, Rank.NINE),
        createCard(Suit.HEARTS, Rank.KING),
        createCard(Suit.CLUBS, Rank.ACE),
        createCard(Suit.SPADES, Rank.TEN),
        createCard(Suit.DIAMONDS, Rank.KING, 1, true),
      ];

      const legalIds = new Set(
        getLegalMoves(
          (() => { const p = new Player('p', 'P'); p.hand = [...hand]; return p; })(),
          trick,
        ).map(c => c.id),
      );

      for (let i = 0; i < 50; i++) {
        const aiPlayerModel = new Player('player_1', 'AI Bot', false);
        aiPlayerModel.hand = hand.map(c => {
          const clone = new Card(c.suit, c.rank, c.id.endsWith('_1') ? 1 : 2);
          if (c.isTrump) clone.setTrump(c.trumpOrder ?? 0);
          return clone;
        });

        const ai = new AIPlayer(aiPlayerModel, AILevel.Easy);
        const gameState = createGameState(aiPlayerModel, trick);
        const card = await resolveAIMove(ai, gameState);

        expect(card).not.toBeNull();
        expect(legalIds.has(card!.id)).toBe(true);
      }
    });
  });

  describe('all AI levels use same legal moves logic', () => {
    it.each([AILevel.Easy, AILevel.Medium, AILevel.Hard])(
      'AI level %s should respect suit obligation',
      async (level) => {
        const trick = new Trick('player_0', 1);
        trick.addCard(createCard(Suit.HEARTS, Rank.ACE), 'player_0');

        const heartsCard = createCard(Suit.HEARTS, Rank.NINE);
        const clubsCard = createCard(Suit.CLUBS, Rank.ACE);

        const aiPlayerModel = new Player('player_1', 'AI Bot', false);
        aiPlayerModel.hand = [heartsCard, clubsCard];

        const ai = new AIPlayer(aiPlayerModel, level);
        const gameState = createGameState(aiPlayerModel, trick);

        const card = await resolveAIMove(ai, gameState);

        expect(card).not.toBeNull();
        expect(card!.id).toBe(heartsCard.id);
      },
    );
  });
});
