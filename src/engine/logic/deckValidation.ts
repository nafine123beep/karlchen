import { Card } from '../models/Card';
import { Suit, Rank } from '@/types/card.types';

export interface DeckValidationResult {
  ok: boolean;
  errors: string[];
}

const ALL_SUITS = [Suit.CLUBS, Suit.SPADES, Suit.HEARTS, Suit.DIAMONDS];
const ALL_RANKS = [Rank.NINE, Rank.JACK, Rank.QUEEN, Rank.KING, Rank.TEN, Rank.ACE];
const EXPECTED_TOTAL = ALL_SUITS.length * ALL_RANKS.length * 2; // 48
const EXPECTED_COPIES = 2;

function cardKey(card: Card): string {
  return `${card.suit}_${card.rank}`;
}

export function validateDoubleDeckDistribution(hands: Card[][]): DeckValidationResult {
  const errors: string[] = [];
  const allCards = hands.flat();

  // Check total count
  if (allCards.length !== EXPECTED_TOTAL) {
    errors.push(`Total cards: expected ${EXPECTED_TOTAL}, got ${allCards.length}`);
  }

  // Count occurrences per suit_rank key
  const counts = new Map<string, number>();
  for (const card of allCards) {
    const key = cardKey(card);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  // Build expected keys
  const expectedKeys = new Set<string>();
  for (const suit of ALL_SUITS) {
    for (const rank of ALL_RANKS) {
      expectedKeys.add(`${suit}_${rank}`);
    }
  }

  // Check each expected key has exactly 2
  for (const key of expectedKeys) {
    const count = counts.get(key) ?? 0;
    if (count !== EXPECTED_COPIES) {
      errors.push(`${key}: expected ${EXPECTED_COPIES}, got ${count}`);
    }
  }

  // Check for unexpected keys
  for (const key of counts.keys()) {
    if (!expectedKeys.has(key)) {
      errors.push(`Unexpected card key: ${key} (count: ${counts.get(key)})`);
    }
  }

  return { ok: errors.length === 0, errors };
}
