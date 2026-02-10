import { Deck } from '@/engine/models/Deck';
import { Card } from '@/engine/models/Card';
import { validateDoubleDeckDistribution } from '@/engine/logic/deckValidation';
import { Suit, Rank } from '@/types/card.types';

function dealHands(): [Card[], Card[], Card[], Card[]] {
  const deck = new Deck();
  return deck.deal();
}

describe('validateDoubleDeckDistribution', () => {
  it('accepts a correctly dealt double deck', () => {
    const hands = dealHands();
    const result = validateDoubleDeckDistribution(hands);

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects when a card appears only once (missing duplicate)', () => {
    const hands = dealHands();
    const removed = hands[0].pop()!; // remove one card from first hand

    const result = validateDoubleDeckDistribution(hands);

    expect(result.ok).toBe(false);
    const key = `${removed.suit}_${removed.rank}`;
    const relevantError = result.errors.find(e => e.includes(key));
    expect(relevantError).toBeDefined();
    expect(relevantError).toContain('got 1');
  });

  it('rejects when a card appears three times (duplicate overflow)', () => {
    const hands = dealHands();
    // Add a duplicate of the first card in hand 0 to hand 1
    const duplicated = hands[0][0];
    const extra = new Card(duplicated.suit as Suit, duplicated.rank as Rank, 1);
    hands[1].push(extra);

    const result = validateDoubleDeckDistribution(hands);

    expect(result.ok).toBe(false);
    const key = `${duplicated.suit}_${duplicated.rank}`;
    const relevantError = result.errors.find(e => e.includes(key));
    expect(relevantError).toBeDefined();
    expect(relevantError).toContain('got 3');
  });

  it('rejects when total card count is wrong', () => {
    const hands = dealHands();
    hands[2].pop(); // remove one card

    const result = validateDoubleDeckDistribution(hands);

    expect(result.ok).toBe(false);
    const totalError = result.errors.find(e => e.startsWith('Total cards:'));
    expect(totalError).toBeDefined();
    expect(totalError).toContain('got 47');
  });
});
