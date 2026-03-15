/**
 * Deck Model Tests
 */

import { Deck } from '@/engine/models/Deck';
import { Suit, Rank } from '@/types/card.types';

describe('Deck', () => {
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck();
  });

  describe('constructor', () => {
    it('should create 48 cards', () => {
      expect(deck.size).toBe(48);
    });

    it('should contain all 4 suits', () => {
      const cards = deck.getCards();
      const suits = new Set(cards.map(c => c.suit));

      expect(suits.has(Suit.HEARTS)).toBe(true);
      expect(suits.has(Suit.DIAMONDS)).toBe(true);
      expect(suits.has(Suit.CLUBS)).toBe(true);
      expect(suits.has(Suit.SPADES)).toBe(true);
      expect(suits.size).toBe(4);
    });

    it('should contain all 6 ranks', () => {
      const cards = deck.getCards();
      const ranks = new Set(cards.map(c => c.rank));

      expect(ranks.has(Rank.NINE)).toBe(true);
      expect(ranks.has(Rank.JACK)).toBe(true);
      expect(ranks.has(Rank.QUEEN)).toBe(true);
      expect(ranks.has(Rank.KING)).toBe(true);
      expect(ranks.has(Rank.TEN)).toBe(true);
      expect(ranks.has(Rank.ACE)).toBe(true);
      expect(ranks.size).toBe(6);
    });

    it('should have 2 copies of each card', () => {
      const cards = deck.getCards();

      // For each suit+rank combination there should be exactly 2 cards
      const suits = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];
      const ranks = [Rank.NINE, Rank.JACK, Rank.QUEEN, Rank.KING, Rank.TEN, Rank.ACE];

      suits.forEach(suit => {
        ranks.forEach(rank => {
          const matching = cards.filter(c => c.suit === suit && c.rank === rank);
          expect(matching).toHaveLength(2);
        });
      });
    });
  });

  describe('deal', () => {
    it('should return 4 hands of 12 cards each', () => {
      const hands = deck.deal();

      expect(hands).toHaveLength(4);
      hands.forEach(hand => {
        expect(hand).toHaveLength(12);
      });
    });

    it('should distribute all 48 cards across the 4 hands', () => {
      const hands = deck.deal();
      const allIds = hands.flat().map(c => c.id);

      expect(allIds).toHaveLength(48);
      // All ids should be unique
      expect(new Set(allIds).size).toBe(48);
    });
  });

  describe('shuffle', () => {
    it('should change card order (probabilistic)', () => {
      const originalOrder = deck.getCards().map(c => c.id);

      deck.shuffle();
      const shuffledOrder = deck.getCards().map(c => c.id);

      // It is astronomically unlikely that all 48 cards remain in the same position
      expect(shuffledOrder).not.toEqual(originalOrder);
    });

    it('should preserve all 48 cards after shuffle', () => {
      const originalIds = new Set(deck.getCards().map(c => c.id));

      deck.shuffle();
      const shuffledIds = new Set(deck.getCards().map(c => c.id));

      expect(shuffledIds).toEqual(originalIds);
      expect(deck.size).toBe(48);
    });
  });

  describe('findCard', () => {
    it('should find an existing card by id', () => {
      const card = deck.findCard('hearts_A_1');

      expect(card).toBeDefined();
      expect(card!.suit).toBe(Suit.HEARTS);
      expect(card!.rank).toBe(Rank.ACE);
    });

    it('should return undefined for a missing card', () => {
      const result = deck.findCard('nonexistent_card_99');
      expect(result).toBeUndefined();
    });

    it('should find both copies of a card', () => {
      const copy1 = deck.findCard('clubs_Q_1');
      const copy2 = deck.findCard('clubs_Q_2');

      expect(copy1).toBeDefined();
      expect(copy2).toBeDefined();
      expect(copy1!.id).not.toBe(copy2!.id);
      expect(copy1!.suit).toBe(copy2!.suit);
      expect(copy1!.rank).toBe(copy2!.rank);
    });
  });

  describe('reset', () => {
    it('should restore deck to 48 cards after modification', () => {
      deck.shuffle();
      deck.reset();
      expect(deck.size).toBe(48);
    });

    it('should produce a fresh deck with all expected cards', () => {
      deck.shuffle();
      deck.reset();

      const cards = deck.getCards();
      const suits = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];
      const ranks = [Rank.NINE, Rank.JACK, Rank.QUEEN, Rank.KING, Rank.TEN, Rank.ACE];

      suits.forEach(suit => {
        ranks.forEach(rank => {
          const matching = cards.filter(c => c.suit === suit && c.rank === rank);
          expect(matching).toHaveLength(2);
        });
      });
    });
  });
});
