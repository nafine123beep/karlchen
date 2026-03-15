/**
 * Score Logic Tests
 */

import { Card } from '@/engine/models/Card';
import { Player } from '@/engine/models/Player';
import { Trick } from '@/engine/models/Trick';
import { GameState } from '@/engine/models/GameState';
import { Suit, Rank } from '@/types/card.types';
import { Team } from '@/types/game.types';
import {
  calculateFinalScore,
  calculateTeamPoints,
  validateTotalPoints,
  calculateCurrentScore,
  getPointsNeededToWin,
  isGameDecided,
  detectFoxCatch,
  detectKarlchen,
  detectKarlchenCaught,
  detectFoxLastTrick,
  detectDoppelkopfTrick,
  hasTeamAnnounced,
} from '@/engine/logic/scoreLogic';

// ---- helpers ----

function createGameState(): GameState {
  const gs = new GameState('test_game');
  gs.initializePlayers(['Alice', 'Bob', 'Charlie', 'Diana']);
  // Default teams: players 0,1 = RE, players 2,3 = CONTRA
  gs.players[0].team = Team.RE;
  gs.players[1].team = Team.RE;
  gs.players[2].team = Team.CONTRA;
  gs.players[3].team = Team.CONTRA;
  return gs;
}

/**
 * Pick cards summing to exactly `target` points.
 * Available card values: 11 (Ace), 10 (Ten), 4 (King), 3 (Queen), 2 (Jack), 0 (Nine).
 * Returns an array of values, or null if not representable.
 * Uses dynamic programming to find an exact combination of `count` cards.
 */
function pickCardValues(target: number, count: number): number[] | null {
  const values = [11, 10, 4, 3, 2, 0];

  function solve(remaining: number, cardsLeft: number): number[] | null {
    if (cardsLeft === 0) return remaining === 0 ? [] : null;
    for (const v of values) {
      if (v <= remaining || v === 0) {
        const rest = solve(remaining - v, cardsLeft - 1);
        if (rest !== null) return [v, ...rest];
      }
    }
    return null;
  }

  return solve(target, count);
}

/** Map a point value back to a Rank */
function rankForValue(value: number): Rank {
  switch (value) {
    case 11: return Rank.ACE;
    case 10: return Rank.TEN;
    case 4: return Rank.KING;
    case 3: return Rank.QUEEN;
    case 2: return Rank.JACK;
    default: return Rank.NINE;
  }
}

/**
 * Build a game state where RE has exactly `rePoints` and CONTRA has exactly `kontraPoints`.
 * Works by building tricks of 4 cards each, choosing card values that sum to the needed amount.
 */
function createExactScoredGame(rePoints: number, kontraPoints: number): GameState {
  const gs = createGameState();
  let trickNum = 1;
  const suits = [Suit.SPADES, Suit.HEARTS, Suit.CLUBS, Suit.DIAMONDS];

  function addTricksForTeam(totalPoints: number, winnerId: string): void {
    let remaining = totalPoints;

    while (remaining > 0) {
      // Try to fill a 4-card trick with exactly `min(remaining, 44)` points
      // Max per trick = 4 * 11 = 44
      let target = Math.min(remaining, 44);
      let cardValues = pickCardValues(target, 4);

      // If we can't make it exactly, try smaller targets
      while (!cardValues && target > 0) {
        target--;
        cardValues = pickCardValues(target, 4);
      }

      if (!cardValues || target === 0) {
        // Shouldn't happen for valid Doppelkopf point totals, but safety net
        break;
      }

      const trick = new Trick(winnerId, trickNum);
      const copy = (trickNum % 2 === 0 ? 1 : 2) as 1 | 2;
      cardValues.forEach((val, i) => {
        trick.addCard(new Card(suits[i], rankForValue(val), copy), `player_${i}`);
      });
      trick.setWinner(winnerId);
      gs.completedTricks.push(trick);

      remaining -= target;
      trickNum++;
      if (trickNum > 50) break; // safety
    }
  }

  addTricksForTeam(rePoints, 'player_0');
  addTricksForTeam(kontraPoints, 'player_2');

  return gs;
}

