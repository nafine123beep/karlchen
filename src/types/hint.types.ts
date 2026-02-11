/**
 * Hint System Type Definitions
 */

import { Card } from '@/engine/models/Card';
import { Trick } from '@/engine/models/Trick';
import { Team } from '@/types/game.types';

export type HintId =
  | 'FOLLOW_SUIT_OR_TRUMP'
  | 'TRUMP_BEATS_SUIT'
  | 'SAVE_HIGH_TRUMPS'
  | 'FOX_PROTECTION'
  | 'EYES_MANAGEMENT'
  | 'SCHMIEREN'
  | 'KARLCHEN_LATE_GAME';

export interface Hint {
  id: HintId;
  title: string;           // German, short (e.g., "Bedienpflicht beachten!")
  message: string;         // German, detailed explanation (1-2 sentences)
  severity: 'info' | 'warn';
  learnMoreKey?: string;   // Optional tutorial reference
}

export interface HintContext {
  selectedCard: Card;
  playerHand: Card[];
  currentTrick: Trick;
  legalMoves: Card[];
  completedTricks: Trick[];
  trickIndex: number;
  playerTeam: Team;
  announcements: { re: boolean; kontra: boolean };
}
