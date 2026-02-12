/**
 * Illusion Game Hints - Contextual teaching hints for each trick
 *
 * These hints are shown before the human's turn in specific tricks.
 * They explain WHY, not just WHAT, to help beginners understand the rules.
 */

import { Hint } from '@/types/hint.types';

export interface IllusionHint {
  trickNumber: number;
  timing: 'before_play' | 'after_trick';
  hint: Hint;
}

export const ILLUSION_HINTS: IllusionHint[] = [
  // Trick 0: First move - introduce trump concept
  {
    trickNumber: 0,
    timing: 'before_play',
    hint: {
      id: 'TRUMP_BEATS_SUIT',
      title: 'Dein erster Stich!',
      message:
        'Du hast die Kreuz-Dame – den stärksten Trumpf im Spiel! Spiele sie aus, um den Stich sicher zu gewinnen. Trumpfkarten haben einen goldenen Rand.',
      severity: 'info',
    },
  },
  // Trick 1: Teach suit play
  {
    trickNumber: 1,
    timing: 'before_play',
    hint: {
      id: 'FOLLOW_SUIT_OR_TRUMP',
      title: 'Fehlfarben ausspielen',
      message:
        'Spiele eine Fehlfarbe (nicht Trumpf) aus. Die anderen Spieler müssen die gleiche Farbe bedienen – das nennt man Farbzwang.',
      severity: 'info',
    },
  },
  // Trick 2: Teach trumping when void
  {
    trickNumber: 2,
    timing: 'before_play',
    hint: {
      id: 'TRUMP_BEATS_SUIT',
      title: 'Stechen mit Trumpf!',
      message:
        'Kreuz wurde ausgespielt, aber du hast kein Kreuz mehr. Du darfst jetzt eine beliebige Karte spielen – mit einem Trumpf kannst du den Stich gewinnen!',
      severity: 'info',
    },
  },
  // Trick 3: Reinforce suit play with Ace
  {
    trickNumber: 3,
    timing: 'before_play',
    hint: {
      id: 'EYES_MANAGEMENT',
      title: 'Hohe Karten nutzen',
      message:
        'Spiele dein Pik-Ass aus. Bei Fehlfarben gewinnt die höchste Karte den Stich – und das Ass ist die höchste!',
      severity: 'info',
    },
  },
  // Trick 4: After opponent trumps your card
  {
    trickNumber: 4,
    timing: 'after_trick',
    hint: {
      id: 'TRUMP_BEATS_SUIT',
      title: 'Gestochen!',
      message:
        'Dein Gegner hatte kein Pik und hat mit Trumpf gestochen. Trumpf schlägt immer Fehlfarben – auch wenn deine Karte hoch war!',
      severity: 'warn',
    },
  },
  // Trick 5: Teach trump hierarchy (Queen > Jack)
  {
    trickNumber: 5,
    timing: 'before_play',
    hint: {
      id: 'SAVE_HIGH_TRUMPS',
      title: 'Trumpf-Hierarchie',
      message:
        'Ein Bube (Trumpf) wurde gespielt. Deine Damen sind stärker als alle Buben! Spiele eine Dame, um den Stich zu gewinnen.',
      severity: 'info',
    },
  },
  // Trick 7: Teach Farbzwang when following suit
  {
    trickNumber: 7,
    timing: 'before_play',
    hint: {
      id: 'FOLLOW_SUIT_OR_TRUMP',
      title: 'Farbzwang',
      message:
        'Herz wurde ausgespielt. Du hast Herz-Karten, also musst du Herz bedienen. Das ist die Bedienpflicht (Farbzwang).',
      severity: 'info',
    },
  },
  // Trick 10: Trumping to win
  {
    trickNumber: 10,
    timing: 'before_play',
    hint: {
      id: 'TRUMP_BEATS_SUIT',
      title: 'Letzter Trumpfstich',
      message:
        'Du hast kein Herz mehr – spiele einen Trumpf, um den Stich zu gewinnen! Jeder Trumpf schlägt jede Fehlfarbe.',
      severity: 'info',
    },
  },
];

/**
 * Get the hint for a specific trick, if one exists.
 */
export function getIllusionHint(
  trickNumber: number,
  timing: 'before_play' | 'after_trick'
): Hint | null {
  const entry = ILLUSION_HINTS.find(
    h => h.trickNumber === trickNumber && h.timing === timing
  );
  return entry?.hint ?? null;
}
