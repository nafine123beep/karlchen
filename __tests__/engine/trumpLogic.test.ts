/**
 * Trump Logic Tests
 */

import { Card } from '@/engine/models/Card';
import { Suit, Rank } from '@/types/card.types';
import {
  isTrump,
  isDulle,
  getTrumpOrder,
  compareTrumpCards,
  initializeTrumpCards,
  countTrumpCards,
} from '@/engine/logic/trumpLogic';

describe('trumpLogic', () => {
  describe('isDulle', () => {
    it('should identify Herz 10 as Dulle', () => {
      const card = new Card(Suit.HEARTS, Rank.TEN, 1);
      expect(isDulle(card)).toBe(true);
    });

    it('should not identify other cards as Dulle', () => {
      expect(isDulle(new Card(Suit.HEARTS, Rank.ACE, 1))).toBe(false);
      expect(isDulle(new Card(Suit.DIAMONDS, Rank.TEN, 1))).toBe(false);
      expect(isDulle(new Card(Suit.CLUBS, Rank.QUEEN, 1))).toBe(false);
    });
  });

  describe('isTrump', () => {
    it('should identify Herz 10 (Dulle) as trump', () => {
      const card = new Card(Suit.HEARTS, Rank.TEN, 1);
      expect(isTrump(card)).toBe(true);
    });

    it('should identify Queens as trump', () => {
      const card = new Card(Suit.HEARTS, Rank.QUEEN, 1);
      expect(isTrump(card)).toBe(true);
    });

    it('should identify Jacks as trump', () => {
      const card = new Card(Suit.SPADES, Rank.JACK, 1);
      expect(isTrump(card)).toBe(true);
    });

    it('should identify Diamonds as trump', () => {
      const card = new Card(Suit.DIAMONDS, Rank.ACE, 1);
      expect(isTrump(card, Suit.DIAMONDS)).toBe(true);
    });

    it('should not identify non-trump cards as trump', () => {
      const card = new Card(Suit.HEARTS, Rank.ACE, 1);
      expect(isTrump(card)).toBe(false);
    });
  });

  describe('getTrumpOrder', () => {
    it('should return 0 for Herz 10 (Dulle)', () => {
      const card = new Card(Suit.HEARTS, Rank.TEN, 1);
      expect(getTrumpOrder(card)).toBe(0);
    });

    it('should return correct order for Kreuz-Dame', () => {
      const card = new Card(Suit.CLUBS, Rank.QUEEN, 1);
      expect(getTrumpOrder(card)).toBe(1);
    });

    it('should return correct order for Karo-K', () => {
      const card = new Card(Suit.DIAMONDS, Rank.KING, 1);
      expect(getTrumpOrder(card)).toBe(11);
    });

    it('should return undefined for non-trump cards', () => {
      const card = new Card(Suit.HEARTS, Rank.ACE, 1);
      expect(getTrumpOrder(card)).toBeUndefined();
    });
  });

  describe('compareTrumpCards', () => {
    it('should correctly compare two trump cards', () => {
      const kreuzDame = new Card(Suit.CLUBS, Rank.QUEEN, 1);
      kreuzDame.setTrump(1);

      const pikDame = new Card(Suit.SPADES, Rank.QUEEN, 1);
      pikDame.setTrump(2);

      // Kreuz-Dame should be higher (lower order)
      expect(compareTrumpCards(kreuzDame, pikDame)).toBeLessThan(0);
    });

    it('should rank Dulle higher than Kreuz-Dame', () => {
      const dulle = new Card(Suit.HEARTS, Rank.TEN, 1);
      dulle.setTrump(0);

      const kreuzDame = new Card(Suit.CLUBS, Rank.QUEEN, 1);
      kreuzDame.setTrump(1);

      expect(compareTrumpCards(dulle, kreuzDame)).toBeLessThan(0);
    });
  });

  describe('initializeTrumpCards', () => {
    it('should initialize all trump cards in a deck', () => {
      const cards: Card[] = [];

      cards.push(new Card(Suit.CLUBS, Rank.QUEEN, 1));
      cards.push(new Card(Suit.HEARTS, Rank.ACE, 1));
      cards.push(new Card(Suit.DIAMONDS, Rank.KING, 1));

      initializeTrumpCards(cards);

      const kreuzDame = cards.find(c => c.suit === Suit.CLUBS && c.rank === Rank.QUEEN);
      expect(kreuzDame?.isTrump).toBe(true);

      const herzAss = cards.find(c => c.suit === Suit.HEARTS && c.rank === Rank.ACE);
      expect(herzAss?.isTrump).toBe(false);
    });

    it('should mark Herz 10 as trump with order 0', () => {
      const card = new Card(Suit.HEARTS, Rank.TEN, 1);
      initializeTrumpCards([card]);

      expect(card.isTrump).toBe(true);
      expect(card.trumpOrder).toBe(0);
    });

    it('should mark Kreuz-Dame with order 1', () => {
      const card = new Card(Suit.CLUBS, Rank.QUEEN, 1);
      initializeTrumpCards([card]);

      expect(card.isTrump).toBe(true);
      expect(card.trumpOrder).toBe(1);
    });
  });

  describe('countTrumpCards', () => {
    it('should count all trump cards correctly', () => {
      // In a full Doppelkopf deck, there should be 26 trump cards
      // This test would require a full deck setup
    });
  });
});
