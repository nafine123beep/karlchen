/**
 * Player Model Tests
 */

import { Player } from '@/engine/models/Player';
import { Card } from '@/engine/models/Card';
import { Suit, Rank } from '@/types/card.types';
import { Team } from '@/types/game.types';

describe('Player', () => {
  let player: Player;

  beforeEach(() => {
    player = new Player('p1', 'Alice', true);
  });

  describe('constructor', () => {
    it('should create a player with correct properties', () => {
      expect(player.id).toBe('p1');
      expect(player.name).toBe('Alice');
      expect(player.isHuman).toBe(true);
      expect(player.team).toBe(Team.UNKNOWN);
      expect(player.hand).toEqual([]);
      expect(player.tricksTaken).toBe(0);
      expect(player.hasAnnounced).toBe(false);
    });

    it('should default isHuman to false', () => {
      const bot = new Player('p2', 'Bot');
      expect(bot.isHuman).toBe(false);
    });
  });

  describe('receiveCards', () => {
    it('should add cards to hand', () => {
      const cards = [new Card(Suit.HEARTS, Rank.ACE, 1), new Card(Suit.CLUBS, Rank.TEN, 1)];

      player.receiveCards(cards);
      expect(player.hand).toHaveLength(2);
      expect(player.hand[0].suit).toBe(Suit.HEARTS);
      expect(player.hand[1].suit).toBe(Suit.CLUBS);
    });

    it('should append to existing hand', () => {
      player.receiveCards([new Card(Suit.HEARTS, Rank.ACE, 1)]);
      player.receiveCards([new Card(Suit.SPADES, Rank.KING, 1)]);

      expect(player.hand).toHaveLength(2);
    });

    it('should handle empty array', () => {
      player.receiveCards([]);
      expect(player.hand).toHaveLength(0);
    });
  });

  describe('playCard', () => {
    beforeEach(() => {
      player.receiveCards([
        new Card(Suit.HEARTS, Rank.ACE, 1),
        new Card(Suit.CLUBS, Rank.QUEEN, 1),
        new Card(Suit.SPADES, Rank.TEN, 1),
      ]);
    });

    it('should remove and return the played card', () => {
      const card = player.playCard('hearts_A_1');

      expect(card).not.toBeNull();
      expect(card!.id).toBe('hearts_A_1');
      expect(player.hand).toHaveLength(2);
    });

    it('should return null for missing card', () => {
      const result = player.playCard('diamonds_9_1');
      expect(result).toBeNull();
      expect(player.hand).toHaveLength(3);
    });

    it('should not return the same card twice', () => {
      const first = player.playCard('hearts_A_1');
      expect(first).not.toBeNull();

      const second = player.playCard('hearts_A_1');
      expect(second).toBeNull();
    });
  });

  describe('hasCard', () => {
    it('should return true for a card in hand', () => {
      player.receiveCards([new Card(Suit.DIAMONDS, Rank.JACK, 1)]);
      expect(player.hasCard('diamonds_J_1')).toBe(true);
    });

    it('should return false for a card not in hand', () => {
      expect(player.hasCard('hearts_A_1')).toBe(false);
    });

    it('should return false after the card was played', () => {
      player.receiveCards([new Card(Suit.HEARTS, Rank.ACE, 1)]);
      player.playCard('hearts_A_1');
      expect(player.hasCard('hearts_A_1')).toBe(false);
    });
  });

  describe('getCardsOfSuit', () => {
    it('should return non-trump cards of the given suit', () => {
      const heartsAce = new Card(Suit.HEARTS, Rank.ACE, 1);
      const heartsKing = new Card(Suit.HEARTS, Rank.KING, 1);
      const spadesAce = new Card(Suit.SPADES, Rank.ACE, 1);

      player.receiveCards([heartsAce, heartsKing, spadesAce]);

      const heartsCards = player.getCardsOfSuit(Suit.HEARTS);
      expect(heartsCards).toHaveLength(2);
      expect(heartsCards.every(c => c.suit === Suit.HEARTS)).toBe(true);
    });

    it('should exclude trump cards of that suit', () => {
      const heartsAce = new Card(Suit.HEARTS, Rank.ACE, 1);
      const heartsTen = new Card(Suit.HEARTS, Rank.TEN, 1);
      heartsTen.setTrump(0); // Dulle is trump

      player.receiveCards([heartsAce, heartsTen]);

      const heartsCards = player.getCardsOfSuit(Suit.HEARTS);
      expect(heartsCards).toHaveLength(1);
      expect(heartsCards[0].id).toBe('hearts_A_1');
    });

    it('should return empty array when no cards of suit exist', () => {
      player.receiveCards([new Card(Suit.CLUBS, Rank.ACE, 1)]);
      expect(player.getCardsOfSuit(Suit.HEARTS)).toHaveLength(0);
    });
  });

  describe('getTrumpCards', () => {
    it('should return only trump cards', () => {
      const queen = new Card(Suit.CLUBS, Rank.QUEEN, 1);
      queen.setTrump(1);
      const ace = new Card(Suit.HEARTS, Rank.ACE, 1);

      player.receiveCards([queen, ace]);

      const trumpCards = player.getTrumpCards();
      expect(trumpCards).toHaveLength(1);
      expect(trumpCards[0].id).toBe('clubs_Q_1');
    });

    it('should return empty array when no trump cards', () => {
      player.receiveCards([
        new Card(Suit.HEARTS, Rank.ACE, 1),
        new Card(Suit.SPADES, Rank.KING, 1),
      ]);

      expect(player.getTrumpCards()).toHaveLength(0);
    });

    it('should return multiple trump cards', () => {
      const queen = new Card(Suit.CLUBS, Rank.QUEEN, 1);
      queen.setTrump(1);
      const jack = new Card(Suit.SPADES, Rank.JACK, 1);
      jack.setTrump(4);
      const dulle = new Card(Suit.HEARTS, Rank.TEN, 1);
      dulle.setTrump(0);

      player.receiveCards([queen, jack, dulle]);

      expect(player.getTrumpCards()).toHaveLength(3);
    });
  });

  describe('announceTeam', () => {
    it('should succeed on first announcement', () => {
      const result = player.announceTeam(Team.RE);
      expect(result).toBe(true);
      expect(player.team).toBe(Team.RE);
      expect(player.hasAnnounced).toBe(true);
    });

    it('should fail on second announcement', () => {
      player.announceTeam(Team.RE);
      const result = player.announceTeam(Team.CONTRA);
      expect(result).toBe(false);
      expect(player.team).toBe(Team.RE); // unchanged
    });

    it('should accept CONTRA announcement', () => {
      const result = player.announceTeam(Team.CONTRA);
      expect(result).toBe(true);
      expect(player.team).toBe(Team.CONTRA);
    });
  });

  describe('handSize', () => {
    it('should return 0 for empty hand', () => {
      expect(player.handSize).toBe(0);
    });

    it('should return correct count after receiving cards', () => {
      player.receiveCards([
        new Card(Suit.HEARTS, Rank.ACE, 1),
        new Card(Suit.CLUBS, Rank.TEN, 1),
        new Card(Suit.SPADES, Rank.NINE, 1),
      ]);
      expect(player.handSize).toBe(3);
    });

    it('should decrease after playing a card', () => {
      player.receiveCards([new Card(Suit.HEARTS, Rank.ACE, 1), new Card(Suit.CLUBS, Rank.TEN, 1)]);
      player.playCard('hearts_A_1');
      expect(player.handSize).toBe(1);
    });
  });

  describe('sortHand', () => {
    it('should put trump cards first', () => {
      const nonTrump = new Card(Suit.HEARTS, Rank.ACE, 1);
      const trump = new Card(Suit.CLUBS, Rank.QUEEN, 1);
      trump.setTrump(1);

      player.receiveCards([nonTrump, trump]);
      player.sortHand();

      expect(player.hand[0].isTrump).toBe(true);
      expect(player.hand[1].isTrump).toBe(false);
    });

    it('should sort trump cards by trumpOrder', () => {
      const jack = new Card(Suit.SPADES, Rank.JACK, 1);
      jack.setTrump(4);
      const queen = new Card(Suit.CLUBS, Rank.QUEEN, 1);
      queen.setTrump(1);
      const dulle = new Card(Suit.HEARTS, Rank.TEN, 1);
      dulle.setTrump(0);

      player.receiveCards([jack, queen, dulle]);
      player.sortHand();

      expect(player.hand[0].trumpOrder).toBe(0);
      expect(player.hand[1].trumpOrder).toBe(1);
      expect(player.hand[2].trumpOrder).toBe(4);
    });

    it('should sort non-trump cards by rank via compareTo', () => {
      const nine = new Card(Suit.HEARTS, Rank.NINE, 1);
      const ace = new Card(Suit.HEARTS, Rank.ACE, 1);
      const king = new Card(Suit.SPADES, Rank.KING, 1);

      player.receiveCards([nine, ace, king]);
      player.sortHand();

      // sortHand uses a.compareTo(b) which returns positive when a > b
      // Array.sort with (a,b) => a.compareTo(b) puts smaller first
      // so Nine, King, Ace (ascending rank strength)
      expect(player.hand[0].rank).toBe(Rank.NINE);
      expect(player.hand[1].rank).toBe(Rank.KING);
      expect(player.hand[2].rank).toBe(Rank.ACE);
    });

    it('should place all trumps before all non-trumps', () => {
      const trump1 = new Card(Suit.DIAMONDS, Rank.KING, 1);
      trump1.setTrump(11);
      const nonTrump1 = new Card(Suit.HEARTS, Rank.ACE, 1);
      const trump2 = new Card(Suit.CLUBS, Rank.QUEEN, 1);
      trump2.setTrump(1);
      const nonTrump2 = new Card(Suit.SPADES, Rank.TEN, 1);

      player.receiveCards([nonTrump1, trump1, nonTrump2, trump2]);
      player.sortHand();

      expect(player.hand[0].isTrump).toBe(true);
      expect(player.hand[1].isTrump).toBe(true);
      expect(player.hand[2].isTrump).toBe(false);
      expect(player.hand[3].isTrump).toBe(false);
    });
  });

  describe('toData and fromData', () => {
    it('should round-trip a fresh player', () => {
      const data = player.toData();
      const restored = Player.fromData(data);

      expect(restored.id).toBe('p1');
      expect(restored.name).toBe('Alice');
      expect(restored.isHuman).toBe(true);
      expect(restored.team).toBe(Team.UNKNOWN);
      expect(restored.hand).toHaveLength(0);
      expect(restored.tricksTaken).toBe(0);
      expect(restored.hasAnnounced).toBe(false);
    });

    it('should round-trip a player with cards and state', () => {
      const card = new Card(Suit.CLUBS, Rank.QUEEN, 1);
      card.setTrump(1);
      player.receiveCards([card]);
      player.announceTeam(Team.RE);
      player.tricksTaken = 3;

      const data = player.toData();
      const restored = Player.fromData(data);

      expect(restored.team).toBe(Team.RE);
      expect(restored.hand).toHaveLength(1);
      expect(restored.hand[0].isTrump).toBe(true);
      expect(restored.tricksTaken).toBe(3);
      expect(restored.hasAnnounced).toBe(true);
    });

    it('should preserve all cards through serialization', () => {
      player.receiveCards([
        new Card(Suit.HEARTS, Rank.ACE, 1),
        new Card(Suit.SPADES, Rank.NINE, 2),
        new Card(Suit.DIAMONDS, Rank.TEN, 1),
      ]);

      const restored = Player.fromData(player.toData());
      expect(restored.hand).toHaveLength(3);
      expect(restored.hand.map(c => c.id)).toEqual(['hearts_A_1', 'spades_9_2', 'diamonds_10_1']);
    });
  });
});
