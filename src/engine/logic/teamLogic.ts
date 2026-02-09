/**
 * Team Logic - Determine Re/Kontra teams in Doppelkopf
 *
 * Standard Rules:
 * - Players with Queen of Clubs are "Re" team (usually 2 players)
 * - Players without Queen of Clubs are "Kontra" team (usually 2 players)
 * - Special cases: Hochzeit, Solo (not implemented yet)
 */

import { Player } from '@/engine/models/Player';
import { GameState } from '@/engine/models/GameState';
import { Team } from '@/types/game.types';
import { Suit, Rank } from '@/types/card.types';

/**
 * Assign teams to all players based on their cards
 * TODO: Check for Queens of Clubs
 */
export function assignTeams(gameState: GameState): void {
  // TODO: Implement team assignment
  gameState.players.forEach(player => {
    player.team = determinePlayerTeam(player);
  });
}

/**
 * Determine a single player's team based on their cards
 */
export function determinePlayerTeam(player: Player): Team {
  // TODO: Implement team determination
  // Check if player has Queen of Clubs
  const hasQueenOfClubs = player.hand.some(
    card => card.rank === Rank.QUEEN && card.suit === Suit.CLUBS
  );

  return hasQueenOfClubs ? Team.RE : Team.CONTRA;
}

/**
 * Check if team assignment is valid (should be 2 vs 2)
 */
export function validateTeamAssignment(gameState: GameState): boolean {
  const rePlayers = gameState.getPlayersOnTeam(Team.RE);
  const kontraPlayers = gameState.getPlayersOnTeam(Team.CONTRA);

  // Standard game: 2 Re, 2 Kontra
  // TODO: Handle special cases (Hochzeit, Solo)
  return rePlayers.length === 2 && kontraPlayers.length === 2;
}

/**
 * Get partner of a player (same team, different player)
 */
export function getPartner(player: Player, gameState: GameState): Player | null {
  const teammates = gameState.getPlayersOnTeam(player.team);
  return teammates.find(p => p.id !== player.id) ?? null;
}

/**
 * Get opponents of a player (other team)
 */
export function getOpponents(player: Player, gameState: GameState): Player[] {
  const opposingTeam = player.team === Team.RE ? Team.CONTRA : Team.RE;
  return gameState.getPlayersOnTeam(opposingTeam);
}

/**
 * Check if two players are on the same team
 */
export function areTeammates(player1: Player, player2: Player): boolean {
  return player1.team === player2.team && player1.team !== Team.UNKNOWN;
}

/**
 * Check if player has announced Re or Kontra
 * TODO: Announcements can only be made before 11th card
 */
export function canAnnounce(player: Player, gameState: GameState): boolean {
  // TODO: Implement announcement rules
  // Can't announce if already announced
  if (player.hasAnnounced) return false;

  // Can't announce if team is undecided
  if (player.team === Team.UNKNOWN) return false;

  // Can only announce before 11th card (1 card played)
  const cardsPlayed = 12 - player.handSize;
  if (cardsPlayed > 1) return false;

  return true;
}

/**
 * Handle player announcement
 */
export function announceTeam(player: Player, team: Team, gameState: GameState): boolean {
  // TODO: Implement announcement handling
  if (!canAnnounce(player, gameState)) return false;

  // Verify team matches player's actual team
  if (player.team !== team) return false;

  player.hasAnnounced = true;
  return true;
}

/**
 * Detect special game types (for future implementation)
 * TODO: Hochzeit (wedding) - player has both Queens of Clubs
 * TODO: Solo - single player vs 3 others
 */
export function detectSpecialGame(gameState: GameState): 'normal' | 'hochzeit' | 'solo' | null {
  // TODO: Implement special game detection
  // For now, only support normal games
  return 'normal';
}

/**
 * Check if a player's team is revealed yet
 * Teams are hidden until first announcement or specific card plays
 */
export function isTeamRevealed(player: Player, gameState: GameState): boolean {
  // Team is revealed if player or partner has announced
  if (player.hasAnnounced) return true;

  const partner = getPartner(player, gameState);
  if (partner?.hasAnnounced) return true;

  // Team is revealed if Queen of Clubs has been played
  // TODO: Check if any Queen of Clubs has been played
  const queenOfClubsPlayed = gameState.completedTricks.some(trick =>
    trick.getCards().some(card => card.rank === Rank.QUEEN && card.suit === Suit.CLUBS)
  );

  if (queenOfClubsPlayed && player.team !== Team.UNKNOWN) {
    return true;
  }

  return false;
}

/**
 * Get team score summary
 */
export function getTeamSummary(gameState: GameState): {
  re: { players: Player[]; score: number };
  kontra: { players: Player[]; score: number };
} {
  return {
    re: {
      players: gameState.getPlayersOnTeam(Team.RE),
      score: gameState.scores.re,
    },
    kontra: {
      players: gameState.getPlayersOnTeam(Team.CONTRA),
      score: gameState.scores.kontra,
    },
  };
}
