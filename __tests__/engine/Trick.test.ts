/**
 * Trick Model Tests
 */

import { Trick } from '@/engine/models/Trick';
import { Card } from '@/engine/models/Card';
import { Suit, Rank } from '@/types/card.types';

describe('Trick', () => {
  let trick: Trick;

  beforeEach(() => {
    trick = new Trick('p1', 1);
  });

  describe('constructor', () => {
    it('should create a trick with correct id and lead player', () => {
      expect(trick.id).toBe('trick_1');
      expect(trick.leadPlayerId).toBe('p1');
      expect(trick.winnerId).toBeUndefined();
    });
  });

  describe('addCard', () => {
    it('should add a card and return true', () => {
      const card = new Card(Suit.HEARTS, Rank.ACE, 1);
      const result = trick.addCard(card, 'p1');
      expect(result).toBe(true);
      expect(trick.size).toBe(1);
    });

    it('should accept up to 4 cards', () => {
      expect(trick.addCard(new Card(Suit.HEARTS, Rank.ACE, 1), 'p1')).toBe(true);
      expect(trick.addCard(new Card(Suit.CLUBS, Rank.TEN, 1), 'p2')).toBe(true);
      expect(trick.addCard(new Card(Suit.SPADES, Rank.KING, 1), 'p3')).toBe(true);
      expect(trick.addCard(new Card(Suit.DIAMONDS, Rank.NINE, 1), 'p4')).toBe(true);
      expect(trick.size).toBe(4);
    });

    it('should return false on 5th card', () => {
      trick.addCard(new Card(Suit.HEARTS, Rank.ACE, 1), 'p1');
      trick.addCard(new Card(Suit.CLUBS, Rank.TEN, 1), 'p2');
      trick.addCard(new Card(Suit.SPADES, Rank.KING, 1), 'p3');
      trick.addCard(new Card(Suit.DIAMONDS, Rank.NINE, 1), 'p4');

      const result = trick.addCard(new Card(Suit.HEARTS, Rank.QUEEN, 1), 'p5');
      expect(result).toBe(false);
      expect(trick.size).toBe(4);
    });
  });

  describe('isComplete', () => {
    it('should return false when empty', () => {
      expect(trick.isComplete()).toBe(false);
    });

    it('should return false with fewer than 4 cards', () => {
      trick.addCard(new Card(Suit.HEARTS, Rank.ACE, 1), 'p1');
      trick.addCard(new Card(Suit.CLUBS, Rank.TEN, 1), 'p2');
      trick.addCard(new Card(Suit.SPADES, Rank.KING, 1), 'p3');
      expect(trick.isComplete()).toBe(false);
    });

    it('should return true after 4 cards', () => {
      trick.addCard(new Card(Suit.HEARTS, Rank.ACE, 1), 'p1');
      trick.addCard(new Card(Suit.CLUBS, Rank.TEN, 1), 'p2');
      trick.addCard(new Card(Suit.SPADES, Rank.KING, 1), 'p3');
      trick.addCard(new Card(Suit.DIAMONDS, Rank.NINE, 1), 'p4');
      expect(trick.isComplete()).toBe(true);
    });
  });

  describe('getLeadCard', () => {
    it('should return null when empty', () => {
      expect(trick.getLeadCard()).toBeNull();
    });

    it('should return the first card added', () => {
      const firstCard = new Card(Suit.HEARTS, Rank.ACE, 1);
      trick.addCard(firstCard, 'p1');
      trick.addCard(new Card(Suit.CLUBS, Rank.TEN, 1), 'p2');

      expect(trick.getLeadCard()!.id).toBe(firstCard.id);
    });
  });

  describe('getLeadSuit', () => {
    it('should return null when empty', () => {
      expect(trick.getLeadSuit()).toBeNull();
    });

    it('should return suit of first non-trump card', () => {
      const card = new Card(Suit.HEARTS, Rank.ACE, 1);
      trick.addCard(card, 'p1');

      expect(trick.getLeadSuit()).toBe(Suit.HEARTS);
    });

    it('should return null when lead card is trump', () => {
      const trumpCard = new Card(Suit.CLUBS, Rank.QUEEN, 1);
      trumpCard.setTrump(1);
      trick.addCard(trumpCard, 'p1');

      expect(trick.getLeadSuit()).toBeNull();
    });
  });

  describe('getCards', () => {
    it('should return empty array when no cards played', () => {
      expect(trick.getCards()).toEqual([]);
    });

    it('should return all cards in order', () => {
      const c1 = new Card(Suit.HEARTS, Rank.ACE, 1);
      const c2 = new Card(Suit.CLUBS, Rank.TEN, 1);
      trick.addCard(c1, 'p1');
      trick.addCard(c2, 'p2');

      const cards = trick.getCards();
      expect(cards).toHaveLength(2);
      expect(cards[0].id).toBe(c1.id);
      expect(cards[1].id).toBe(c2.id);
    });
  });

  describe('getCardByPlayer', () => {
    it('should find the correct card for a player', () => {
      const c1 = new Card(Suit.HEARTS, Rank.ACE, 1);
      const c2 = new Card(Suit.CLUBS, Rank.TEN, 1);
      trick.addCard(c1, 'p1');
      trick.addCard(c2, 'p2');

      expect(trick.getCardByPlayer('p1')!.id).toBe(c1.id);
      expect(trick.getCardByPlayer('p2')!.id).toBe(c2.id);
    });

    it('should return null for a player who has not played', () => {
      trick.addCard(new Card(Suit.HEARTS, Rank.ACE, 1), 'p1');
      expect(trick.getCardByPlayer('p3')).toBeNull();
    });
  });

  describe('getTotalValue', () => {
    it('should return 0 for empty trick', () => {
      expect(trick.getTotalValue()).toBe(0);
    });

    it('should sum card values correctly', () => {
      // Ace=11, Ten=10, King=4, Nine=0 => 25
      trick.addCard(new Card(Suit.HEARTS, Rank.ACE, 1), 'p1');
      trick.addCard(new Card(Suit.CLUBS, Rank.TEN, 1), 'p2');
      trick.addCard(new Card(Suit.SPADES, Rank.KING, 1), 'p3');
      trick.addCard(new Card(Suit.DIAMONDS, Rank.NINE, 1), 'p4');

      expect(trick.getTotalValue()).toBe(25);
    });
  });

  describe('setWinner and winnerId', () => {
    it('should be undefined initially', () => {
      expect(trick.winnerId).toBeUndefined();
    });

    it('should set the winner', () => {
      trick.setWinner('p3');
      expect(trick.winnerId).toBe('p3');
    });
  });

  describe('size', () => {
    it('should return 0 for empty trick', () => {
      expect(trick.size).toBe(0);
    });

    it('should increment as cards are added', () => {
      trick.addCard(new Card(Suit.HEARTS, Rank.ACE, 1), 'p1');
      expect(trick.size).toBe(1);

      trick.addCard(new Card(Suit.CLUBS, Rank.TEN, 1), 'p2');
      expect(trick.size).toBe(2);
    });
  });

  describe('toData and fromData', () => {
    it('should round-trip a trick with cards and winner', () => {
      const c1 = new Card(Suit.HEARTS, Rank.ACE, 1);
      const c2 = new Card(Suit.CLUBS, Rank.TEN, 1);
      const c3 = new Card(Suit.SPADES, Rank.KING, 1);
      const c4 = new Card(Suit.DIAMONDS, Rank.NINE, 1);

      trick.addCard(c1, 'p1');
      trick.addCard(c2, 'p2');
      trick.addCard(c3, 'p3');
      trick.addCard(c4, 'p4');
      trick.setWinner('p1');

      const data = trick.toData();

      // Build cardLookup from original cards
      const cardLookup = new Map<string, Card>();
      [c1, c2, c3, c4].forEach(c => cardLookup.set(c.id, c));

      const restored = Trick.fromData(data, cardLookup);

      expect(restored.id).toBe('trick_1');
      expect(restored.leadPlayerId).toBe('p1');
      expect(restored.winnerId).toBe('p1');
      expect(restored.size).toBe(4);
      expect(restored.getCards().map(c => c.id)).toEqual([c1.id, c2.id, c3.id, c4.id]);
    });

    it('should round-trip an empty trick', () => {
      const data = trick.toData();
      const cardLookup = new Map<string, Card>();
      const restored = Trick.fromData(data, cardLookup);

      expect(restored.id).toBe('trick_1');
      expect(restored.leadPlayerId).toBe('p1');
      expect(restored.size).toBe(0);
      expect(restored.winnerId).toBeUndefined();
    });

    it('should include card ids and player ids in serialized data', () => {
      const card = new Card(Suit.HEARTS, Rank.ACE, 1);
      trick.addCard(card, 'p1');

      const data = trick.toData();
      expect(data.cards).toHaveLength(1);
      expect(data.cards[0].cardId).toBe(card.id);
      expect(data.cards[0].playerId).toBe('p1');
    });
  });
});
