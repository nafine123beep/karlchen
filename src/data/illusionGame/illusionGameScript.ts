/**
 * Illusion Game Script - Predefined card distributions and AI moves
 *
 * Teaches: Dulle, Trump hierarchy, Farbzwang, trumping when void, highest card wins.
 *
 * 48 cards total (4 suits x 6 ranks x 2 copies):
 * - 26 trump cards (2 Dulles + 8 Queens + 8 Jacks + 8 Diamond non-face)
 * - 22 non-trump cards (Clubs/Spades: A, 10, K, 9 x 2 + Hearts: A, K, 9 x 2)
 *
 * Human (P0) is Team Re with strong trump hand including one Dulle.
 * P2 is partner (Re). P1 and P3 are Kontra.
 */

import { Suit, Rank } from '@/types/card.types';

export interface CardDef {
  suit: Suit;
  rank: Rank;
  copyNumber: 1 | 2;
}

/** Build card ID matching Card constructor: `${suit}_${rank}_${copyNumber}` */
export function cardId(suit: Suit, rank: Rank, copy: 1 | 2): string {
  return `${suit}_${rank}_${copy}`;
}

// ============================================================
// HAND DISTRIBUTIONS (verified: all 48 cards assigned exactly once)
// ============================================================

/** Player 0 (Human, Re): 8 trumps, 4 non-trumps */
export const HAND_PLAYER_0: CardDef[] = [
  { suit: Suit.HEARTS, rank: Rank.TEN, copyNumber: 1 },     // trump order 0 (Dulle – highest!)
  { suit: Suit.CLUBS, rank: Rank.QUEEN, copyNumber: 1 },     // trump order 1
  { suit: Suit.SPADES, rank: Rank.QUEEN, copyNumber: 1 },    // trump order 2
  { suit: Suit.HEARTS, rank: Rank.QUEEN, copyNumber: 1 },    // trump order 3
  { suit: Suit.CLUBS, rank: Rank.JACK, copyNumber: 1 },      // trump order 5
  { suit: Suit.SPADES, rank: Rank.JACK, copyNumber: 1 },     // trump order 6
  { suit: Suit.DIAMONDS, rank: Rank.ACE, copyNumber: 1 },    // trump order 9 (Fox)
  { suit: Suit.DIAMONDS, rank: Rank.TEN, copyNumber: 1 },    // trump order 10
  { suit: Suit.SPADES, rank: Rank.ACE, copyNumber: 1 },      // non-trump
  { suit: Suit.SPADES, rank: Rank.TEN, copyNumber: 1 },      // non-trump
  { suit: Suit.HEARTS, rank: Rank.ACE, copyNumber: 1 },      // non-trump
  { suit: Suit.CLUBS, rank: Rank.NINE, copyNumber: 1 },      // non-trump
];

/** Player 1 (AI, Kontra): 6 trumps, 6 non-trumps */
export const HAND_PLAYER_1: CardDef[] = [
  { suit: Suit.HEARTS, rank: Rank.TEN, copyNumber: 2 },     // trump order 0 (Dulle!)
  { suit: Suit.DIAMONDS, rank: Rank.QUEEN, copyNumber: 1 },  // trump order 4
  { suit: Suit.HEARTS, rank: Rank.JACK, copyNumber: 1 },     // trump order 7
  { suit: Suit.DIAMONDS, rank: Rank.JACK, copyNumber: 1 },   // trump order 8
  { suit: Suit.DIAMONDS, rank: Rank.ACE, copyNumber: 2 },    // trump order 9
  { suit: Suit.DIAMONDS, rank: Rank.NINE, copyNumber: 1 },   // trump order 12
  { suit: Suit.CLUBS, rank: Rank.ACE, copyNumber: 1 },       // non-trump
  { suit: Suit.CLUBS, rank: Rank.TEN, copyNumber: 1 },       // non-trump
  { suit: Suit.CLUBS, rank: Rank.KING, copyNumber: 1 },      // non-trump
  { suit: Suit.SPADES, rank: Rank.KING, copyNumber: 1 },     // non-trump
  { suit: Suit.SPADES, rank: Rank.NINE, copyNumber: 1 },     // non-trump
  { suit: Suit.HEARTS, rank: Rank.KING, copyNumber: 1 },     // non-trump
];

