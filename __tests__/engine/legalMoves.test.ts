/**
 * Legal Moves Tests - Bedienpflicht (must-follow-suit) logic
 */

import { Card } from '@/engine/models/Card';
import { Player } from '@/engine/models/Player';
import { Trick } from '@/engine/models/Trick';
import { getLegalMoves, isLegalMove, mustFollowSuit } from '@/engine/logic/legalMoves';
import { Suit, Rank } from '@/types/card.types';

// Helper: create a card with optional trump flag
function createCard(suit: Suit, rank: Rank, copy: 1 | 2 = 1, trump = false): Card {
  const card = new Card(suit, rank, copy);
  if (trump) card.setTrump(0);
  return card;
}

// Helper: create a player with a given hand
function createPlayer(hand: Card[], id = 'player_0'): Player {
  const player = new Player(id, 'Test', false);
  player.hand = hand;
  return player;
}

describe('getLegalMoves', () => {
  describe('first card of trick (no obligation)', () => {
    it('should return all cards when trick is empty', () => {
      const hand = [
        createCard(Suit.HEARTS, Rank.ACE),
        createCard(Suit.CLUBS, Rank.NINE),
        createCard(Suit.DIAMONDS, Rank.KING, 1, true),
      ];
      const player = createPlayer(hand);
      const trick = new Trick('player_0', 1);

      const moves = getLegalMoves(player, trick);

      expect(moves).toHaveLength(3);
    });
  });

  describe('must follow suit (Bedienpflicht)', () => {
    it('should return only matching suit cards when player has them', () => {
      // Lead card: Hearts Ace (non-trump)
      const trick = new Trick('player_1', 1);
      const leadCard = createCard(Suit.HEARTS, Rank.ACE);
      trick.addCard(leadCard, 'player_1');

      // Hand has Hearts and Clubs
      const heartsCard = createCard(Suit.HEARTS, Rank.NINE);
      const clubsCard = createCard(Suit.CLUBS, Rank.ACE);
      const player = createPlayer([heartsCard, clubsCard]);

      const moves = getLegalMoves(player, trick);

      expect(moves).toHaveLength(1);
      expect(moves[0].id).toBe(heartsCard.id);
    });

    it('should return all cards when player has no matching suit', () => {
      // Lead card: Hearts Ace (non-trump)
      const trick = new Trick('player_1', 1);
      const leadCard = createCard(Suit.HEARTS, Rank.ACE);
      trick.addCard(leadCard, 'player_1');

      // Hand has only Clubs and Spades (no Hearts, no trumps)
      const hand = [
        createCard(Suit.CLUBS, Rank.ACE),
        createCard(Suit.SPADES, Rank.NINE),
      ];
      const player = createPlayer(hand);

      const moves = getLegalMoves(player, trick);

      expect(moves).toHaveLength(2);
    });
  });

  describe('must follow trump', () => {
    it('should return only trump cards when trump was led and player has trumps', () => {
      // Lead card: a trump card
      const trick = new Trick('player_1', 1);
      const leadCard = createCard(Suit.DIAMONDS, Rank.ACE, 1, true);
      trick.addCard(leadCard, 'player_1');

      // Hand has trump and non-trump
      const trumpCard = createCard(Suit.CLUBS, Rank.QUEEN, 1, true);
      const nonTrumpCard = createCard(Suit.HEARTS, Rank.ACE);
      const player = createPlayer([trumpCard, nonTrumpCard]);

      const moves = getLegalMoves(player, trick);

      expect(moves).toHaveLength(1);
      expect(moves[0].id).toBe(trumpCard.id);
    });

    it('should return all cards when trump was led but player has no trumps', () => {
      // Lead card: a trump card
      const trick = new Trick('player_1', 1);
      const leadCard = createCard(Suit.DIAMONDS, Rank.ACE, 1, true);
      trick.addCard(leadCard, 'player_1');

      // Hand has no trump cards
      const hand = [
        createCard(Suit.HEARTS, Rank.ACE),
        createCard(Suit.CLUBS, Rank.NINE),
      ];
      const player = createPlayer(hand);

      const moves = getLegalMoves(player, trick);

      expect(moves).toHaveLength(2);
    });
  });

  describe('edge case: no matching cards', () => {
    it('should return all cards when player cannot follow suit', () => {
      // Lead: Spades
      const trick = new Trick('player_1', 1);
      const leadCard = createCard(Suit.SPADES, Rank.ACE);
      trick.addCard(leadCard, 'player_1');

      // Hand: only Hearts and trump
      const hand = [
        createCard(Suit.HEARTS, Rank.NINE),
        createCard(Suit.DIAMONDS, Rank.QUEEN, 1, true),
      ];
      const player = createPlayer(hand);

      const moves = getLegalMoves(player, trick);

      expect(moves).toHaveLength(2);
    });
  });
});

describe('isLegalMove', () => {
  it('should return true for a legal card', () => {
    const trick = new Trick('player_0', 1); // empty trick
    const card = createCard(Suit.HEARTS, Rank.ACE);
    const player = createPlayer([card]);

    expect(isLegalMove(card, player, trick)).toBe(true);
  });

  it('should return false for an illegal card when obligation is active', () => {
    const trick = new Trick('player_1', 1);
    trick.addCard(createCard(Suit.HEARTS, Rank.ACE), 'player_1');

    const heartsCard = createCard(Suit.HEARTS, Rank.NINE);
    const clubsCard = createCard(Suit.CLUBS, Rank.ACE);
    const player = createPlayer([heartsCard, clubsCard]);

    // Clubs card is illegal when Hearts was led and player has Hearts
    expect(isLegalMove(clubsCard, player, trick)).toBe(false);
    expect(isLegalMove(heartsCard, player, trick)).toBe(true);
  });
});

describe('mustFollowSuit', () => {
  it('should return true when obligation restricts playable cards', () => {
    const trick = new Trick('player_1', 1);
    trick.addCard(createCard(Suit.HEARTS, Rank.ACE), 'player_1');

    const player = createPlayer([
      createCard(Suit.HEARTS, Rank.NINE),
      createCard(Suit.CLUBS, Rank.ACE),
    ]);

    expect(mustFollowSuit(player, trick)).toBe(true);
  });

  it('should return false when no obligation applies (first card)', () => {
    const trick = new Trick('player_0', 1);
    const player = createPlayer([
      createCard(Suit.HEARTS, Rank.NINE),
      createCard(Suit.CLUBS, Rank.ACE),
    ]);

    expect(mustFollowSuit(player, trick)).toBe(false);
  });

  it('should return false when player has no matching suit', () => {
    const trick = new Trick('player_1', 1);
    trick.addCard(createCard(Suit.SPADES, Rank.ACE), 'player_1');

    // No spades in hand
    const player = createPlayer([
      createCard(Suit.HEARTS, Rank.NINE),
      createCard(Suit.CLUBS, Rank.ACE),
    ]);

    expect(mustFollowSuit(player, trick)).toBe(false);
  });
});
