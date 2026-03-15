/**
 * Card Model Tests
 */

import { Card } from '@/engine/models/Card';
import { Suit, Rank } from '@/types/card.types';

describe('Card', () => {
  describe('constructor', () => {
    it('should create a card with correct properties', () => {
      const card = new Card(Suit.HEARTS, Rank.ACE, 1);

      expect(card.suit).toBe(Suit.HEARTS);
      expect(card.rank).toBe(Rank.ACE);
      expect(card.id).toBe('hearts_A_1');
    });

    it('should generate different ids for copy 1 and copy 2', () => {
      const card1 = new Card(Suit.CLUBS, Rank.QUEEN, 1);
      const card2 = new Card(Suit.CLUBS, Rank.QUEEN, 2);

      expect(card1.id).toBe('clubs_Q_1');
      expect(card2.id).toBe('clubs_Q_2');
      expect(card1.id).not.toBe(card2.id);
    });

    it('should calculate correct value for Ace', () => {
      const card = new Card(Suit.HEARTS, Rank.ACE, 1);
      expect(card.value).toBe(11);
    });

    it('should calculate correct value for Ten', () => {
      const card = new Card(Suit.HEARTS, Rank.TEN, 1);
      expect(card.value).toBe(10);
    });

    it('should calculate correct value for King', () => {
      const card = new Card(Suit.HEARTS, Rank.KING, 1);
      expect(card.value).toBe(4);
    });

    it('should calculate correct value for Queen', () => {
      const card = new Card(Suit.DIAMONDS, Rank.QUEEN, 1);
      expect(card.value).toBe(3);
    });

    it('should calculate correct value for Jack', () => {
      const card = new Card(Suit.HEARTS, Rank.JACK, 1);
      expect(card.value).toBe(2);
    });

    it('should calculate correct value for Nine', () => {
      const card = new Card(Suit.SPADES, Rank.NINE, 1);
      expect(card.value).toBe(0);
    });

    it('should not be trump by default', () => {
      const card = new Card(Suit.CLUBS, Rank.ACE, 1);
      expect(card.isTrump).toBe(false);
      expect(card.trumpOrder).toBeUndefined();
    });
  });

  describe('setTrump', () => {
    it('should mark card as trump', () => {
      const card = new Card(Suit.DIAMONDS, Rank.ACE, 1);
      card.setTrump(8);

      expect(card.isTrump).toBe(true);
      expect(card.trumpOrder).toBe(8);
    });

    it('should set isTrump to true', () => {
      const card = new Card(Suit.HEARTS, Rank.TEN, 1);
      expect(card.isTrump).toBe(false);

      card.setTrump(0);
      expect(card.isTrump).toBe(true);
    });

    it('should store the given trumpOrder', () => {
      const card = new Card(Suit.CLUBS, Rank.QUEEN, 1);
      card.setTrump(1);
      expect(card.trumpOrder).toBe(1);

      const card2 = new Card(Suit.DIAMONDS, Rank.NINE, 1);
      card2.setTrump(12);
      expect(card2.trumpOrder).toBe(12);
    });

    it('should allow overwriting trump order', () => {
      const card = new Card(Suit.SPADES, Rank.JACK, 1);
      card.setTrump(5);
      expect(card.trumpOrder).toBe(5);

      card.setTrump(10);
      expect(card.trumpOrder).toBe(10);
      expect(card.isTrump).toBe(true);
    });
  });

  describe('compareTo', () => {
    it('should rank Ace higher than Ten', () => {
      const ace = new Card(Suit.HEARTS, Rank.ACE, 1);
      const ten = new Card(Suit.HEARTS, Rank.TEN, 1);
      expect(ace.compareTo(ten)).toBeGreaterThan(0);
    });

    it('should rank Ten higher than King', () => {
      const ten = new Card(Suit.SPADES, Rank.TEN, 1);
      const king = new Card(Suit.SPADES, Rank.KING, 1);
      expect(ten.compareTo(king)).toBeGreaterThan(0);
    });

    it('should rank King higher than Queen', () => {
      const king = new Card(Suit.CLUBS, Rank.KING, 1);
      const queen = new Card(Suit.CLUBS, Rank.QUEEN, 1);
      expect(king.compareTo(queen)).toBeGreaterThan(0);
    });

    it('should rank Queen higher than Jack', () => {
      const queen = new Card(Suit.DIAMONDS, Rank.QUEEN, 1);
      const jack = new Card(Suit.DIAMONDS, Rank.JACK, 1);
      expect(queen.compareTo(jack)).toBeGreaterThan(0);
    });

    it('should rank Jack higher than Nine', () => {
      const jack = new Card(Suit.HEARTS, Rank.JACK, 1);
      const nine = new Card(Suit.HEARTS, Rank.NINE, 1);
      expect(jack.compareTo(nine)).toBeGreaterThan(0);
    });

    it('should return 0 for same rank', () => {
      const ace1 = new Card(Suit.HEARTS, Rank.ACE, 1);
      const ace2 = new Card(Suit.SPADES, Rank.ACE, 1);
      expect(ace1.compareTo(ace2)).toBe(0);
    });

    it('should return negative when weaker card compares to stronger', () => {
      const nine = new Card(Suit.CLUBS, Rank.NINE, 1);
      const ace = new Card(Suit.CLUBS, Rank.ACE, 1);
      expect(nine.compareTo(ace)).toBeLessThan(0);
    });

    it('should produce consistent full ordering: A > 10 > K > Q > J > 9', () => {
      const ranks = [Rank.ACE, Rank.TEN, Rank.KING, Rank.QUEEN, Rank.JACK, Rank.NINE];
      const cards = ranks.map(r => new Card(Suit.HEARTS, r, 1));

      for (let i = 0; i < cards.length - 1; i++) {
        expect(cards[i].compareTo(cards[i + 1])).toBeGreaterThan(0);
      }
    });
  });

  describe('toData and fromData', () => {
    it('should serialize and deserialize correctly', () => {
      const card = new Card(Suit.CLUBS, Rank.QUEEN, 2);
      card.setTrump(0);

      const data = card.toData();
      const restored = Card.fromData(data);

      expect(restored.suit).toBe(card.suit);
      expect(restored.rank).toBe(card.rank);
      expect(restored.isTrump).toBe(card.isTrump);
      expect(restored.trumpOrder).toBe(card.trumpOrder);
    });

    it('should round-trip a non-trump card', () => {
      const card = new Card(Suit.HEARTS, Rank.ACE, 1);
      const data = card.toData();
      const restored = Card.fromData(data);

      expect(restored.id).toBe(card.id);
      expect(restored.suit).toBe(Suit.HEARTS);
      expect(restored.rank).toBe(Rank.ACE);
      expect(restored.value).toBe(11);
      expect(restored.isTrump).toBe(false);
      expect(restored.trumpOrder).toBeUndefined();
    });

    it('should round-trip a trump card with order', () => {
      const card = new Card(Suit.DIAMONDS, Rank.KING, 2);
      card.setTrump(11);

      const data = card.toData();
      const restored = Card.fromData(data);

      expect(restored.id).toBe('diamonds_K_2');
      expect(restored.isTrump).toBe(true);
      expect(restored.trumpOrder).toBe(11);
    });

    it('should preserve copy number through serialization', () => {
      const card1 = new Card(Suit.SPADES, Rank.JACK, 1);
      const card2 = new Card(Suit.SPADES, Rank.JACK, 2);

      const restored1 = Card.fromData(card1.toData());
      const restored2 = Card.fromData(card2.toData());

      expect(restored1.id).toBe('spades_J_1');
      expect(restored2.id).toBe('spades_J_2');
    });

    it('should include all required fields in toData output', () => {
      const card = new Card(Suit.CLUBS, Rank.TEN, 1);
      const data = card.toData();

      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('suit');
      expect(data).toHaveProperty('rank');
      expect(data).toHaveProperty('value');
      expect(data).toHaveProperty('isTrump');
    });
  });

  describe('toString', () => {
    it('should return readable string representation', () => {
      const card = new Card(Suit.HEARTS, Rank.KING, 1);
      const str = card.toString();

      expect(str).toContain('K');
      expect(str).toContain('hearts');
    });

    it('should include trump marker for trump cards', () => {
      const card = new Card(Suit.CLUBS, Rank.QUEEN, 1);
      card.setTrump(0);
      const str = card.toString();

      expect(str).toContain('🔥');
    });

    it('should not include trump marker for non-trump cards', () => {
      const card = new Card(Suit.SPADES, Rank.ACE, 1);
      const str = card.toString();

      expect(str).not.toContain('🔥');
    });

    it('should contain the rank and suit', () => {
      const card = new Card(Suit.DIAMONDS, Rank.NINE, 1);
      const str = card.toString();

      expect(str).toContain('9');
      expect(str).toContain('diamonds');
    });
  });
});
