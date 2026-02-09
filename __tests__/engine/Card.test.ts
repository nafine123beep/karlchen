/**
 * Card Model Tests
 * TODO: Implement comprehensive tests for Card class
 */

import { Card } from '@/engine/models/Card';
import { Suit, Rank } from '@/types/card.types';

describe('Card', () => {
  describe('constructor', () => {
    it('should create a card with correct properties', () => {
      // TODO: Implement test
      const card = new Card(Suit.HEARTS, Rank.ACE, 1);

      expect(card.suit).toBe(Suit.HEARTS);
      expect(card.rank).toBe(Rank.ACE);
      expect(card.id).toBe('hearts_A_1');
    });

    it('should calculate correct value for Ace', () => {
      const card = new Card(Suit.HEARTS, Rank.ACE, 1);
      expect(card.value).toBe(11);
    });

    it('should calculate correct value for Ten', () => {
      const card = new Card(Suit.HEARTS, Rank.TEN, 1);
      expect(card.value).toBe(10);
    });

    it('should calculate correct value for Jack', () => {
      const card = new Card(Suit.HEARTS, Rank.JACK, 1);
      expect(card.value).toBe(2);
    });
  });

  describe('setTrump', () => {
    it('should mark card as trump', () => {
      // TODO: Implement test
      const card = new Card(Suit.DIAMONDS, Rank.ACE, 1);
      card.setTrump(8);

      expect(card.isTrump).toBe(true);
      expect(card.trumpOrder).toBe(8);
    });
  });

  describe('toData and fromData', () => {
    it('should serialize and deserialize correctly', () => {
      // TODO: Implement test
      const card = new Card(Suit.CLUBS, Rank.QUEEN, 2);
      card.setTrump(0);

      const data = card.toData();
      const restored = Card.fromData(data);

      expect(restored.suit).toBe(card.suit);
      expect(restored.rank).toBe(card.rank);
      expect(restored.isTrump).toBe(card.isTrump);
      expect(restored.trumpOrder).toBe(card.trumpOrder);
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
  });
});
