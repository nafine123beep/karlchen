/**
 * HintEngine Integration Test
 * Tests that hint triggers fire correctly with realistic game data
 */

import { Card } from '@/engine/models/Card';
import { Trick } from '@/engine/models/Trick';
import { Suit, Rank } from '@/types/card.types';
import { Team } from '@/types/game.types';
import { HintContext } from '@/types/hint.types';
import { initializeTrumpCards } from '@/engine/logic/trumpLogic';
import { getHint } from '@/engine/hints/HintEngine';
import { checkTrumpBeatsSuit } from '@/engine/hints/triggers/trumpBeatsSuit';
import { checkSaveHighTrumps } from '@/engine/hints/triggers/saveHighTrumps';
import { checkFoxProtection } from '@/engine/hints/triggers/foxProtection';
import { checkEyesManagement } from '@/engine/hints/triggers/eyesManagement';
import { checkKarlchenLateGame } from '@/engine/hints/triggers/karlchenLateGame';
import { checkFollowSuitOrTrump } from '@/engine/hints/triggers/followSuitOrTrump';
import { useHintsStore } from '@/store/hintsStore';

// Helper to create a card and set its trump status
function makeCard(suit: Suit, rank: Rank, copy: 1 | 2 = 1): Card {
  const card = new Card(suit, rank, copy);
  // Initialize trump using the same logic as the game
  const cards = [card];
  initializeTrumpCards(cards);
  return card;
}

function makeContext(overrides: Partial<HintContext>): HintContext {
  return {
    selectedCard: makeCard(Suit.SPADES, Rank.ACE),
    playerHand: [],
    currentTrick: new Trick('player_0', 1),
    legalMoves: [],
    completedTricks: [],
    trickIndex: 0,
    playerTeam: Team.RE,
    announcements: { re: false, kontra: false },
    ...overrides,
  };
}

