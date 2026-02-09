/**
 * Score Logic - Calculate points and determine game winners
 *
 * Doppelkopf Scoring:
 * - Total points in game: 240 (120 per side to win)
 * - Base game: 1 point
 * - Against 90: 1 point (opponent got < 90 points)
 * - Against 60: 1 point (opponent got < 60 points)
 * - Against 30: 1 point (opponent got < 30 points)
 * - Schwarz: 1 point (opponent got 0 tricks)
 * - Announcements: Re/Kontra, No 90, No 60, No 30, Schwarz
 */

import { GameState } from '@/engine/models/GameState';
import { Trick } from '@/engine/models/Trick';
import { Player } from '@/engine/models/Player';
import { Team, PlayerId } from '@/types/game.types';
import { Suit, Rank } from '@/types/card.types';

export interface GameScore {
  rePoints: number;
  kontraPoints: number;
  winner: Team;
  winMargin: number;
  specialPoints: {
    against90?: Team;
    against60?: Team;
    against30?: Team;
    schwarz?: Team;
  };
  totalGameValue: number; // How many points the game is worth
}

/**
 * Calculate final score after game completion
 * TODO: Implement full Doppelkopf scoring
 */
export function calculateFinalScore(gameState: GameState): GameScore {
  // TODO: Implement score calculation
  const { rePoints, kontraPoints } = calculateTeamPoints(gameState);

  // Determine winner (need 121 to win, 120 is a tie)
  const winner = rePoints > kontraPoints ? Team.RE : Team.CONTRA;
  const winMargin = Math.abs(rePoints - kontraPoints);

  // Calculate special points
  const specialPoints = calculateSpecialPoints(rePoints, kontraPoints);

  // Calculate total game value
  const totalGameValue = calculateGameValue(rePoints, kontraPoints, specialPoints);

  return {
    rePoints,
    kontraPoints,
    winner,
    winMargin,
    specialPoints,
    totalGameValue,
  };
}

/**
 * Calculate card points for each team from completed tricks
 */
export function calculateTeamPoints(gameState: GameState): { rePoints: number; kontraPoints: number } {
  // TODO: Implement team point calculation
  let rePoints = 0;
  let kontraPoints = 0;

  gameState.completedTricks.forEach(trick => {
    const winnerId = trick.winnerId;
    if (!winnerId) return;

    const winner = gameState.getPlayer(winnerId);
    if (!winner) return;

    const trickPoints = trick.getTotalValue();

    if (winner.team === Team.RE) {
      rePoints += trickPoints;
    } else if (winner.team === Team.CONTRA) {
      kontraPoints += trickPoints;
    }
  });

  return { rePoints, kontraPoints };
}

/**
 * Calculate special points (against 90, 60, 30, schwarz)
 */
function calculateSpecialPoints(
  rePoints: number,
  kontraPoints: number
): {
  against90?: Team;
  against60?: Team;
  against30?: Team;
  schwarz?: Team;
} {
  // TODO: Implement special points
  const specialPoints: {
    against90?: Team;
    against60?: Team;
    against30?: Team;
    schwarz?: Team;
  } = {};

  // Check Re vs Kontra
  if (rePoints > kontraPoints) {
    if (kontraPoints < 90) specialPoints.against90 = Team.RE;
    if (kontraPoints < 60) specialPoints.against60 = Team.RE;
    if (kontraPoints < 30) specialPoints.against30 = Team.RE;
    if (kontraPoints === 0) specialPoints.schwarz = Team.RE;
  } else {
    if (rePoints < 90) specialPoints.against90 = Team.CONTRA;
    if (rePoints < 60) specialPoints.against60 = Team.CONTRA;
    if (rePoints < 30) specialPoints.against30 = Team.CONTRA;
    if (rePoints === 0) specialPoints.schwarz = Team.CONTRA;
  }

  return specialPoints;
}

/**
 * Calculate total game value in points
 */
function calculateGameValue(
  rePoints: number,
  kontraPoints: number,
  specialPoints: {
    against90?: Team;
    against60?: Team;
    against30?: Team;
    schwarz?: Team;
  }
): number {
  // TODO: Implement game value calculation
  let value = 1; // Base game

  // Add special points
  if (specialPoints.against90) value += 1;
  if (specialPoints.against60) value += 1;
  if (specialPoints.against30) value += 1;
  if (specialPoints.schwarz) value += 1;

  return value;
}

