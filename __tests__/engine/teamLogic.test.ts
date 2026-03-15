/**
 * Team Logic Tests
 */

import { Card } from '@/engine/models/Card';
import { Player } from '@/engine/models/Player';
import { GameState } from '@/engine/models/GameState';
import { Trick } from '@/engine/models/Trick';
import { Suit, Rank } from '@/types/card.types';
import { Team } from '@/types/game.types';
import {
  assignTeams,
  determinePlayerTeam,
  validateTeamAssignment,
  getPartner,
  getOpponents,
  areTeammates,
  canAnnounce,
  announceTeam,
  detectSpecialGame,
  isTeamRevealed,
} from '@/engine/logic/teamLogic';

// Helper: create a standard 4-player GameState
function createGameState(): GameState {
  const gs = new GameState('test_game');
  gs.initializePlayers(['Alice', 'Bob', 'Charlie', 'Diana']);
  return gs;
}

// Helper: create a Queen of Clubs card
function queenOfClubs(copy: 1 | 2): Card {
  const card = new Card(Suit.CLUBS, Rank.QUEEN, copy);
  card.setTrump(1);
  return card;
}

// Helper: create a filler (non-QC) card
function fillerCard(suit: Suit, rank: Rank, copy: 1 | 2): Card {
  return new Card(suit, rank, copy);
}

// Helper: give each player 12 cards, with QC distributed as specified
// qcDistribution maps player index (0-3) to how many QC copies they get
function dealWithQueens(
  gs: GameState,
  qcDistribution: [number, number, number, number],
): void {
  let qcCopy: 1 | 2 = 1;

  gs.players.forEach((player, idx) => {
    const cards: Card[] = [];
    const qcCount = qcDistribution[idx];

    for (let i = 0; i < qcCount; i++) {
      cards.push(queenOfClubs(qcCopy));
      qcCopy = (qcCopy === 1 ? 2 : 1) as 1 | 2;
    }

    // Fill remaining hand with unique filler cards
    const suits = [Suit.HEARTS, Suit.SPADES, Suit.CLUBS];
    const ranks = [Rank.ACE, Rank.TEN, Rank.KING, Rank.NINE];
    let fillerIdx = 0;
    while (cards.length < 12) {
      const s = suits[fillerIdx % suits.length];
      const r = ranks[Math.floor(fillerIdx / suits.length) % ranks.length];
      // Use player index + filler index to ensure unique IDs across players
      const copy = ((idx * 12 + fillerIdx) % 2 === 0 ? 1 : 2) as 1 | 2;
      cards.push(fillerCard(s, r, copy));
      fillerIdx++;
    }

    player.receiveCards(cards);
  });
}