describe('HintEngine - Trigger Tests', () => {
  beforeEach(() => {
    useHintsStore.getState().resetForNewGame();
  });

  describe('EYES_MANAGEMENT', () => {
    it('fires when discarding high-value card into losing trick', () => {
      // Scenario: Spades led, someone trumped, player must follow Spades
      // Player has Spades Ace (11 pts) and Spades 9 (0 pts)
      const spadesAce = makeCard(Suit.SPADES, Rank.ACE);
      const spades9 = makeCard(Suit.SPADES, Rank.NINE);
      const spadesKing = makeCard(Suit.SPADES, Rank.KING);
      const clubsQueen = makeCard(Suit.CLUBS, Rank.QUEEN); // Highest trump

      // Trick: Spades King led, then trumped by Clubs Queen
      const trick = new Trick('player_1', 1);
      trick.addCard(spadesKing, 'player_1');
      trick.addCard(clubsQueen, 'player_2');

      const context = makeContext({
        selectedCard: spadesAce, // Player selecting high-value card
        playerHand: [spadesAce, spades9, makeCard(Suit.HEARTS, Rank.JACK)],
        currentTrick: trick,
        legalMoves: [spadesAce, spades9], // Must follow Spades
      });

      const hint = checkEyesManagement(context);
      expect(hint).not.toBeNull();
      expect(hint!.id).toBe('EYES_MANAGEMENT');
    });

    it('does not fire when player can win the trick', () => {
      const spadesAce = makeCard(Suit.SPADES, Rank.ACE);
      const spades9 = makeCard(Suit.SPADES, Rank.NINE);

      // Trick: Spades 9 led, no trump yet
      const trick = new Trick('player_1', 1);
      trick.addCard(spades9, 'player_1');

      const context = makeContext({
        selectedCard: spadesAce,
        playerHand: [spadesAce],
        currentTrick: trick,
        legalMoves: [spadesAce],
      });

      const hint = checkEyesManagement(context);
      expect(hint).toBeNull();
    });

    it('does not fire when leading', () => {
      const spadesAce = makeCard(Suit.SPADES, Rank.ACE);
      const trick = new Trick('player_0', 1);

      const context = makeContext({
        selectedCard: spadesAce,
        playerHand: [spadesAce],
        currentTrick: trick,
        legalMoves: [spadesAce],
      });

      const hint = checkEyesManagement(context);
      expect(hint).toBeNull();
    });
  });

  describe('TRUMP_BEATS_SUIT', () => {
    it('fires when playing non-trump while trump is winning', () => {
      // Scenario: Spades led, someone trumped, player can't follow suit
      // Player has Spades 9 and also trump, selects Spades 9
      const spades9 = makeCard(Suit.SPADES, Rank.NINE);
      const clubsJack = makeCard(Suit.CLUBS, Rank.JACK); // Trump
      const heartsJack = makeCard(Suit.HEARTS, Rank.JACK); // Trump in hand
      const spadesKing = makeCard(Suit.SPADES, Rank.KING);

      // Trick: Spades King led, then trumped
      const trick = new Trick('player_1', 1);
      trick.addCard(spadesKing, 'player_1');
      trick.addCard(clubsJack, 'player_2');

      const context = makeContext({
        selectedCard: spades9, // Non-trump
        playerHand: [spades9, heartsJack], // Has trump in hand
        currentTrick: trick,
        legalMoves: [spades9, heartsJack], // Can play anything (no Spades suit cards forced)
      });

      const hint = checkTrumpBeatsSuit(context);
      expect(hint).not.toBeNull();
      expect(hint!.id).toBe('TRUMP_BEATS_SUIT');
    });

    it('does not fire when selected card is trump', () => {
      const heartsJack = makeCard(Suit.HEARTS, Rank.JACK); // Trump
      const spadesKing = makeCard(Suit.SPADES, Rank.KING);
      const clubsJack = makeCard(Suit.CLUBS, Rank.JACK);

      const trick = new Trick('player_1', 1);
      trick.addCard(spadesKing, 'player_1');
      trick.addCard(clubsJack, 'player_2');

      const context = makeContext({
        selectedCard: heartsJack,
        playerHand: [heartsJack],
        currentTrick: trick,
        legalMoves: [heartsJack],
      });

      const hint = checkTrumpBeatsSuit(context);
      expect(hint).toBeNull();
    });
  });

  describe('SAVE_HIGH_TRUMPS', () => {
    it('fires when using high trump unnecessarily', () => {
      // Player plays Clubs Queen (order 0) but Diamonds Jack (order 7) would also win
      const clubsQueen = makeCard(Suit.CLUBS, Rank.QUEEN); // order 0
      const diamondsJack = makeCard(Suit.DIAMONDS, Rank.JACK); // order 7
      const diamondsNine = makeCard(Suit.DIAMONDS, Rank.NINE); // order 11 (lowest trump)

      // Trick: Diamonds Nine led (trump)
      const trick = new Trick('player_1', 1);
      trick.addCard(diamondsNine, 'player_1');

      const context = makeContext({
        selectedCard: clubsQueen,
        playerHand: [clubsQueen, diamondsJack],
        currentTrick: trick,
        legalMoves: [clubsQueen, diamondsJack],
      });

      const hint = checkSaveHighTrumps(context);
      expect(hint).not.toBeNull();
      expect(hint!.id).toBe('SAVE_HIGH_TRUMPS');
    });
  });

  describe('FOX_PROTECTION', () => {
    it('fires when playing Diamond Ace into losing trick', () => {
      const diamondAce = makeCard(Suit.DIAMONDS, Rank.ACE); // Fox (trump, order 8)
      const clubsQueen = makeCard(Suit.CLUBS, Rank.QUEEN); // Higher trump (order 0)
      const diamondsNine = makeCard(Suit.DIAMONDS, Rank.NINE);

      // Trick: Diamonds Nine led (trump), then Clubs Queen played
      const trick = new Trick('player_1', 1);
      trick.addCard(diamondsNine, 'player_1');
      trick.addCard(clubsQueen, 'player_2');

      const context = makeContext({
        selectedCard: diamondAce,
        playerHand: [diamondAce],
        currentTrick: trick,
        legalMoves: [diamondAce],
      });

      const hint = checkFoxProtection(context);
      expect(hint).not.toBeNull();
      expect(hint!.id).toBe('FOX_PROTECTION');
    });
  });

  describe('KARLCHEN_LATE_GAME', () => {
    it('fires in trick 11 when holding Club Jack', () => {
      const spadesAce = makeCard(Suit.SPADES, Rank.ACE);
      const clubsJack = makeCard(Suit.CLUBS, Rank.JACK);

      const context = makeContext({
        selectedCard: spadesAce,
        playerHand: [spadesAce, clubsJack],
        trickIndex: 11,
      });

      const hint = checkKarlchenLateGame(context);
      expect(hint).not.toBeNull();
      expect(hint!.id).toBe('KARLCHEN_LATE_GAME');
    });

    it('does not fire before trick 10', () => {
      const spadesAce = makeCard(Suit.SPADES, Rank.ACE);
      const clubsJack = makeCard(Suit.CLUBS, Rank.JACK);

      const context = makeContext({
        selectedCard: spadesAce,
        playerHand: [spadesAce, clubsJack],
        trickIndex: 5,
      });

      const hint = checkKarlchenLateGame(context);
      expect(hint).toBeNull();
    });
  });

  describe('FOLLOW_SUIT_OR_TRUMP', () => {
    it('fires when card is not in legal moves', () => {
      const spadesAce = makeCard(Suit.SPADES, Rank.ACE);
      const heartsKing = makeCard(Suit.HEARTS, Rank.KING);
      const heartsNine = makeCard(Suit.HEARTS, Rank.NINE);

      // Hearts led, player has Hearts but tries to play Spades Ace
      const trick = new Trick('player_1', 1);
      trick.addCard(heartsKing, 'player_1');

      const context = makeContext({
        selectedCard: spadesAce, // Not in legal moves
        playerHand: [spadesAce, heartsNine],
        currentTrick: trick,
        legalMoves: [heartsNine], // Must follow Hearts
      });

      const hint = checkFollowSuitOrTrump(context);
      expect(hint).not.toBeNull();
      expect(hint!.id).toBe('FOLLOW_SUIT_OR_TRUMP');
    });
  });

  describe('getHint integration', () => {
    it('returns first applicable hint through suppression', () => {
      const spadesAce = makeCard(Suit.SPADES, Rank.ACE);
      const spades9 = makeCard(Suit.SPADES, Rank.NINE);
      const spadesKing = makeCard(Suit.SPADES, Rank.KING);
      const clubsQueen = makeCard(Suit.CLUBS, Rank.QUEEN);

      const trick = new Trick('player_1', 1);
      trick.addCard(spadesKing, 'player_1');
      trick.addCard(clubsQueen, 'player_2');

      const context = makeContext({
        selectedCard: spadesAce,
        playerHand: [spadesAce, spades9],
        currentTrick: trick,
        legalMoves: [spadesAce, spades9],
      });

      const hint = getHint(context);
      expect(hint).not.toBeNull();
      expect(hint!.id).toBe('EYES_MANAGEMENT');
    });

    it('returns null when leading (no hints for leading)', () => {
      const spadesAce = makeCard(Suit.SPADES, Rank.ACE);
      const trick = new Trick('player_0', 1);

      const context = makeContext({
        selectedCard: spadesAce,
        playerHand: [spadesAce],
        currentTrick: trick,
        legalMoves: [spadesAce],
      });

      const hint = getHint(context);
      expect(hint).toBeNull();
    });
  });
});