describe('scoreLogic', () => {
  // ----------------------------------------------------------------
  // 1. calculateFinalScore
  // ----------------------------------------------------------------
  describe('calculateFinalScore', () => {
    it('should declare RE winner when RE has more points (150-90)', () => {
      const gs = createExactScoredGame(150, 90);
      const score = calculateFinalScore(gs);

      expect(score.rePoints).toBe(150);
      expect(score.kontraPoints).toBe(90);
      expect(score.winner).toBe(Team.RE);
      expect(score.winMargin).toBe(60);
    });

    it('should declare KONTRA winner when KONTRA has more points (100-140)', () => {
      const gs = createExactScoredGame(100, 140);
      const score = calculateFinalScore(gs);

      expect(score.rePoints).toBe(100);
      expect(score.kontraPoints).toBe(140);
      expect(score.winner).toBe(Team.CONTRA);
      expect(score.winMargin).toBe(40);
    });

    it('should declare KONTRA winner on a 120-120 tie', () => {
      const gs = createExactScoredGame(120, 120);
      const score = calculateFinalScore(gs);

      expect(score.rePoints).toBe(120);
      expect(score.kontraPoints).toBe(120);
      // At 120-120, rePoints is NOT > kontraPoints, so CONTRA wins
      expect(score.winner).toBe(Team.CONTRA);
      expect(score.winMargin).toBe(0);
    });

    it('should declare RE winner at 121-119', () => {
      const gs = createExactScoredGame(121, 119);
      const score = calculateFinalScore(gs);

      expect(score.winner).toBe(Team.RE);
      expect(score.winMargin).toBe(2);
    });
  });

  // ----------------------------------------------------------------
  // 2. calculateTeamPoints
  // ----------------------------------------------------------------
  describe('calculateTeamPoints', () => {
    it('should sum points from completed tricks by team', () => {
      const gs = createGameState();

      // Trick 1: 4 Aces = 44 pts, won by RE (player_0)
      const trick1 = new Trick('player_0', 1);
      trick1.addCard(new Card(Suit.SPADES, Rank.ACE, 1), 'player_0');
      trick1.addCard(new Card(Suit.HEARTS, Rank.ACE, 1), 'player_1');
      trick1.addCard(new Card(Suit.CLUBS, Rank.ACE, 1), 'player_2');
      trick1.addCard(new Card(Suit.DIAMONDS, Rank.ACE, 1), 'player_3');
      trick1.setWinner('player_0');
      gs.completedTricks.push(trick1);

      // Trick 2: 4 Nines = 0 pts, won by CONTRA (player_2)
      const trick2 = new Trick('player_2', 2);
      trick2.addCard(new Card(Suit.SPADES, Rank.NINE, 1), 'player_0');
      trick2.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_1');
      trick2.addCard(new Card(Suit.CLUBS, Rank.NINE, 1), 'player_2');
      trick2.addCard(new Card(Suit.DIAMONDS, Rank.NINE, 1), 'player_3');
      trick2.setWinner('player_2');
      gs.completedTricks.push(trick2);

      const { rePoints, kontraPoints } = calculateTeamPoints(gs);
      expect(rePoints).toBe(44);
      expect(kontraPoints).toBe(0);
    });

    it('should return 0 for both teams when no completed tricks', () => {
      const gs = createGameState();
      const { rePoints, kontraPoints } = calculateTeamPoints(gs);
      expect(rePoints).toBe(0);
      expect(kontraPoints).toBe(0);
    });

    it('should handle tricks won by both RE players', () => {
      const gs = createGameState();

      // Trick won by player_0 (RE): King+Nine+Nine+Nine = 4
      const trick1 = new Trick('player_0', 1);
      trick1.addCard(new Card(Suit.SPADES, Rank.KING, 1), 'player_0');
      trick1.addCard(new Card(Suit.SPADES, Rank.NINE, 1), 'player_1');
      trick1.addCard(new Card(Suit.CLUBS, Rank.NINE, 1), 'player_2');
      trick1.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_3');
      trick1.setWinner('player_0');
      gs.completedTricks.push(trick1);

      // Trick won by player_1 (also RE): Ace+Nine+Nine+Nine = 11
      const trick2 = new Trick('player_1', 2);
      trick2.addCard(new Card(Suit.SPADES, Rank.NINE, 2), 'player_0');
      trick2.addCard(new Card(Suit.SPADES, Rank.ACE, 1), 'player_1');
      trick2.addCard(new Card(Suit.CLUBS, Rank.NINE, 2), 'player_2');
      trick2.addCard(new Card(Suit.HEARTS, Rank.NINE, 2), 'player_3');
      trick2.setWinner('player_1');
      gs.completedTricks.push(trick2);

      const { rePoints, kontraPoints } = calculateTeamPoints(gs);
      expect(rePoints).toBe(15); // 4 + 11
      expect(kontraPoints).toBe(0);
    });
  });

  // ----------------------------------------------------------------
  // 3. calculateSpecialPoints (via calculateFinalScore)
  // ----------------------------------------------------------------
  describe('calculateSpecialPoints (via calculateFinalScore)', () => {
    it('should award against90 to RE when KONTRA has < 90 points', () => {
      const gs = createExactScoredGame(160, 80);
      const score = calculateFinalScore(gs);

      expect(score.specialPoints.against90).toBe(Team.RE);
    });

    it('should not award against90 when KONTRA has exactly 90 points', () => {
      const gs = createExactScoredGame(150, 90);
      const score = calculateFinalScore(gs);

      expect(score.specialPoints.against90).toBeUndefined();
    });

    it('should award against60 to RE when KONTRA has < 60 points', () => {
      const gs = createExactScoredGame(190, 50);
      const score = calculateFinalScore(gs);

      expect(score.specialPoints.against90).toBe(Team.RE);
      expect(score.specialPoints.against60).toBe(Team.RE);
    });

    it('should award against30 to RE when KONTRA has < 30 points', () => {
      const gs = createExactScoredGame(220, 20);
      const score = calculateFinalScore(gs);

      expect(score.specialPoints.against90).toBe(Team.RE);
      expect(score.specialPoints.against60).toBe(Team.RE);
      expect(score.specialPoints.against30).toBe(Team.RE);
    });

    it('should award schwarz to RE when KONTRA has 0 points', () => {
      const gs = createExactScoredGame(240, 0);
      const score = calculateFinalScore(gs);

      expect(score.specialPoints.against90).toBe(Team.RE);
      expect(score.specialPoints.against60).toBe(Team.RE);
      expect(score.specialPoints.against30).toBe(Team.RE);
      expect(score.specialPoints.schwarz).toBe(Team.RE);
    });

    it('should award against90 to KONTRA when RE has < 90 points', () => {
      const gs = createExactScoredGame(80, 160);
      const score = calculateFinalScore(gs);

      expect(score.specialPoints.against90).toBe(Team.CONTRA);
    });

    it('should award against60 to KONTRA when RE has < 60 points', () => {
      const gs = createExactScoredGame(50, 190);
      const score = calculateFinalScore(gs);

      expect(score.specialPoints.against60).toBe(Team.CONTRA);
    });

    it('should award against30 to KONTRA when RE has < 30 points', () => {
      const gs = createExactScoredGame(20, 220);
      const score = calculateFinalScore(gs);

      expect(score.specialPoints.against30).toBe(Team.CONTRA);
    });

    it('should award schwarz to KONTRA when RE has 0 points', () => {
      const gs = createExactScoredGame(0, 240);
      const score = calculateFinalScore(gs);

      expect(score.specialPoints.schwarz).toBe(Team.CONTRA);
    });
  });

  // ----------------------------------------------------------------
  // 4. calculateGameValue (via calculateFinalScore)
  // ----------------------------------------------------------------
  describe('calculateGameValue (via calculateFinalScore)', () => {
    it('should return base value of 1 for a normal win (150-90)', () => {
      const gs = createExactScoredGame(150, 90);
      const score = calculateFinalScore(gs);

      // 150 vs 90: kontra >= 90, no special points
      expect(score.totalGameValue).toBe(1);
    });

    it('should return 2 for win with against90 (160-80)', () => {
      const gs = createExactScoredGame(160, 80);
      const score = calculateFinalScore(gs);

      // base 1 + against90 = 2
      expect(score.totalGameValue).toBe(2);
    });

    it('should return 3 for win with against90 + against60 (190-50)', () => {
      const gs = createExactScoredGame(190, 50);
      const score = calculateFinalScore(gs);

      // base 1 + against90 + against60 = 3
      expect(score.totalGameValue).toBe(3);
    });

    it('should return 4 for win with against90 + against60 + against30 (220-20)', () => {
      const gs = createExactScoredGame(220, 20);
      const score = calculateFinalScore(gs);

      expect(score.totalGameValue).toBe(4);
    });

    it('should return 5 for schwarz (240-0)', () => {
      const gs = createExactScoredGame(240, 0);
      const score = calculateFinalScore(gs);

      // base 1 + against90 + against60 + against30 + schwarz = 5
      expect(score.totalGameValue).toBe(5);
    });
  });

  // ----------------------------------------------------------------
  // 5. validateTotalPoints
  // ----------------------------------------------------------------
  describe('validateTotalPoints', () => {
    it('should return true when total is 240', () => {
      expect(validateTotalPoints(120, 120)).toBe(true);
      expect(validateTotalPoints(150, 90)).toBe(true);
      expect(validateTotalPoints(0, 240)).toBe(true);
      expect(validateTotalPoints(240, 0)).toBe(true);
    });

    it('should return false when total is not 240', () => {
      expect(validateTotalPoints(100, 100)).toBe(false);
      expect(validateTotalPoints(0, 0)).toBe(false);
      expect(validateTotalPoints(241, 0)).toBe(false);
      expect(validateTotalPoints(130, 130)).toBe(false);
    });
  });

  // ----------------------------------------------------------------
  // 6. calculateCurrentScore
  // ----------------------------------------------------------------
  describe('calculateCurrentScore', () => {
    it('should return mid-game score from completed tricks', () => {
      const gs = createGameState();

      // One trick with mixed values: Ace(11) + Ten(10) + King(4) + Nine(0) = 25
      const trick = new Trick('player_0', 1);
      trick.addCard(new Card(Suit.SPADES, Rank.ACE, 1), 'player_0');
      trick.addCard(new Card(Suit.SPADES, Rank.TEN, 1), 'player_1');
      trick.addCard(new Card(Suit.SPADES, Rank.KING, 1), 'player_2');
      trick.addCard(new Card(Suit.SPADES, Rank.NINE, 1), 'player_3');
      trick.setWinner('player_0');
      gs.completedTricks.push(trick);

      const current = calculateCurrentScore(gs);
      expect(current.re).toBe(25);
      expect(current.kontra).toBe(0);
    });

    it('should return 0-0 when no tricks are completed', () => {
      const gs = createGameState();
      const current = calculateCurrentScore(gs);
      expect(current.re).toBe(0);
      expect(current.kontra).toBe(0);
    });
  });

  // ----------------------------------------------------------------
  // 7. getPointsNeededToWin
  // ----------------------------------------------------------------
  describe('getPointsNeededToWin', () => {
    it('should return 121 when team has 0 points', () => {
      expect(getPointsNeededToWin(0)).toBe(121);
    });

    it('should return 1 when team has 120 points', () => {
      expect(getPointsNeededToWin(120)).toBe(1);
    });

    it('should return 0 when team has 121 or more points', () => {
      expect(getPointsNeededToWin(121)).toBe(0);
      expect(getPointsNeededToWin(200)).toBe(0);
    });

    it('should return correct value for mid-game points', () => {
      expect(getPointsNeededToWin(50)).toBe(71);
      expect(getPointsNeededToWin(100)).toBe(21);
    });
  });

  // ----------------------------------------------------------------
  // 8. isGameDecided
  // ----------------------------------------------------------------
  describe('isGameDecided', () => {
    it('should return false when both teams can still win', () => {
      // RE: 60, KONTRA: 60, 4 tricks left (max 120 pts remaining)
      expect(isGameDecided(60, 60, 4)).toBe(false);
    });

    it('should return true when RE has already won and KONTRA cannot catch up', () => {
      // RE: 121, KONTRA: 89, 1 trick left (max 30 pts)
      // KONTRA max = 89 + 30 = 119 < 121 -> KONTRA can't win
      // RE already >= 121 -> RE can win
      expect(isGameDecided(121, 89, 1)).toBe(true);
    });

    it('should return true when KONTRA has already won and RE cannot catch up', () => {
      // RE: 89, KONTRA: 121, 1 trick left (max 30)
      // RE max = 89 + 30 = 119 < 121
      expect(isGameDecided(89, 121, 1)).toBe(true);
    });

    it('should return false when 0 tricks remain but both already over 121', () => {
      // This edge case: 0 tricks left, max remaining = 0
      // RE: 130, KONTRA: 110 -> RE can win (130 >= 121), KONTRA can't (110 < 121)
      expect(isGameDecided(130, 110, 0)).toBe(true);
    });

    it('should return false early game with many tricks remaining', () => {
      // RE: 10, KONTRA: 10, 10 tricks left (max 300 pts remaining)
      expect(isGameDecided(10, 10, 10)).toBe(false);
    });
  });

  // ----------------------------------------------------------------
  // 9. detectFoxCatch
  // ----------------------------------------------------------------
  describe('detectFoxCatch', () => {
    it('should detect when opponent captures Karo-Ass', () => {
      const players = [
        Object.assign(new Player('player_0', 'Alice'), { team: Team.RE }),
        Object.assign(new Player('player_1', 'Bob'), { team: Team.RE }),
        Object.assign(new Player('player_2', 'Charlie'), { team: Team.CONTRA }),
        Object.assign(new Player('player_3', 'Diana'), { team: Team.CONTRA }),
      ];

      const trick = new Trick('player_2', 1);
      // CONTRA player_2 plays Karo-Ass, RE player_0 wins the trick
      trick.addCard(new Card(Suit.DIAMONDS, Rank.ACE, 1), 'player_2');
      trick.addCard(new Card(Suit.SPADES, Rank.ACE, 1), 'player_0');
      trick.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_1');
      trick.addCard(new Card(Suit.CLUBS, Rank.NINE, 1), 'player_3');
      trick.setWinner('player_0');

      const result = detectFoxCatch(trick, 'player_0', players);
      expect(result).not.toBeNull();
      expect(result!.caughtByTeam).toBe(Team.RE);
      expect(result!.fromPlayerId).toBe('player_2');
    });

    it('should not detect fox catch when teammate plays Karo-Ass', () => {
      const players = [
        Object.assign(new Player('player_0', 'Alice'), { team: Team.RE }),
        Object.assign(new Player('player_1', 'Bob'), { team: Team.RE }),
        Object.assign(new Player('player_2', 'Charlie'), { team: Team.CONTRA }),
        Object.assign(new Player('player_3', 'Diana'), { team: Team.CONTRA }),
      ];

      const trick = new Trick('player_1', 1);
      // RE player_1 plays Karo-Ass, RE player_0 wins (same team)
      trick.addCard(new Card(Suit.DIAMONDS, Rank.ACE, 1), 'player_1');
      trick.addCard(new Card(Suit.SPADES, Rank.ACE, 1), 'player_0');
      trick.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_2');
      trick.addCard(new Card(Suit.CLUBS, Rank.NINE, 1), 'player_3');
      trick.setWinner('player_0');

      const result = detectFoxCatch(trick, 'player_0', players);
      expect(result).toBeNull();
    });

    it('should return null when no Karo-Ass is in the trick', () => {
      const players = [
        Object.assign(new Player('player_0', 'Alice'), { team: Team.RE }),
        Object.assign(new Player('player_1', 'Bob'), { team: Team.RE }),
        Object.assign(new Player('player_2', 'Charlie'), { team: Team.CONTRA }),
        Object.assign(new Player('player_3', 'Diana'), { team: Team.CONTRA }),
      ];

      const trick = new Trick('player_0', 1);
      trick.addCard(new Card(Suit.SPADES, Rank.ACE, 1), 'player_0');
      trick.addCard(new Card(Suit.HEARTS, Rank.ACE, 1), 'player_1');
      trick.addCard(new Card(Suit.CLUBS, Rank.ACE, 1), 'player_2');
      trick.addCard(new Card(Suit.SPADES, Rank.TEN, 1), 'player_3');
      trick.setWinner('player_0');

      const result = detectFoxCatch(trick, 'player_0', players);
      expect(result).toBeNull();
    });

    it('should detect fox catch by KONTRA when RE Karo-Ass is captured', () => {
      const players = [
        Object.assign(new Player('player_0', 'Alice'), { team: Team.RE }),
        Object.assign(new Player('player_1', 'Bob'), { team: Team.RE }),
        Object.assign(new Player('player_2', 'Charlie'), { team: Team.CONTRA }),
        Object.assign(new Player('player_3', 'Diana'), { team: Team.CONTRA }),
      ];

      const trick = new Trick('player_0', 1);
      // RE player_0 plays Karo-Ass, CONTRA player_2 wins
      trick.addCard(new Card(Suit.DIAMONDS, Rank.ACE, 1), 'player_0');
      trick.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_1');
      trick.addCard(new Card(Suit.CLUBS, Rank.ACE, 1), 'player_2');
      trick.addCard(new Card(Suit.SPADES, Rank.NINE, 1), 'player_3');
      trick.setWinner('player_2');

      const result = detectFoxCatch(trick, 'player_2', players);
      expect(result).not.toBeNull();
      expect(result!.caughtByTeam).toBe(Team.CONTRA);
      expect(result!.fromPlayerId).toBe('player_0');
    });
  });

  // ----------------------------------------------------------------
  // 10. detectKarlchen
  // ----------------------------------------------------------------
  describe('detectKarlchen', () => {
    it('should detect Karlchen when winning trick 12 with Kreuz-Bube', () => {
      const players = [
        Object.assign(new Player('player_0', 'Alice'), { team: Team.RE }),
        Object.assign(new Player('player_1', 'Bob'), { team: Team.RE }),
        Object.assign(new Player('player_2', 'Charlie'), { team: Team.CONTRA }),
        Object.assign(new Player('player_3', 'Diana'), { team: Team.CONTRA }),
      ];

      const trick = new Trick('player_0', 12);
      trick.addCard(new Card(Suit.CLUBS, Rank.JACK, 1), 'player_0');
      trick.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_1');
      trick.addCard(new Card(Suit.SPADES, Rank.NINE, 1), 'player_2');
      trick.addCard(new Card(Suit.CLUBS, Rank.NINE, 1), 'player_3');
      trick.setWinner('player_0');

      const result = detectKarlchen(trick, 12, 'player_0', players);
      expect(result).not.toBeNull();
      expect(result!.team).toBe(Team.RE);
      expect(result!.playerId).toBe('player_0');
    });

    it('should not detect Karlchen when trick is not 12', () => {
      const players = [
        Object.assign(new Player('player_0', 'Alice'), { team: Team.RE }),
        Object.assign(new Player('player_1', 'Bob'), { team: Team.RE }),
        Object.assign(new Player('player_2', 'Charlie'), { team: Team.CONTRA }),
        Object.assign(new Player('player_3', 'Diana'), { team: Team.CONTRA }),
      ];

      const trick = new Trick('player_0', 5);
      trick.addCard(new Card(Suit.CLUBS, Rank.JACK, 1), 'player_0');
      trick.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_1');
      trick.addCard(new Card(Suit.SPADES, Rank.NINE, 1), 'player_2');
      trick.addCard(new Card(Suit.CLUBS, Rank.NINE, 1), 'player_3');
      trick.setWinner('player_0');

      const result = detectKarlchen(trick, 5, 'player_0', players);
      expect(result).toBeNull();
    });

    it('should not detect Karlchen when winning card is not Kreuz-Bube', () => {
      const players = [
        Object.assign(new Player('player_0', 'Alice'), { team: Team.RE }),
        Object.assign(new Player('player_1', 'Bob'), { team: Team.RE }),
        Object.assign(new Player('player_2', 'Charlie'), { team: Team.CONTRA }),
        Object.assign(new Player('player_3', 'Diana'), { team: Team.CONTRA }),
      ];

      const trick = new Trick('player_0', 12);
      trick.addCard(new Card(Suit.SPADES, Rank.ACE, 1), 'player_0');
      trick.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_1');
      trick.addCard(new Card(Suit.SPADES, Rank.NINE, 1), 'player_2');
      trick.addCard(new Card(Suit.CLUBS, Rank.NINE, 1), 'player_3');
      trick.setWinner('player_0');

      const result = detectKarlchen(trick, 12, 'player_0', players);
      expect(result).toBeNull();
    });

    it('should detect Karlchen for KONTRA team', () => {
      const players = [
        Object.assign(new Player('player_0', 'Alice'), { team: Team.RE }),
        Object.assign(new Player('player_1', 'Bob'), { team: Team.RE }),
        Object.assign(new Player('player_2', 'Charlie'), { team: Team.CONTRA }),
        Object.assign(new Player('player_3', 'Diana'), { team: Team.CONTRA }),
      ];

      const trick = new Trick('player_2', 12);
      trick.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_0');
      trick.addCard(new Card(Suit.SPADES, Rank.NINE, 1), 'player_1');
      trick.addCard(new Card(Suit.CLUBS, Rank.JACK, 1), 'player_2');
      trick.addCard(new Card(Suit.CLUBS, Rank.NINE, 1), 'player_3');
      trick.setWinner('player_2');

      const result = detectKarlchen(trick, 12, 'player_2', players);
      expect(result).not.toBeNull();
      expect(result!.team).toBe(Team.CONTRA);
      expect(result!.playerId).toBe('player_2');
    });
  });

  // ----------------------------------------------------------------
  // 11. detectKarlchenCaught
  // ----------------------------------------------------------------
  describe('detectKarlchenCaught', () => {
    const players = [
      Object.assign(new Player('player_0', 'Alice'), { team: Team.RE }),
      Object.assign(new Player('player_1', 'Bob'), { team: Team.RE }),
      Object.assign(new Player('player_2', 'Charlie'), { team: Team.CONTRA }),
      Object.assign(new Player('player_3', 'Diana'), { team: Team.CONTRA }),
    ];

    it('should detect when opponent captures Kreuz-Bube in trick 12', () => {
      const trick = new Trick('player_0', 12);
      trick.addCard(new Card(Suit.CLUBS, Rank.JACK, 1), 'player_2'); // KONTRA plays Karlchen
      trick.addCard(new Card(Suit.SPADES, Rank.ACE, 1), 'player_0'); // RE wins
      trick.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_1');
      trick.addCard(new Card(Suit.CLUBS, Rank.NINE, 1), 'player_3');
      trick.setWinner('player_0');

      const result = detectKarlchenCaught(trick, 12, 'player_0', players);
      expect(result).not.toBeNull();
      expect(result!.caughtByTeam).toBe(Team.RE);
      expect(result!.fromPlayerId).toBe('player_2');
    });

    it('should not detect when Karlchen is played by same team as winner', () => {
      const trick = new Trick('player_0', 12);
      trick.addCard(new Card(Suit.CLUBS, Rank.JACK, 1), 'player_1'); // RE plays Karlchen
      trick.addCard(new Card(Suit.SPADES, Rank.ACE, 1), 'player_0'); // RE wins
      trick.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_2');
      trick.addCard(new Card(Suit.CLUBS, Rank.NINE, 1), 'player_3');
      trick.setWinner('player_0');

      const result = detectKarlchenCaught(trick, 12, 'player_0', players);
      expect(result).toBeNull();
    });

    it('should not detect in non-last trick', () => {
      const trick = new Trick('player_0', 5);
      trick.addCard(new Card(Suit.CLUBS, Rank.JACK, 1), 'player_2');
      trick.addCard(new Card(Suit.SPADES, Rank.ACE, 1), 'player_0');
      trick.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_1');
      trick.addCard(new Card(Suit.CLUBS, Rank.NINE, 1), 'player_3');
      trick.setWinner('player_0');

      const result = detectKarlchenCaught(trick, 5, 'player_0', players);
      expect(result).toBeNull();
    });

    it('should not detect when no Kreuz-Bube is in the trick', () => {
      const trick = new Trick('player_0', 12);
      trick.addCard(new Card(Suit.SPADES, Rank.ACE, 1), 'player_0');
      trick.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_1');
      trick.addCard(new Card(Suit.CLUBS, Rank.NINE, 1), 'player_2');
      trick.addCard(new Card(Suit.SPADES, Rank.NINE, 1), 'player_3');
      trick.setWinner('player_0');

      const result = detectKarlchenCaught(trick, 12, 'player_0', players);
      expect(result).toBeNull();
    });
  });

  // ----------------------------------------------------------------
  // 12. detectFoxLastTrick
  // ----------------------------------------------------------------
  describe('detectFoxLastTrick', () => {
    const players = [
      Object.assign(new Player('player_0', 'Alice'), { team: Team.RE }),
      Object.assign(new Player('player_1', 'Bob'), { team: Team.RE }),
      Object.assign(new Player('player_2', 'Charlie'), { team: Team.CONTRA }),
      Object.assign(new Player('player_3', 'Diana'), { team: Team.CONTRA }),
    ];

    it('should detect when winning trick 12 with Karo-Ass', () => {
      const trick = new Trick('player_0', 12);
      trick.addCard(new Card(Suit.DIAMONDS, Rank.ACE, 1), 'player_0');
      trick.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_1');
      trick.addCard(new Card(Suit.SPADES, Rank.NINE, 1), 'player_2');
      trick.addCard(new Card(Suit.CLUBS, Rank.NINE, 1), 'player_3');
      trick.setWinner('player_0');

      const result = detectFoxLastTrick(trick, 12, 'player_0', players);
      expect(result).not.toBeNull();
      expect(result!.team).toBe(Team.RE);
      expect(result!.playerId).toBe('player_0');
    });

    it('should not detect in non-last trick', () => {
      const trick = new Trick('player_0', 5);
      trick.addCard(new Card(Suit.DIAMONDS, Rank.ACE, 1), 'player_0');
      trick.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_1');
      trick.addCard(new Card(Suit.SPADES, Rank.NINE, 1), 'player_2');
      trick.addCard(new Card(Suit.CLUBS, Rank.NINE, 1), 'player_3');
      trick.setWinner('player_0');

      const result = detectFoxLastTrick(trick, 5, 'player_0', players);
      expect(result).toBeNull();
    });

    it('should not detect when winning card is not Karo-Ass', () => {
      const trick = new Trick('player_0', 12);
      trick.addCard(new Card(Suit.SPADES, Rank.ACE, 1), 'player_0');
      trick.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_1');
      trick.addCard(new Card(Suit.SPADES, Rank.NINE, 1), 'player_2');
      trick.addCard(new Card(Suit.CLUBS, Rank.NINE, 1), 'player_3');
      trick.setWinner('player_0');

      const result = detectFoxLastTrick(trick, 12, 'player_0', players);
      expect(result).toBeNull();
    });

    it('should detect for KONTRA team', () => {
      const trick = new Trick('player_2', 12);
      trick.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_0');
      trick.addCard(new Card(Suit.SPADES, Rank.NINE, 1), 'player_1');
      trick.addCard(new Card(Suit.DIAMONDS, Rank.ACE, 1), 'player_2');
      trick.addCard(new Card(Suit.CLUBS, Rank.NINE, 1), 'player_3');
      trick.setWinner('player_2');

      const result = detectFoxLastTrick(trick, 12, 'player_2', players);
      expect(result).not.toBeNull();
      expect(result!.team).toBe(Team.CONTRA);
    });
  });

  // ----------------------------------------------------------------
  // 13. detectDoppelkopfTrick
  // ----------------------------------------------------------------
  describe('detectDoppelkopfTrick', () => {
    it('should detect Doppelkopf when trick has 40+ points', () => {
      const players = [
        Object.assign(new Player('player_0', 'Alice'), { team: Team.RE }),
        Object.assign(new Player('player_1', 'Bob'), { team: Team.RE }),
        Object.assign(new Player('player_2', 'Charlie'), { team: Team.CONTRA }),
        Object.assign(new Player('player_3', 'Diana'), { team: Team.CONTRA }),
      ];

      // 4 Aces = 4 x 11 = 44 points
      const trick = new Trick('player_0', 1);
      trick.addCard(new Card(Suit.SPADES, Rank.ACE, 1), 'player_0');
      trick.addCard(new Card(Suit.HEARTS, Rank.ACE, 1), 'player_1');
      trick.addCard(new Card(Suit.CLUBS, Rank.ACE, 1), 'player_2');
      trick.addCard(new Card(Suit.DIAMONDS, Rank.ACE, 1), 'player_3');
      trick.setWinner('player_0');

      const result = detectDoppelkopfTrick(trick, 'player_0', players);
      expect(result).not.toBeNull();
      expect(result!.team).toBe(Team.RE);
      expect(result!.playerId).toBe('player_0');
      expect(result!.points).toBe(44);
    });

    it('should detect Doppelkopf at exactly 40 points', () => {
      const players = [
        Object.assign(new Player('player_0', 'Alice'), { team: Team.RE }),
        Object.assign(new Player('player_1', 'Bob'), { team: Team.RE }),
        Object.assign(new Player('player_2', 'Charlie'), { team: Team.CONTRA }),
        Object.assign(new Player('player_3', 'Diana'), { team: Team.CONTRA }),
      ];

      // Ace(11) + Ace(11) + Ace(11) + Queen(3) + ... no, we need exactly 40
      // Ace(11) + Ace(11) + Ten(10) + King(4) + ... that's only 4 cards
      // 11 + 11 + 10 + 8 = nope. Let's do: Ten(10) + Ten(10) + Ten(10) + Ten(10) = 40
      const trick = new Trick('player_0', 1);
      trick.addCard(new Card(Suit.SPADES, Rank.TEN, 1), 'player_0');
      trick.addCard(new Card(Suit.HEARTS, Rank.TEN, 1), 'player_1');
      trick.addCard(new Card(Suit.CLUBS, Rank.TEN, 1), 'player_2');
      trick.addCard(new Card(Suit.DIAMONDS, Rank.TEN, 1), 'player_3');
      trick.setWinner('player_0');

      const result = detectDoppelkopfTrick(trick, 'player_0', players);
      expect(result).not.toBeNull();
      expect(result!.points).toBe(40);
    });

    it('should not detect Doppelkopf at exactly 39 points', () => {
      const players = [
        Object.assign(new Player('player_0', 'Alice'), { team: Team.RE }),
        Object.assign(new Player('player_1', 'Bob'), { team: Team.RE }),
        Object.assign(new Player('player_2', 'Charlie'), { team: Team.CONTRA }),
        Object.assign(new Player('player_3', 'Diana'), { team: Team.CONTRA }),
      ];

      // Ace(11) + Ace(11) + Ace(11) + King(4) = 37 -- not 39
      // Ace(11) + Ten(10) + Ten(10) + King(4) + ... = 35
      // Let's do: Ace(11) + Ace(11) + Ten(10) + Queen(3) + Jack(2) no, only 4 cards
      // Ace(11) + Ten(10) + Ten(10) + Nine(0) = 31
      // Let's find 39: not easily doable with exactly 4 cards from standard values
      // 11 + 11 + 11 + 4 = 37, 11 + 11 + 10 + 4 = 36, 11 + 10 + 10 + 4 = 35
      // 10 + 10 + 10 + 4 = 34, 11 + 11 + 11 + 3 = 36, 11 + 11 + 10 + 3 = 35
      // Actually with standard Doppelkopf values you can't make exactly 39.
      // Closest below 40: Ace(11) + Ace(11) + Ace(11) + King(4) = 37
      // or: Ace(11) + Ten(10) + Ten(10) + King(4) = 35
      // or: Ace(11) + Ace(11) + Ten(10) + Queen(3) = 35
      // Let's just test with 37 (below 40)
      const trick = new Trick('player_0', 1);
      trick.addCard(new Card(Suit.SPADES, Rank.ACE, 1), 'player_0');
      trick.addCard(new Card(Suit.HEARTS, Rank.ACE, 1), 'player_1');
      trick.addCard(new Card(Suit.CLUBS, Rank.ACE, 1), 'player_2');
      trick.addCard(new Card(Suit.DIAMONDS, Rank.KING, 1), 'player_3');
      trick.setWinner('player_0');

      const result = detectDoppelkopfTrick(trick, 'player_0', players);
      expect(result).toBeNull();
    });

    it('should not detect Doppelkopf for low-value tricks', () => {
      const players = [
        Object.assign(new Player('player_0', 'Alice'), { team: Team.RE }),
        Object.assign(new Player('player_1', 'Bob'), { team: Team.RE }),
        Object.assign(new Player('player_2', 'Charlie'), { team: Team.CONTRA }),
        Object.assign(new Player('player_3', 'Diana'), { team: Team.CONTRA }),
      ];

      // 4 Nines = 0 points
      const trick = new Trick('player_0', 1);
      trick.addCard(new Card(Suit.SPADES, Rank.NINE, 1), 'player_0');
      trick.addCard(new Card(Suit.HEARTS, Rank.NINE, 1), 'player_1');
      trick.addCard(new Card(Suit.CLUBS, Rank.NINE, 1), 'player_2');
      trick.addCard(new Card(Suit.DIAMONDS, Rank.NINE, 1), 'player_3');
      trick.setWinner('player_0');

      const result = detectDoppelkopfTrick(trick, 'player_0', players);
      expect(result).toBeNull();
    });
  });

  // ----------------------------------------------------------------
  // 12. hasTeamAnnounced
  // ----------------------------------------------------------------
  describe('hasTeamAnnounced', () => {
    it('should return true when a RE player has announced', () => {
      const gs = createGameState();
      gs.players[0].hasAnnounced = true;

      expect(hasTeamAnnounced(gs, Team.RE)).toBe(true);
    });

    it('should return false when no RE player has announced', () => {
      const gs = createGameState();

      expect(hasTeamAnnounced(gs, Team.RE)).toBe(false);
    });

    it('should return true when a KONTRA player has announced', () => {
      const gs = createGameState();
      gs.players[2].hasAnnounced = true;

      expect(hasTeamAnnounced(gs, Team.CONTRA)).toBe(true);
    });

    it('should return false when no KONTRA player has announced', () => {
      const gs = createGameState();

      expect(hasTeamAnnounced(gs, Team.CONTRA)).toBe(false);
    });

    it('should return true when both players of a team have announced', () => {
      const gs = createGameState();
      gs.players[0].hasAnnounced = true;
      gs.players[1].hasAnnounced = true;

      expect(hasTeamAnnounced(gs, Team.RE)).toBe(true);
    });

    it('should not confuse RE and KONTRA announcements', () => {
      const gs = createGameState();
      gs.players[2].hasAnnounced = true; // KONTRA player

      expect(hasTeamAnnounced(gs, Team.RE)).toBe(false);
      expect(hasTeamAnnounced(gs, Team.CONTRA)).toBe(true);
    });
  });
});
