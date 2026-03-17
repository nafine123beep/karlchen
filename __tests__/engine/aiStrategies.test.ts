/**
 * AI Strategies Tests
 */

import { Card } from '@/engine/models/Card';
import { Player } from '@/engine/models/Player';
import { Trick } from '@/engine/models/Trick';
import { GameState } from '@/engine/models/GameState';
import { Suit, Rank } from '@/types/card.types';
import { Team } from '@/types/game.types';
import {
  selectCardToPlay,
  evaluateCardStrength,
  shouldAnnounce,
  selectRandomCard,
} from '@/engine/ai/aiStrategies';

/**
 * Helper: create a GameState with 4 initialized players
 */
function createGameState(): GameState {
  const gs = new GameState('test_game');
  gs.initializePlayers(['Alice', 'Bob', 'Charlie', 'Diana']);
  return gs;
}

/**
 * Helper: create a trump card with setTrump already called
 */
function makeTrump(suit: Suit, rank: Rank, copy: 1 | 2, order: number): Card {
  const card = new Card(suit, rank, copy);
  card.setTrump(order);
  return card;
}

describe('aiStrategies', () => {
  // ---------------------------------------------------------------
  // selectCardToPlay — basic edge cases
  // ---------------------------------------------------------------
  describe('selectCardToPlay', () => {
    it('should return null for an empty hand', () => {
      const gs = createGameState();
      const player = gs.players[1];
      // hand is already empty after initializePlayers (no cards dealt)
      player.hand = [];

      const result = selectCardToPlay(player, gs);
      expect(result).toBeNull();
    });

    it('should return the only card when there is exactly 1 legal move', () => {
      const gs = createGameState();
      const player = gs.players[1];

      // Lead card is a non-trump Spades Ace
      const leadCard = new Card(Suit.SPADES, Rank.ACE, 1);
      gs.currentTrick = new Trick('player_0', 1);
      gs.currentTrick.addCard(leadCard, 'player_0');

      // Player has only one Spades card (must follow suit) — a single legal move
      const spadesKing = new Card(Suit.SPADES, Rank.KING, 1);
      player.receiveCards([spadesKing]);

      const result = selectCardToPlay(player, gs);
      expect(result).not.toBeNull();
      expect(result!.id).toBe(spadesKing.id);
    });
  });

  // ---------------------------------------------------------------
  // selectCardToPlay — leading a trick
  // ---------------------------------------------------------------
  describe('selectCardToPlay when leading', () => {
    it('should prefer trump cards when leading', () => {
      const gs = createGameState();
      const player = gs.players[1];

      // Empty trick — player is leading
      gs.currentTrick = new Trick('player_1', 1);

      // Give player a mix of trump and non-trump
      const trumpCard = makeTrump(Suit.CLUBS, Rank.QUEEN, 1, 1); // Kreuz-Dame, order 1
      const nonTrumpCard = new Card(Suit.SPADES, Rank.ACE, 1); // 11 points but not trump

      player.receiveCards([nonTrumpCard, trumpCard]);

      const result = selectCardToPlay(player, gs);
      expect(result).not.toBeNull();
      expect(result!.isTrump).toBe(true);
    });

    it('should play highest trump when leading with multiple trumps', () => {
      const gs = createGameState();
      const player = gs.players[1];

      gs.currentTrick = new Trick('player_1', 1);

      const lowTrump = makeTrump(Suit.DIAMONDS, Rank.NINE, 1, 12); // order 12 (low)
      const highTrump = makeTrump(Suit.CLUBS, Rank.QUEEN, 1, 1); // order 1 (high)

      player.receiveCards([lowTrump, highTrump]);

      const result = selectCardToPlay(player, gs);
      expect(result).not.toBeNull();
      // Should select Kreuz-Dame (lowest order = highest trump)
      expect(result!.id).toBe(highTrump.id);
    });

    it('should play highest non-trump when no trump cards available', () => {
      const gs = createGameState();
      const player = gs.players[1];

      gs.currentTrick = new Trick('player_1', 1);

      const lowCard = new Card(Suit.SPADES, Rank.NINE, 1); // value 0
      const highCard = new Card(Suit.SPADES, Rank.ACE, 1); // value 11

      player.receiveCards([lowCard, highCard]);

      const result = selectCardToPlay(player, gs);
      expect(result).not.toBeNull();
      expect(result!.id).toBe(highCard.id);
    });
  });

  // ---------------------------------------------------------------
  // selectCardToPlay — following in a trick
  // ---------------------------------------------------------------
  describe('selectCardToPlay when following', () => {
    it('should play low card when partner is winning', () => {
      const gs = createGameState();

      // Set up teams: player_1 and player_3 are RE partners
      gs.players[0].team = Team.CONTRA;
      gs.players[1].team = Team.RE;
      gs.players[2].team = Team.CONTRA;
      gs.players[3].team = Team.RE;

      // Player 3 (RE) leads with a strong trump
      const leadCard = makeTrump(Suit.CLUBS, Rank.QUEEN, 1, 1);
      gs.currentTrick = new Trick('player_3', 1);
      gs.currentTrick.addCard(leadCard, 'player_3');

      // Player 0 (CONTRA) plays a weaker trump
      const contraCard = makeTrump(Suit.DIAMONDS, Rank.KING, 1, 11);
      gs.currentTrick.addCard(contraCard, 'player_0');

      // Now player_1 (RE) must follow — partner player_3 is currently winning
      const player = gs.players[1];
      const highTrump = makeTrump(Suit.SPADES, Rank.QUEEN, 1, 2); // order 2
      const lowTrump = makeTrump(Suit.DIAMONDS, Rank.NINE, 1, 12); // order 12

      player.receiveCards([highTrump, lowTrump]);

      const result = selectCardToPlay(player, gs);
      expect(result).not.toBeNull();
      // Should play the low card since partner is winning
      expect(result!.id).toBe(lowTrump.id);
    });

    it('should try to win when opponent is winning', () => {
      const gs = createGameState();

      // Teams
      gs.players[0].team = Team.CONTRA;
      gs.players[1].team = Team.RE;
      gs.players[2].team = Team.CONTRA;
      gs.players[3].team = Team.RE;

      // Player 0 (CONTRA) leads with a trump
      const leadCard = makeTrump(Suit.DIAMONDS, Rank.ACE, 1, 9);
      gs.currentTrick = new Trick('player_0', 1);
      gs.currentTrick.addCard(leadCard, 'player_0');

      // Player 1 (RE) should try to win
      const player = gs.players[1];
      const winningTrump = makeTrump(Suit.CLUBS, Rank.QUEEN, 1, 1); // can beat
      const losingTrump = makeTrump(Suit.DIAMONDS, Rank.NINE, 1, 12); // cannot beat

      player.receiveCards([losingTrump, winningTrump]);

      const result = selectCardToPlay(player, gs);
      expect(result).not.toBeNull();
      // Should attempt to win — but uses lowest winning card
      expect(result!.isTrump).toBe(true);
    });

    it('should play lowest card when unable to win', () => {
      const gs = createGameState();

      gs.players[0].team = Team.CONTRA;
      gs.players[1].team = Team.RE;
      gs.players[2].team = Team.CONTRA;
      gs.players[3].team = Team.RE;

      // Player 0 leads with highest trump (Dulle)
      const dulle = makeTrump(Suit.HEARTS, Rank.TEN, 1, 0);
      gs.currentTrick = new Trick('player_0', 1);
      gs.currentTrick.addCard(dulle, 'player_0');

      // Player 1 has only low trumps that can't beat Dulle
      const player = gs.players[1];
      const lowTrump1 = makeTrump(Suit.DIAMONDS, Rank.NINE, 1, 12);
      const lowTrump2 = makeTrump(Suit.DIAMONDS, Rank.KING, 1, 11);

      player.receiveCards([lowTrump2, lowTrump1]);

      const result = selectCardToPlay(player, gs);
      expect(result).not.toBeNull();
      // Should play the lowest trump (highest order number)
      expect(result!.id).toBe(lowTrump1.id);
    });
  });

  // ---------------------------------------------------------------
  // evaluateCardStrength
  // ---------------------------------------------------------------
  describe('evaluateCardStrength', () => {
    it('should give trump cards higher scores than non-trump', () => {
      const trumpCard = makeTrump(Suit.DIAMONDS, Rank.KING, 1, 11);
      const nonTrumpCard = new Card(Suit.SPADES, Rank.KING, 1); // value 4

      const trumpScore = evaluateCardStrength(trumpCard);
      const nonTrumpScore = evaluateCardStrength(nonTrumpCard);

      expect(trumpScore).toBeGreaterThan(nonTrumpScore);
    });

    it('should give higher trumps a higher score than lower trumps', () => {
      const highTrump = makeTrump(Suit.CLUBS, Rank.QUEEN, 1, 1); // order 1
      const lowTrump = makeTrump(Suit.DIAMONDS, Rank.NINE, 1, 12); // order 12

      const highScore = evaluateCardStrength(highTrump);
      const lowScore = evaluateCardStrength(lowTrump);

      expect(highScore).toBeGreaterThan(lowScore);
    });

    it('should score non-trump cards based on their point value', () => {
      const ace = new Card(Suit.SPADES, Rank.ACE, 1); // value 11
      const nine = new Card(Suit.SPADES, Rank.NINE, 1); // value 0

      const aceScore = evaluateCardStrength(ace);
      const nineScore = evaluateCardStrength(nine);

      expect(aceScore).toBeGreaterThan(nineScore);
    });

    it('should return specific formula values for trump cards', () => {
      // Formula: 100 - trumpOrder * 3
      const dulle = makeTrump(Suit.HEARTS, Rank.TEN, 1, 0);
      expect(evaluateCardStrength(dulle)).toBe(100);

      const kreuzDame = makeTrump(Suit.CLUBS, Rank.QUEEN, 1, 1);
      expect(evaluateCardStrength(kreuzDame)).toBe(97);
    });

    it('should return specific formula values for non-trump cards', () => {
      // Formula: value * 5
      const ace = new Card(Suit.SPADES, Rank.ACE, 1); // value 11
      expect(evaluateCardStrength(ace)).toBe(55);

      const nine = new Card(Suit.SPADES, Rank.NINE, 1); // value 0
      expect(evaluateCardStrength(nine)).toBe(0);
    });
  });

  // ---------------------------------------------------------------
  // shouldAnnounce
  // ---------------------------------------------------------------
  describe('shouldAnnounce', () => {
    it('should return true with 6+ trump cards', () => {
      const gs = createGameState();
      const player = gs.players[1];

      // Give player 6 trump cards
      player.receiveCards([
        makeTrump(Suit.CLUBS, Rank.QUEEN, 1, 1),
        makeTrump(Suit.SPADES, Rank.QUEEN, 1, 2),
        makeTrump(Suit.HEARTS, Rank.QUEEN, 1, 3),
        makeTrump(Suit.DIAMONDS, Rank.QUEEN, 1, 4),
        makeTrump(Suit.CLUBS, Rank.JACK, 1, 5),
        makeTrump(Suit.SPADES, Rank.JACK, 1, 6),
      ]);

      expect(shouldAnnounce(player, gs)).toBe(true);
    });

    it('should return true with 5+ high value cards (value >= 10)', () => {
      const gs = createGameState();
      const player = gs.players[1];

      // Give player 5 high-value non-trump cards (Aces=11, Tens=10)
      // Note: Hearts Ten is trump (Dulle), so avoid it
      player.receiveCards([
        new Card(Suit.SPADES, Rank.ACE, 1), // value 11
        new Card(Suit.SPADES, Rank.ACE, 2), // value 11
        new Card(Suit.CLUBS, Rank.ACE, 1), // value 11
        new Card(Suit.CLUBS, Rank.ACE, 2), // value 11
        new Card(Suit.HEARTS, Rank.ACE, 1), // value 11
      ]);

      expect(shouldAnnounce(player, gs)).toBe(true);
    });

    it('should return false with a weak hand', () => {
      const gs = createGameState();
      const player = gs.players[1];

      // Give player only low non-trump cards
      player.receiveCards([
        new Card(Suit.SPADES, Rank.NINE, 1), // value 0
        new Card(Suit.SPADES, Rank.KING, 1), // value 4
        new Card(Suit.HEARTS, Rank.NINE, 1), // value 0
        new Card(Suit.HEARTS, Rank.KING, 1), // value 4
      ]);

      expect(shouldAnnounce(player, gs)).toBe(false);
    });

    it('should return false with exactly 5 trumps and fewer than 5 high cards', () => {
      const gs = createGameState();
      const player = gs.players[1];

      // 5 low-value trumps (Jacks = value 2, not >= 10)
      player.receiveCards([
        makeTrump(Suit.CLUBS, Rank.JACK, 1, 5),
        makeTrump(Suit.SPADES, Rank.JACK, 1, 6),
        makeTrump(Suit.HEARTS, Rank.JACK, 1, 7),
        makeTrump(Suit.DIAMONDS, Rank.JACK, 1, 8),
        makeTrump(Suit.DIAMONDS, Rank.NINE, 1, 12),
        new Card(Suit.SPADES, Rank.NINE, 1),
      ]);

      expect(shouldAnnounce(player, gs)).toBe(false);
    });
  });

  // ---------------------------------------------------------------
  // selectRandomCard
  // ---------------------------------------------------------------
  describe('selectRandomCard', () => {
    it('should return a card from the provided array', () => {
      const cards = [
        new Card(Suit.SPADES, Rank.ACE, 1),
        new Card(Suit.HEARTS, Rank.KING, 1),
        new Card(Suit.CLUBS, Rank.NINE, 1),
      ];

      const result = selectRandomCard(cards);
      const ids = cards.map(c => c.id);
      expect(ids).toContain(result.id);
    });

    it('should return the only card when array has one element', () => {
      const card = new Card(Suit.DIAMONDS, Rank.ACE, 1);
      const result = selectRandomCard([card]);
      expect(result.id).toBe(card.id);
    });
  });
});
