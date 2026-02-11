/**
 * KARLCHEN_LATE_GAME Trigger
 * Info when holding Club Jack (Karlchen) in last tricks
 */

import { Suit, Rank } from '@/types/card.types';
import { Hint, HintContext } from '@/types/hint.types';

export function checkKarlchenLateGame(context: HintContext): Hint | null {
  const { selectedCard, playerHand, trickIndex } = context;

  // Only in late game (trick 10 or 11, since we have 12 tricks total)
  if (trickIndex < 10) return null;

  // Does player have Club Jack (Karlchen)?
  const hasKarlchen = playerHand.some(c =>
    c.suit === Suit.CLUBS && c.rank === Rank.JACK
  );
  if (!hasKarlchen) return null;

  // Is player about to play something else?
  const isPlayingKarlchen =
    selectedCard.suit === Suit.CLUBS && selectedCard.rank === Rank.JACK;
  if (isPlayingKarlchen) return null;

  // Only hint in trick 11 (last trick) or trick 10 if player might forget
  if (trickIndex === 11) {
    return {
      id: 'KARLCHEN_LATE_GAME',
      title: 'Karlchen-Chance!',
      message: 'Du hast noch einen Kreuz-Buben. Wenn du damit den letzten Stich gewinnst, gibt das einen Bonuspunkt ("Karlchen fängt den letzten Stich").',
      severity: 'info',
      learnMoreKey: 'tutorial.special.karlchen',
    };
  }

  // In trick 10, only hint if there are few cards left
  if (trickIndex === 10 && playerHand.length <= 2) {
    return {
      id: 'KARLCHEN_LATE_GAME',
      title: 'Karlchen für letzten Stich?',
      message: 'Du hast noch einen Kreuz-Buben. Überlege, ob du ihn für den letzten Stich aufheben möchtest (Bonuspunkt "Karlchen").',
      severity: 'info',
      learnMoreKey: 'tutorial.special.karlchen',
    };
  }

  return null;
}