/** Player 2 (AI, Re partner): 5 trumps, 7 non-trumps */
export const HAND_PLAYER_2: CardDef[] = [
  { suit: Suit.CLUBS, rank: Rank.QUEEN, copyNumber: 2 },     // trump order 1
  { suit: Suit.DIAMONDS, rank: Rank.QUEEN, copyNumber: 2 },  // trump order 4
  { suit: Suit.DIAMONDS, rank: Rank.TEN, copyNumber: 2 },    // trump order 10
  { suit: Suit.DIAMONDS, rank: Rank.KING, copyNumber: 2 },   // trump order 11
  { suit: Suit.DIAMONDS, rank: Rank.NINE, copyNumber: 2 },   // trump order 12
  { suit: Suit.CLUBS, rank: Rank.ACE, copyNumber: 2 },       // non-trump
  { suit: Suit.CLUBS, rank: Rank.TEN, copyNumber: 2 },       // non-trump
  { suit: Suit.SPADES, rank: Rank.ACE, copyNumber: 2 },      // non-trump
  { suit: Suit.SPADES, rank: Rank.TEN, copyNumber: 2 },      // non-trump
  { suit: Suit.SPADES, rank: Rank.NINE, copyNumber: 2 },     // non-trump
  { suit: Suit.HEARTS, rank: Rank.NINE, copyNumber: 2 },     // non-trump
  { suit: Suit.HEARTS, rank: Rank.ACE, copyNumber: 2 },      // non-trump
];

/** Player 3 (AI, Kontra): 7 trumps, 5 non-trumps */
export const HAND_PLAYER_3: CardDef[] = [
  { suit: Suit.SPADES, rank: Rank.QUEEN, copyNumber: 2 },    // trump order 2
  { suit: Suit.HEARTS, rank: Rank.QUEEN, copyNumber: 2 },    // trump order 3
  { suit: Suit.CLUBS, rank: Rank.JACK, copyNumber: 2 },      // trump order 5
  { suit: Suit.SPADES, rank: Rank.JACK, copyNumber: 2 },     // trump order 6
  { suit: Suit.HEARTS, rank: Rank.JACK, copyNumber: 2 },     // trump order 7
  { suit: Suit.DIAMONDS, rank: Rank.JACK, copyNumber: 2 },   // trump order 8
  { suit: Suit.DIAMONDS, rank: Rank.KING, copyNumber: 1 },   // trump order 11
  { suit: Suit.CLUBS, rank: Rank.KING, copyNumber: 2 },      // non-trump
  { suit: Suit.CLUBS, rank: Rank.NINE, copyNumber: 2 },      // non-trump
  { suit: Suit.SPADES, rank: Rank.KING, copyNumber: 2 },     // non-trump
  { suit: Suit.HEARTS, rank: Rank.NINE, copyNumber: 1 },     // non-trump
  { suit: Suit.HEARTS, rank: Rank.KING, copyNumber: 2 },     // non-trump
];

export const ILLUSION_HANDS: CardDef[][] = [
  HAND_PLAYER_0,
  HAND_PLAYER_1,
  HAND_PLAYER_2,
  HAND_PLAYER_3,
];

// ============================================================
// AI MOVE SCRIPT (12 tricks)
// ============================================================

/**
 * For each trick, the AI players' predetermined card IDs.
 * The human chooses freely from their legal moves.
 *
 * If a scripted AI move is illegal (because human played unexpectedly),
 * the engine falls back to any legal move from that player's hand.
 *
 * Expected trick flow:
 *  0: P0 leads HT1 → P0 wins (teach: Dulle is highest trump)
 *  1: P0 leads CN1 → P1 wins with CA1 (teach: suit play)
 *  2: P1 leads CK1, P0 trumps → P0 wins (teach: trumping when void)
 *  3: P0 leads SA1 → P0 wins (teach: Ace wins suit trick)
 *  4: P0 leads ST1, P3 trumps → P3 wins (teach: opponent trumps)
 *  5: P3 leads SJ2, P0 plays HQ1 → P0 wins (teach: Queen > Jack)
 *  6: P0 leads SQ1, P2 plays CQ2 → P2 wins (teach: partner wins)
 *  7: P2 leads HA2 → P2 wins (teach: Farbzwang, human follows Hearts)
 *  8: P2 leads S92, P3 trumps → P3 wins (teach: trumping)
 *  9: P3 leads SQ2 → P3 wins (teach: opponent strong trump)
 * 10: P3 leads DJ2, P1 plays HT2 → P1 wins (teach: Dulle beats everything)
 * 11: P1 leads DQ1 → P1 wins (teach: Queen beats Jack)
 *
 * Re team (P0+P2) wins 132-108.
 */
