/**
 * Trick Logic - Determines trick winners and validates trick play
 */

import { Trick } from '@/engine/models/Trick';
import { Card } from '@/engine/models/Card';
import { PlayerId } from '@/types/game.types';
import { Suit } from '@/types/card.types';
import { compareTrumpCards } from './trumpLogic';

/**
 * Calculate the winner of a completed trick
 * TODO: Implement Doppelkopf trick winner logic
 *
 * Rules:
 * 1. Highest trump wins (if any trump played)
 * 2. Otherwise, highest card of lead suit wins
 * 3. Cards not matching lead suit cannot win (unless trump)
 */
export function calculateTrickWinner(trick: Trick): PlayerId | null {
  // TODO: Implement trick winner calculation
  if (!trick.isComplete()) return null;

  const cards = trick.getCards();
  const playOrder = trick.getPlayOrder();

  // Separate trump and non-trump cards
  const trumpCards = cards.filter(c => c.isTrump);
  const leadSuit = trick.getLeadSuit();

  // If any trump cards, highest trump wins
  if (trumpCards.length > 0) {
    let highestTrump = trumpCards[0];
    trumpCards.forEach(card => {
      if (compareTrumpCards(card, highestTrump) < 0) {
        highestTrump = card;
      }
    });

    // Find who played this card
    const winnerIndex = cards.indexOf(highestTrump);
    return playOrder[winnerIndex];
  }

  // No trump, find highest card of lead suit
  if (leadSuit) {
    const leadSuitCards = cards.filter(c => c.suit === leadSuit && !c.isTrump);
    if (leadSuitCards.length > 0) {
      let highestCard = leadSuitCards[0];
      leadSuitCards.forEach(card => {
        if (card.compareTo(highestCard, leadSuit) > 0) {
          highestCard = card;
        }
      });

      const winnerIndex = cards.indexOf(highestCard);
      return playOrder[winnerIndex];
    }
  }

  // Fallback: lead player wins (shouldn't happen in valid game)
  return trick.leadPlayerId;
}

/**
 * Validate if a trick is properly formed
 * TODO: Check that all 4 cards follow the rules
 */
export function validateTrick(trick: Trick): boolean {
  // TODO: Implement trick validation
  // Check that trick has exactly 4 cards
  if (!trick.isComplete()) return false;

  // Check that all cards are from different players
  const playOrder = trick.getPlayOrder();
  const uniquePlayers = new Set(playOrder);
  if (uniquePlayers.size !== 4) return false;

  return true;
}

/**
 * Check if a card can beat another card in a trick context
 */
export function canBeat(card: Card, otherCard: Card, leadSuit: Suit | null): boolean {
  // TODO: Implement beat logic
  // Trump always beats non-trump
  if (card.isTrump && !otherCard.isTrump) return true;
  if (!card.isTrump && otherCard.isTrump) return false;

  // Both trump: compare trump order
  if (card.isTrump && otherCard.isTrump) {
    return compareTrumpCards(card, otherCard) < 0; // Lower order wins
  }

  // Both non-trump: must match lead suit to beat
  if (leadSuit && card.suit === leadSuit && otherCard.suit === leadSuit) {
    return card.compareTo(otherCard, leadSuit) > 0;
  }

  // Card not matching lead suit cannot beat
  return false;
}

/**
 * Get the current winning card in an incomplete trick
 */
export function getCurrentWinningCard(trick: Trick): Card | null {
  const cards = trick.getCards();
  if (cards.length === 0) return null;

  let winningCard = cards[0];
  const leadSuit = trick.getLeadSuit();

  cards.forEach(card => {
    if (canBeat(card, winningCard, leadSuit)) {
      winningCard = card;
    }
  });

  return winningCard;
}

/**
 * Get the player currently winning the trick
 */
export function getCurrentWinningPlayer(trick: Trick): PlayerId | null {
  const winningCard = getCurrentWinningCard(trick);
  if (!winningCard) return null;

  const cards = trick.getCards();
  const playOrder = trick.getPlayOrder();
  const winnerIndex = cards.indexOf(winningCard);

  return playOrder[winnerIndex];
}

/**
 * Calculate points in a trick
 */
export function getTrickPoints(trick: Trick): number {
  return trick.getTotalValue();
}

/**
 * Check if trick contains a Doppelkopf (40+ points in a single trick)
 */
export function isDoppelkopf(trick: Trick): boolean {
  return getTrickPoints(trick) >= 40;
}
