/**
 * Legal Moves Logic - Determine which cards a player can legally play
 *
 * Doppelkopf Rules:
 * 1. Must follow suit if possible (Bedienen)
 * 2. Trump counts as its own "suit"
 * 3. If can't follow suit, any card can be played
 * 4. First card of trick sets the lead suit
 */

import { Card } from '@/engine/models/Card';
import { Trick } from '@/engine/models/Trick';
import { Player } from '@/engine/models/Player';
import { Suit } from '@/types/card.types';

/**
 * Get all legal cards a player can play
 * TODO: Implement Doppelkopf Bedienzwang (must-follow) rules
 */
export function getLegalMoves(player: Player, currentTrick: Trick): Card[] {
  // TODO: Implement legal move detection
  const hand = player.hand;

  // First card of trick: any card is legal
  if (currentTrick.size === 0) {
    return [...hand];
  }

  const leadCard = currentTrick.getLeadCard();
  if (!leadCard) return [...hand];

  // If lead card is trump, must play trump if possible
  if (leadCard.isTrump) {
    const trumpCards = hand.filter(card => card.isTrump);
    if (trumpCards.length > 0) {
      return trumpCards;
    }
    // No trump? Any card is legal
    return [...hand];
  }

  // Lead card is non-trump: must follow suit if possible
  const leadSuit = leadCard.suit;
  const sameSuitCards = hand.filter(card => card.suit === leadSuit && !card.isTrump);

  if (sameSuitCards.length > 0) {
    return sameSuitCards;
  }

  // Can't follow suit: any card is legal
  return [...hand];
}

/**
 * Check if a specific card is a legal move
 */
export function isLegalMove(card: Card, player: Player, currentTrick: Trick): boolean {
  const legalMoves = getLegalMoves(player, currentTrick);
  return legalMoves.some(legalCard => legalCard.id === card.id);
}

/**
 * Check if player must follow suit (Bedienen)
 */
export function mustFollowSuit(player: Player, currentTrick: Trick): boolean {
  const legalMoves = getLegalMoves(player, currentTrick);
  return legalMoves.length < player.hand.length;
}

/**
 * Get suit that player must follow (if any)
 */
export function getRequiredSuit(currentTrick: Trick): Suit | 'trump' | null {
  if (currentTrick.size === 0) return null;

  const leadCard = currentTrick.getLeadCard();
  if (!leadCard) return null;

  if (leadCard.isTrump) return 'trump';
  return leadCard.suit;
}

/**
 * Check if player has any cards of a specific suit
 */
export function hasSuit(player: Player, suit: Suit | 'trump'): boolean {
  if (suit === 'trump') {
    return player.hand.some(card => card.isTrump);
  }
  return player.hand.some(card => card.suit === suit && !card.isTrump);
}

/**
 * Get all cards that can potentially win the current trick
 * TODO: Useful for AI decision making
 */
export function getWinningMoves(player: Player, currentTrick: Trick): Card[] {
  // TODO: Implement winning move detection
  const legalMoves = getLegalMoves(player, currentTrick);

  if (currentTrick.size === 0) {
    // Any card can "win" if we're leading
    return legalMoves;
  }

  // TODO: Filter for cards that can beat current winning card
  // This requires implementing card comparison logic
  return legalMoves;
}

/**
 * Check if player can possibly win this trick
 */
export function canWinTrick(player: Player, currentTrick: Trick): boolean {
  const winningMoves = getWinningMoves(player, currentTrick);
  return winningMoves.length > 0;
}

/**
 * German suit names for error messages
 */
const SUIT_NAMES_DE: Record<Suit, string> = {
  [Suit.CLUBS]: 'Kreuz',
  [Suit.SPADES]: 'Pik',
  [Suit.HEARTS]: 'Herz',
  [Suit.DIAMONDS]: 'Karo',
};

/**
 * Validate a move before it's played
 * Returns German error messages with Doppelkopf rule explanations
 */
export function validateMove(
  card: Card,
  player: Player,
  currentTrick: Trick
): { valid: boolean; reason?: string; explanation?: string } {
  // Check if player has the card
  if (!player.hasCard(card.id)) {
    return {
      valid: false,
      reason: 'Karte nicht gefunden',
      explanation: 'Diese Karte ist nicht in deiner Hand.',
    };
  }

  // Check if trick is already complete
  if (currentTrick.isComplete()) {
    return {
      valid: false,
      reason: 'Stich ist vollständig',
      explanation: 'Der aktuelle Stich hat bereits 4 Karten.',
    };
  }

  // Check if card is legal
  if (!isLegalMove(card, player, currentTrick)) {
    const requiredSuit = getRequiredSuit(currentTrick);

    if (requiredSuit === 'trump') {
      return {
        valid: false,
        reason: 'Du musst Trumpf bedienen!',
        explanation:
          'In Doppelkopf gilt Bedienzwang: Wenn Trumpf angespielt wurde und du noch Trumpfkarten hast, musst du eine davon spielen.',
      };
    } else if (requiredSuit) {
      const suitName = SUIT_NAMES_DE[requiredSuit];
      return {
        valid: false,
        reason: `Du musst ${suitName} bedienen!`,
        explanation: `In Doppelkopf gilt Bedienzwang: Wenn ${suitName} angespielt wurde und du noch ${suitName}-Karten hast, musst du eine davon spielen.`,
      };
    }

    return {
      valid: false,
      reason: 'Ungültiger Zug',
      explanation: 'Diese Karte kann jetzt nicht gespielt werden.',
    };
  }

  return { valid: true };
}