export const ILLUSION_AI_MOVES: Record<string, string>[] = [
  // Trick 0: P0 leads (human plays HT1 ideally — Dulle!)
  {
    player_1: cardId(Suit.DIAMONDS, Rank.NINE, 1),
    player_2: cardId(Suit.DIAMONDS, Rank.NINE, 2),
    player_3: cardId(Suit.DIAMONDS, Rank.KING, 1),
  },
  // Trick 1: P0 leads (human plays CN1 ideally)
  {
    player_1: cardId(Suit.CLUBS, Rank.ACE, 1),
    player_2: cardId(Suit.CLUBS, Rank.TEN, 2),
    player_3: cardId(Suit.CLUBS, Rank.NINE, 2),
  },
  // Trick 2: P1 leads CK1
  {
    player_1: cardId(Suit.CLUBS, Rank.KING, 1),
    player_2: cardId(Suit.CLUBS, Rank.ACE, 2),
    player_3: cardId(Suit.CLUBS, Rank.KING, 2),
  },
  // Trick 3: P0 leads (human plays SA1 ideally)
  {
    player_1: cardId(Suit.SPADES, Rank.KING, 1),
    player_2: cardId(Suit.SPADES, Rank.ACE, 2),
    player_3: cardId(Suit.SPADES, Rank.KING, 2),
  },
  // Trick 4: P0 leads (human plays ST1 ideally)
  {
    player_1: cardId(Suit.SPADES, Rank.NINE, 1),
    player_2: cardId(Suit.SPADES, Rank.TEN, 2),
    player_3: cardId(Suit.HEARTS, Rank.JACK, 2),  // P3 trumps!
  },
  // Trick 5: P3 leads SJ2
  {
    player_1: cardId(Suit.DIAMONDS, Rank.JACK, 1),
    player_2: cardId(Suit.DIAMONDS, Rank.TEN, 2),
    player_3: cardId(Suit.SPADES, Rank.JACK, 2),
  },
  // Trick 6: P0 leads (human plays SQ1 ideally)
  {
    player_1: cardId(Suit.DIAMONDS, Rank.ACE, 2),
    player_2: cardId(Suit.CLUBS, Rank.QUEEN, 2),
    player_3: cardId(Suit.CLUBS, Rank.JACK, 2),
  },
  // Trick 7: P2 leads HA2
  {
    player_1: cardId(Suit.HEARTS, Rank.KING, 1),
    player_2: cardId(Suit.HEARTS, Rank.ACE, 2),
    player_3: cardId(Suit.HEARTS, Rank.KING, 2),
  },
  // Trick 8: P2 leads S92
  {
    player_1: cardId(Suit.CLUBS, Rank.TEN, 1),
    player_2: cardId(Suit.SPADES, Rank.NINE, 2),
    player_3: cardId(Suit.HEARTS, Rank.QUEEN, 2),  // P3 trumps!
  },
  // Trick 9: P3 leads SQ2
  {
    player_1: cardId(Suit.HEARTS, Rank.JACK, 1),
    player_2: cardId(Suit.DIAMONDS, Rank.KING, 2),
    player_3: cardId(Suit.SPADES, Rank.QUEEN, 2),
  },
  // Trick 10: P3 leads DJ2, P1 plays Dulle!
  {
    player_1: cardId(Suit.HEARTS, Rank.TEN, 2),
    player_2: cardId(Suit.DIAMONDS, Rank.QUEEN, 2),
    player_3: cardId(Suit.DIAMONDS, Rank.JACK, 2),
  },
  // Trick 11: P1 leads DQ1
  {
    player_1: cardId(Suit.DIAMONDS, Rank.QUEEN, 1),
    player_2: cardId(Suit.HEARTS, Rank.NINE, 2),
    player_3: cardId(Suit.HEARTS, Rank.NINE, 1),
  },
];
