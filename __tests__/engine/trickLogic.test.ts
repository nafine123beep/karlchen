/**
 * Trick Logic Tests - Verify trick winner calculation
 */

import { Card } from '@/engine/models/Card';
import { Trick } from '@/engine/models/Trick';
import { calculateTrickWinner } from '@/engine/logic/trickLogic';
import { Suit, Rank } from '@/types/card.types';
import { initializeTrumpCards } from '@/engine/logic/trumpLogic';

// Helper: create a card and optionally initialize its trump status
function createCard(suit: Suit, rank: Rank, copy: 1 | 2 = 1): Card {
  const card = new Card(suit, rank, copy);
  // Initialize trump flags via trumpLogic (same as GameEngine does)
  initializeTrumpCards([card]);
  return card;
}

describe('calculateTrickWinner', () => {
  it('should return null for incomplete trick', () => {
    const trick = new Trick('player_0', 1);
    trick.addCard(createCard(Suit.HEARTS, Rank.ACE), 'player_0');

    expect(calculateTrickWinner(trick)).toBeNull();
  });

  describe('non-trump tricks (lead suit comparison)', () => {
    it('should pick highest rank of lead suit as winner', () => {
      const trick = new Trick('player_0', 1);
      trick.addCard(createCard(Suit.HEARTS, Rank.NINE), 'player_0');
      trick.addCard(createCard(Suit.HEARTS, Rank.ACE), 'player_1');
      trick.addCard(createCard(Suit.HEARTS, Rank.KING), 'player_2');
      trick.addCard(createCard(Suit.HEARTS, Rank.TEN), 'player_3');

      expect(calculateTrickWinner(trick)).toBe('player_1'); // Ace wins
    });

    it('should not let a non-lead-suit card win even if higher rank', () => {
      const trick = new Trick('player_0', 1);
      trick.addCard(createCard(Suit.HEARTS, Rank.NINE), 'player_0');
      trick.addCard(createCard(Suit.HEARTS, Rank.KING), 'player_1');
      // Spades Ace is higher rank but wrong suit
      trick.addCard(createCard(Suit.SPADES, Rank.ACE), 'player_2');
      trick.addCard(createCard(Suit.HEARTS, Rank.TEN), 'player_3');

      // player_3 (Ten of Hearts) or player_1 (King of Hearts) — Ten > King in Doppelkopf
      expect(calculateTrickWinner(trick)).toBe('player_3'); // Ten beats King
    });

    it('should not always pick the lead player', () => {
      const trick = new Trick('player_0', 1);
      trick.addCard(createCard(Suit.HEARTS, Rank.NINE), 'player_0'); // lowest
      trick.addCard(createCard(Suit.HEARTS, Rank.ACE), 'player_1'); // highest

      // Need 4 cards for complete trick
      trick.addCard(createCard(Suit.SPADES, Rank.ACE), 'player_2'); // wrong suit
      trick.addCard(createCard(Suit.SPADES, Rank.TEN), 'player_3'); // wrong suit

      expect(calculateTrickWinner(trick)).toBe('player_1'); // NOT player_0
    });
  });

  describe('trump tricks', () => {
    it('should let trump card beat non-trump', () => {
      const trick = new Trick('player_0', 1);
      trick.addCard(createCard(Suit.HEARTS, Rank.ACE), 'player_0'); // non-trump, 11pts
      trick.addCard(createCard(Suit.HEARTS, Rank.TEN), 'player_1'); // non-trump, 10pts
      // Diamond Nine is trump (lowest trump)
      trick.addCard(createCard(Suit.DIAMONDS, Rank.NINE), 'player_2'); // trump
      trick.addCard(createCard(Suit.SPADES, Rank.ACE), 'player_3'); // non-trump

      expect(calculateTrickWinner(trick)).toBe('player_2'); // Trump wins
    });

    it('should pick highest trump when multiple trumps played', () => {
      const trick = new Trick('player_0', 1);
      // Diamond Nine (trump order 11) - lowest trump
      trick.addCard(createCard(Suit.DIAMONDS, Rank.NINE), 'player_0');
      // Club Queen (trump order 0) - highest trump
      trick.addCard(createCard(Suit.CLUBS, Rank.QUEEN), 'player_1');
      // Heart Jack (trump order 6)
      trick.addCard(createCard(Suit.HEARTS, Rank.JACK), 'player_2');
      // Diamond Ace (trump order 8)
      trick.addCard(createCard(Suit.DIAMONDS, Rank.ACE), 'player_3');

      expect(calculateTrickWinner(trick)).toBe('player_1'); // Club Queen wins
    });

    it('should pick higher trump between two queens', () => {
      const trick = new Trick('player_0', 1);
      trick.addCard(createCard(Suit.DIAMONDS, Rank.QUEEN), 'player_0'); // order 3
      trick.addCard(createCard(Suit.SPADES, Rank.QUEEN), 'player_1'); // order 1
      trick.addCard(createCard(Suit.DIAMONDS, Rank.NINE), 'player_2'); // order 11
      trick.addCard(createCard(Suit.DIAMONDS, Rank.KING), 'player_3'); // order 10

      expect(calculateTrickWinner(trick)).toBe('player_1'); // Spades Queen > Diamonds Queen
    });
  });

  describe('initializeTrumpCards integration', () => {
    it('should correctly mark Queens as trump via initializeTrumpCards', () => {
      const card = new Card(Suit.CLUBS, Rank.QUEEN, 1);
      initializeTrumpCards([card]);

      expect(card.isTrump).toBe(true);
      expect(card.trumpOrder).toBe(0);
    });

    it('should correctly mark Diamonds as trump via initializeTrumpCards', () => {
      const card = new Card(Suit.DIAMONDS, Rank.ACE, 1);
      initializeTrumpCards([card]);

      expect(card.isTrump).toBe(true);
      expect(card.trumpOrder).toBe(8);
    });

    it('should NOT mark non-trump cards as trump', () => {
      const card = new Card(Suit.HEARTS, Rank.ACE, 1);
      initializeTrumpCards([card]);

      expect(card.isTrump).toBe(false);
      expect(card.trumpOrder).toBeUndefined();
    });
  });
});