/**
 * Validate total points (should always be 240)
 */
export function validateTotalPoints(rePoints: number, kontraPoints: number): boolean {
  const total = rePoints + kontraPoints;
  return total === 240;
}

/**
 * Calculate current score during ongoing game
 */
export function calculateCurrentScore(gameState: GameState): { re: number; kontra: number } {
  const { rePoints, kontraPoints } = calculateTeamPoints(gameState);
  return { re: rePoints, kontra: kontraPoints };
}

/**
 * Check if a team has announced a specific level
 * TODO: Used for announcements (Re, No 90, etc.)
 */
export function hasTeamAnnounced(gameState: GameState, team: Team): boolean {
  const teamPlayers = gameState.getPlayersOnTeam(team);
  return teamPlayers.some(player => player.hasAnnounced);
}

/**
 * Calculate points needed for team to win
 */
export function getPointsNeededToWin(currentPoints: number): number {
  return Math.max(0, 121 - currentPoints);
}

/**
 * Check if game is mathematically decided
 * TODO: Can one team no longer win?
 */
export function isGameDecided(rePoints: number, kontraPoints: number, tricksRemaining: number): boolean {
  // TODO: Implement game decided logic
  // Maximum points remaining
  const maxPointsRemaining = tricksRemaining * 30; // Approximate max per trick

  // Can Re still win?
  const reCanWin = rePoints + maxPointsRemaining >= 121;

  // Can Kontra still win?
  const kontraCanWin = kontraPoints + maxPointsRemaining >= 121;

  // Game is decided if only one team can win
  return !(reCanWin && kontraCanWin);
}

/**
 * Detect if a Fox (Ace of Diamonds) was caught in this trick
 * Fox is caught when opponent team wins a trick containing your ♦A
 */
export function detectFoxCatch(
  trick: Trick,
  winnerId: PlayerId,
  players: Player[]
): { caughtByTeam: Team; fromPlayerId: PlayerId } | null {
  const winner = players.find(p => p.id === winnerId);
  if (!winner) return null;

  const winnerTeam = winner.team;

  // Check each card in the trick for Ace of Diamonds
  for (const playedCard of trick.cards) {
    const card = playedCard.card;
    const cardPlayer = players.find(p => p.id === playedCard.playerId);

    // Is this an Ace of Diamonds?
    if (card.suit === Suit.DIAMONDS && card.rank === Rank.ACE) {
      // Was it played by an opponent (different team than winner)?
      if (cardPlayer && cardPlayer.team !== winnerTeam) {
        return {
          caughtByTeam: winnerTeam,
          fromPlayerId: playedCard.playerId,
        };
      }
    }
  }

  return null;
}

/**
 * Detect if Karlchen was achieved (winning the last trick with Club Jack)
 */
export function detectKarlchen(
  trick: Trick,
  trickNumber: number,
  winnerId: PlayerId,
  players: Player[]
): { team: Team; playerId: PlayerId } | null {
  // Karlchen only counts on the last trick (trick 12 mit Neunen)
  if (trickNumber !== 12) return null;

  const winner = players.find(p => p.id === winnerId);
  if (!winner) return null;

  // Check if the winning card is the Club Jack
  const winningCard = trick.getCardByPlayer(winnerId);
  if (!winningCard) return null;

  if (winningCard.suit === Suit.CLUBS && winningCard.rank === Rank.JACK) {
    return {
      team: winner.team,
      playerId: winnerId,
    };
  }

  return null;
}

/**
 * Detect if a Doppelkopf trick occurred (trick worth 40+ points)
 * A trick has 40+ points when it contains multiple high-value cards (10s, Aces)
 */
export function detectDoppelkopfTrick(
  trick: Trick,
  winnerId: PlayerId,
  players: Player[]
): { team: Team; playerId: PlayerId; points: number } | null {
  const trickPoints = trick.getTotalValue();

  // Doppelkopf requires 40+ points in a single trick
  if (trickPoints < 40) return null;

  const winner = players.find(p => p.id === winnerId);
  if (!winner) return null;

  return {
    team: winner.team,
    playerId: winnerId,
    points: trickPoints,
  };
}