describe('teamLogic', () => {
  describe('assignTeams', () => {
    it('should assign Re to players with Queen of Clubs and Kontra to others', () => {
      const gs = createGameState();
      // Player 0 and 2 each get one QC
      dealWithQueens(gs, [1, 0, 1, 0]);

      assignTeams(gs);

      expect(gs.players[0].team).toBe(Team.RE);
      expect(gs.players[1].team).toBe(Team.CONTRA);
      expect(gs.players[2].team).toBe(Team.RE);
      expect(gs.players[3].team).toBe(Team.CONTRA);
    });

    it('should assign Re to both QC holders when in different hands', () => {
      const gs = createGameState();
      // Player 1 and 3 each get one QC
      dealWithQueens(gs, [0, 1, 0, 1]);

      assignTeams(gs);

      expect(gs.players[0].team).toBe(Team.CONTRA);
      expect(gs.players[1].team).toBe(Team.RE);
      expect(gs.players[2].team).toBe(Team.CONTRA);
      expect(gs.players[3].team).toBe(Team.RE);
    });
  });

  describe('determinePlayerTeam', () => {
    it('should return Re for player with one Queen of Clubs', () => {
      const player = new Player('p1', 'Alice');
      player.receiveCards([
        queenOfClubs(1),
        fillerCard(Suit.HEARTS, Rank.ACE, 1),
      ]);

      expect(determinePlayerTeam(player)).toBe(Team.RE);
    });

    it('should return Re for player with two Queens of Clubs', () => {
      const player = new Player('p1', 'Alice');
      player.receiveCards([
        queenOfClubs(1),
        queenOfClubs(2),
        fillerCard(Suit.HEARTS, Rank.ACE, 1),
      ]);

      expect(determinePlayerTeam(player)).toBe(Team.RE);
    });

    it('should return Kontra for player with no Queen of Clubs', () => {
      const player = new Player('p1', 'Alice');
      player.receiveCards([
        fillerCard(Suit.HEARTS, Rank.ACE, 1),
        fillerCard(Suit.SPADES, Rank.KING, 1),
      ]);

      expect(determinePlayerTeam(player)).toBe(Team.CONTRA);
    });

    it('should not confuse Queens of other suits with Queen of Clubs', () => {
      const player = new Player('p1', 'Alice');
      player.receiveCards([
        new Card(Suit.SPADES, Rank.QUEEN, 1),
        new Card(Suit.HEARTS, Rank.QUEEN, 1),
        new Card(Suit.DIAMONDS, Rank.QUEEN, 1),
      ]);

      expect(determinePlayerTeam(player)).toBe(Team.CONTRA);
    });
  });

  describe('validateTeamAssignment', () => {
    it('should return true for valid 2v2 assignment', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      expect(validateTeamAssignment(gs)).toBe(true);
    });

    it('should return false when both QC are in one hand (1 Re vs 3 Kontra)', () => {
      const gs = createGameState();
      // Player 0 gets both QC => only 1 Re player
      dealWithQueens(gs, [2, 0, 0, 0]);
      assignTeams(gs);

      expect(validateTeamAssignment(gs)).toBe(false);
    });

    it('should return false when teams are not yet assigned', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      // Do NOT call assignTeams — all players remain UNKNOWN

      expect(validateTeamAssignment(gs)).toBe(false);
    });
  });

  describe('getPartner', () => {
    it('should find the other player on the same team', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      const partner = getPartner(gs.players[0], gs);
      expect(partner).not.toBeNull();
      expect(partner!.id).toBe(gs.players[2].id);
    });

    it('should return partner for Kontra player too', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      const partner = getPartner(gs.players[1], gs);
      expect(partner).not.toBeNull();
      expect(partner!.id).toBe(gs.players[3].id);
    });

    it('should return another UNKNOWN player when team is UNKNOWN (all unassigned)', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      // Teams not assigned — all players are UNKNOWN
      // getPlayersOnTeam(UNKNOWN) returns all 4, so getPartner returns the first non-self match

      const partner = getPartner(gs.players[0], gs);
      // Since all 4 are UNKNOWN, a partner is found (first other UNKNOWN player)
      expect(partner).not.toBeNull();
      expect(partner!.id).not.toBe(gs.players[0].id);
    });

    it('should return null when player is the only one on their team', () => {
      const gs = createGameState();
      dealWithQueens(gs, [2, 0, 0, 0]);
      assignTeams(gs);

      // Player 0 is the only Re player (has both QC)
      // getPartner looks for another Re player — there is none
      const partner = getPartner(gs.players[0], gs);
      expect(partner).toBeNull();
    });
  });

  describe('getOpponents', () => {
    it('should find both players on the opposing team', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      const opponents = getOpponents(gs.players[0], gs);
      expect(opponents).toHaveLength(2);

      const opponentIds = opponents.map(p => p.id);
      expect(opponentIds).toContain(gs.players[1].id);
      expect(opponentIds).toContain(gs.players[3].id);
    });

    it('should return Re players as opponents when player is Kontra', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      const opponents = getOpponents(gs.players[1], gs);
      expect(opponents).toHaveLength(2);

      const opponentIds = opponents.map(p => p.id);
      expect(opponentIds).toContain(gs.players[0].id);
      expect(opponentIds).toContain(gs.players[2].id);
    });
  });

  describe('areTeammates', () => {
    it('should return true for two players on the same team', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      expect(areTeammates(gs.players[0], gs.players[2])).toBe(true);
      expect(areTeammates(gs.players[1], gs.players[3])).toBe(true);
    });

    it('should return false for players on different teams', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      expect(areTeammates(gs.players[0], gs.players[1])).toBe(false);
      expect(areTeammates(gs.players[0], gs.players[3])).toBe(false);
    });

    it('should return false when either player has UNKNOWN team', () => {
      const p1 = new Player('p1', 'Alice');
      p1.team = Team.UNKNOWN;

      const p2 = new Player('p2', 'Bob');
      p2.team = Team.UNKNOWN;

      expect(areTeammates(p1, p2)).toBe(false);
    });

    it('should return false when one player is UNKNOWN and the other is not', () => {
      const p1 = new Player('p1', 'Alice');
      p1.team = Team.RE;

      const p2 = new Player('p2', 'Bob');
      p2.team = Team.UNKNOWN;

      expect(areTeammates(p1, p2)).toBe(false);
    });
  });

  describe('canAnnounce', () => {
    it('should allow announcement when not yet announced, team known, and at most 1 card played', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      // Player has 12 cards (0 played) => allowed
      expect(canAnnounce(gs.players[0], gs)).toBe(true);
    });

    it('should allow announcement after exactly 1 card played', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      // Remove one card to simulate 1 card played (hand goes from 12 to 11)
      gs.players[0].hand.pop();

      expect(canAnnounce(gs.players[0], gs)).toBe(true);
    });

    it('should not allow announcement if already announced', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      gs.players[0].hasAnnounced = true;

      expect(canAnnounce(gs.players[0], gs)).toBe(false);
    });

    it('should not allow announcement if team is UNKNOWN', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      // Don't assign teams — all remain UNKNOWN

      expect(canAnnounce(gs.players[0], gs)).toBe(false);
    });

    it('should not allow announcement if more than 1 card played', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      // Remove 2 cards to simulate 2 cards played (hand goes from 12 to 10)
      gs.players[0].hand.pop();
      gs.players[0].hand.pop();

      expect(canAnnounce(gs.players[0], gs)).toBe(false);
    });
  });

  describe('announceTeam', () => {
    it('should succeed when player announces their correct team', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      const result = announceTeam(gs.players[0], Team.RE, gs);

      expect(result).toBe(true);
      expect(gs.players[0].hasAnnounced).toBe(true);
    });

    it('should reject announcement of wrong team', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      // Player 0 is Re, but tries to announce Kontra
      const result = announceTeam(gs.players[0], Team.CONTRA, gs);

      expect(result).toBe(false);
      expect(gs.players[0].hasAnnounced).toBe(false);
    });

    it('should reject announcement when canAnnounce returns false', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      // Already announced
      gs.players[0].hasAnnounced = true;

      const result = announceTeam(gs.players[0], Team.RE, gs);

      expect(result).toBe(false);
    });

    it('should allow Kontra player to announce Kontra', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      const result = announceTeam(gs.players[1], Team.CONTRA, gs);

      expect(result).toBe(true);
      expect(gs.players[1].hasAnnounced).toBe(true);
    });
  });

  describe('detectSpecialGame', () => {
    it('should return normal for current implementation', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);

      expect(detectSpecialGame(gs)).toBe('normal');
    });

    it('should return normal even when both QC are in one hand', () => {
      const gs = createGameState();
      dealWithQueens(gs, [2, 0, 0, 0]);

      // Current implementation always returns 'normal'
      expect(detectSpecialGame(gs)).toBe('normal');
    });
  });

  describe('isTeamRevealed', () => {
    it('should be revealed after player has announced', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      gs.players[0].hasAnnounced = true;

      expect(isTeamRevealed(gs.players[0], gs)).toBe(true);
    });

    it('should be revealed after partner has announced', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      // Player 2 is partner of player 0 (both Re)
      gs.players[2].hasAnnounced = true;

      expect(isTeamRevealed(gs.players[0], gs)).toBe(true);
    });

    it('should be revealed after Queen of Clubs has been played in a completed trick', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      // Simulate a completed trick containing Queen of Clubs
      const trick = new Trick('player_0', 1);
      trick.addCard(queenOfClubs(1), 'player_0');
      trick.addCard(fillerCard(Suit.HEARTS, Rank.ACE, 1), 'player_1');
      trick.addCard(fillerCard(Suit.HEARTS, Rank.ACE, 2), 'player_2');
      trick.addCard(fillerCard(Suit.SPADES, Rank.ACE, 1), 'player_3');
      gs.completedTricks.push(trick);

      expect(isTeamRevealed(gs.players[0], gs)).toBe(true);
      // Kontra players are also revealed once QC is played
      expect(isTeamRevealed(gs.players[1], gs)).toBe(true);
    });

    it('should not be revealed before any announcement or QC play', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      assignTeams(gs);

      expect(isTeamRevealed(gs.players[0], gs)).toBe(false);
      expect(isTeamRevealed(gs.players[1], gs)).toBe(false);
    });

    it('should not be revealed for UNKNOWN team even after QC played', () => {
      const gs = createGameState();
      dealWithQueens(gs, [1, 0, 1, 0]);
      // Don't assign teams — all remain UNKNOWN

      const trick = new Trick('player_0', 1);
      trick.addCard(queenOfClubs(1), 'player_0');
      trick.addCard(fillerCard(Suit.HEARTS, Rank.ACE, 1), 'player_1');
      trick.addCard(fillerCard(Suit.HEARTS, Rank.ACE, 2), 'player_2');
      trick.addCard(fillerCard(Suit.SPADES, Rank.ACE, 1), 'player_3');
      gs.completedTricks.push(trick);

      expect(isTeamRevealed(gs.players[0], gs)).toBe(false);
    });
  });
});
