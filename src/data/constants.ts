/**
 * Game Constants - Card values, point thresholds, and game rules
 */

import { Suit, Rank } from '@/types/card.types';

/**
 * Card Point Values in Doppelkopf
 */
export const CARD_VALUES: Record<Rank, number> = {
  [Rank.ACE]: 11,
  [Rank.TEN]: 10,
  [Rank.KING]: 4,
  [Rank.QUEEN]: 3,
  [Rank.JACK]: 2,
  [Rank.NINE]: 0,
};

/**
 * Total points in a Doppelkopf game
 */
export const TOTAL_POINTS = 240;

/**
 * Points needed to win
 */
export const WIN_THRESHOLD = 121;

/**
 * Score thresholds for special points
 */
export const SCORE_THRESHOLDS = {
  AGAINST_90: 90,
  AGAINST_60: 60,
  AGAINST_30: 30,
  SCHWARZ: 0,
};

/**
 * Number of cards
 */
export const DECK_SIZE = 48;
export const HAND_SIZE = 12;
export const TRICK_SIZE = 4;
export const TOTAL_TRICKS = 12;

/**
 * Default trump suit
 */
export const DEFAULT_TRUMP_SUIT = Suit.DIAMONDS;

/**
 * Trump card counts
 */
export const TRUMP_COUNTS = {
  QUEENS: 8, // 4 suits × 2 copies
  JACKS: 8, // 4 suits × 2 copies
  DIAMONDS: 10, // 5 ranks × 2 copies (excluding Q, J which are already counted)
  TOTAL: 26,
};

/**
 * Game timing (in milliseconds)
 */
export const TIMING = {
  AI_THINKING_MIN: 500,
  AI_THINKING_MAX: 2000,
  CARD_ANIMATION: 300,
  TRICK_COMPLETION_DELAY: 1500,
  SCORE_DISPLAY_DELAY: 2000,
};

/**
 * Announcement deadlines (cards played)
 */
export const ANNOUNCEMENT_DEADLINES = {
  RE_KONTRA: 1, // Before 11th card (1 card played)
  NO_90: 3, // Before 9th card
  NO_60: 6, // Before 6th card
  NO_30: 9, // Before 3rd card
  SCHWARZ: 10, // Before 2nd card
};

/**
 * Game point values
 */
export const GAME_VALUES = {
  BASE: 1,
  AGAINST_90: 1,
  AGAINST_60: 1,
  AGAINST_30: 1,
  SCHWARZ: 1,
  ANNOUNCED_RE: 2,
  ANNOUNCED_NO_90: 2,
  ANNOUNCED_NO_60: 2,
  ANNOUNCED_NO_30: 2,
  ANNOUNCED_SCHWARZ: 2,
};

/**
 * Achievement point thresholds
 */
export const ACHIEVEMENT_THRESHOLDS = {
  FIRST_WIN: 1,
  TEN_WINS: 10,
  FIFTY_WINS: 50,
  PERFECT_GAME: 1, // Win with 240-0
  COMEBACK: 1, // Win after being behind
};

/**
 * Tutorial step requirements
 */
export const TUTORIAL_REQUIREMENTS = {
  GAMES_TO_COMPLETE: 3,
  MIN_SCORE_TO_PASS: 100,
};
