/**
 * Learning Explanations - Hardcoded explanations for game concepts
 */

import { TipCategory } from '@/types/learning.types';

export interface Explanation {
  id: string;
  category: TipCategory;
  title: string;
  shortText: string;
  longText: string;
  example?: string;
}

/**
 * Trump explanations
 */
export const TRUMP_EXPLANATIONS: Explanation[] = [
  {
    id: 'trump_basics',
    category: TipCategory.Trump,
    title: 'Was sind Trümpfe?',
    shortText: 'Trümpfe sind die stärksten Karten und stechen alle anderen.',
    longText:
      'In Doppelkopf sind Trümpfe besondere Karten, die stärker sind als normale Karten. ' +
      'Sie können jeden Stich gewinnen, egal welche Farbe ausgespielt wurde. ' +
      'Zu den Trümpfen gehören: alle Damen, alle Buben und alle Karo-Karten.',
    example:
      'Wenn Herz ausgespielt wird, aber du Karo 9 (Trumpf) spielst, gewinnst du den Stich!',
  },
  {
    id: 'trump_order',
    category: TipCategory.Trump,
    title: 'Trumpf-Reihenfolge',
    shortText: 'Nicht alle Trümpfe sind gleich stark!',
    longText:
      'Die Trumpf-Reihenfolge von hoch nach niedrig: ' +
      '1. Kreuz-Dame (höchster Trumpf!) ' +
      '2. Pik-Dame ' +
      '3. Herz-Dame ' +
      '4. Karo-Dame ' +
      '5. Kreuz-Bube ' +
      '6. Pik-Bube ' +
      '7. Herz-Bube ' +
      '8. Karo-Bube ' +
      '9. Karo-Ass ' +
      '10. Karo-10 ' +
      '11. Karo-König ' +
      '12. Karo-9 (niedrigster Trumpf)',
    example: 'Kreuz-Dame schlägt alle anderen Trümpfe!',
  },
];

/**
 * Team play explanations
 */
export const TEAM_EXPLANATIONS: Explanation[] = [
  {
    id: 'teams_basics',
    category: TipCategory.TeamPlay,
    title: 'Re und Kontra',
    shortText: 'Doppelkopf ist ein Teamspiel - 2 gegen 2!',
    longText:
      'In Doppelkopf spielst du nicht alleine! Es gibt zwei Teams: ' +
      'Re (die Kreuz-Damen-Spieler) und Kontra (alle anderen). ' +
      'Wer eine oder beide Kreuz-Damen hat, spielt im Re-Team. ' +
      'Die anderen beiden Spieler bilden automatisch das Kontra-Team.',
    example:
      'Wenn du eine Kreuz-Dame hast, bist du "Re" und spielst mit dem anderen Kreuz-Damen-Spieler zusammen!',
  },
  {
    id: 'partner_play',
    category: TipCategory.TeamPlay,
    title: 'Partnerschaft',
    shortText: 'Helfe deinem Partner, Stiche zu gewinnen!',
    longText:
      'Gutes Teamspiel ist essentiell. Wenn dein Partner einen Stich gewinnt, ' +
      'musst du nicht auch noch hohe Karten spielen. Spare deine starken Karten für später! ' +
      'Andererseits: Wenn ein Gegner gewinnt, versuche den Stich zu übernehmen.',
    example:
      'Partner gewinnt mit Kreuz-Dame? Spiel deine niedrigste Karte (z.B. Karo 9) um Karten zu sparen!',
  },
];

/**
 * Scoring explanations
 */
export const SCORING_EXPLANATIONS: Explanation[] = [
  {
    id: 'scoring_basics',
    category: TipCategory.Scoring,
    title: 'Punkte zählen',
    shortText: 'Ziel: Mehr als 120 Punkte sammeln!',
    longText:
      'Jede Karte hat einen Punktwert: Ass=11, 10=10, König=4, Dame=3, Bube=2, 9=0. ' +
      'Insgesamt gibt es 240 Punkte im Spiel. Um zu gewinnen, braucht dein Team mehr als 120 Punkte. ' +
      'Die Punkte werden am Ende gezählt, nachdem alle 12 Stiche gespielt wurden.',
    example: 'Dein Team hat 135 Punkte? Gewonnen! Das andere Team hat nur 105.',
  },
  {
    id: 'special_points',
    category: TipCategory.Scoring,
    title: 'Sonderpunkte',
    shortText: 'Gewinne mit hohem Vorsprung für Extra-Punkte!',
    longText:
      'Neben dem Grundspiel (1 Punkt) gibt es Extra-Punkte: ' +
      'Gegen 90 (+1): Gegner unter 90 Punkte ' +
      'Gegen 60 (+1): Gegner unter 60 Punkte ' +
      'Gegen 30 (+1): Gegner unter 30 Punkte ' +
      'Schwarz (+1): Gegner macht keinen Stich',
    example: 'Gewinnst du mit 180:60 Punkten, bekommst du: 1 (gewonnen) + 1 (gegen 90) + 1 (gegen 60) = 3 Punkte!',
  },
];

/**
 * Strategy explanations
 */
export const STRATEGY_EXPLANATIONS: Explanation[] = [
  {
    id: 'strategy_bedienen',
    category: TipCategory.Strategy,
    title: 'Bedienpflicht',
    shortText: 'Du MUSST die ausgespielte Farbe bedienen!',
    longText:
      'Wichtigste Regel: Wenn eine Farbe (z.B. Herz) ausgespielt wird und du Herz-Karten hast, ' +
      'MUSST du Herz spielen. Nur wenn du keine Karte dieser Farbe hast, darfst du eine andere Farbe spielen. ' +
      'Trümpfe zählen als eigene "Farbe".',
    example: 'Herz wird ausgespielt, du hast Herz-König? Du MUSST Herz-König spielen!',
  },
  {
    id: 'strategy_trumpf_use',
    category: TipCategory.Strategy,
    title: 'Wann Trümpfe spielen?',
    shortText: 'Spare hohe Trümpfe für wichtige Stiche!',
    longText:
      'Verschwende deine hohen Trümpfe (Damen, Buben) nicht früh im Spiel. ' +
      'Nutze sie, wenn wertvolle Karten im Stich liegen (z.B. zwei Asse). ' +
      'Niedrige Trümpfe (Karo 9) kannst du früher spielen.',
    example:
      'Stich hat nur 2 Neuner (0 Punkte)? Spiel Karo 9 statt Kreuz-Dame! Spare die Dame für später.',
  },
];

/**
 * Rules explanations
 */
export const RULES_EXPLANATIONS: Explanation[] = [
  {
    id: 'rules_trick',
    category: TipCategory.Rules,
    title: 'Wie funktioniert ein Stich?',
    shortText: 'Jeder spielt eine Karte, höchste Karte gewinnt.',
    longText:
      'Ein Stich läuft so ab: ' +
      '1. Spieler 1 spielt eine Karte (führt an) ' +
      '2. Die anderen 3 Spieler spielen reihum eine Karte ' +
      '3. Die höchste Karte gewinnt den Stich und alle Punkte ' +
      '4. Der Gewinner führt den nächsten Stich an',
    example:
      'Spieler 1: Herz-10, Spieler 2: Herz-König, Du: Herz-Ass, Spieler 4: Herz-9 → Du gewinnst mit Herz-Ass!',
  },
  {
    id: 'rules_announcement',
    category: TipCategory.Rules,
    title: 'Re/Kontra ansagen',
    shortText: 'Ansagen verdoppelt die Punkte - aber nur bei gutem Blatt!',
    longText:
      'Zu Beginn des Spiels kannst du "Re" oder "Kontra" ansagen, um zu zeigen, dass du ein gutes Blatt hast. ' +
      'Dadurch verdoppelst du die Punkte, die du gewinnen oder verlieren kannst. ' +
      'Sage nur an, wenn du mindestens 6 Trümpfe oder sehr hohe Karten hast!',
    example:
      'Du hast 8 Trümpfe inkl. 2 Damen? Perfekt für eine Re-Ansage! Doppelte Punkte!',
  },
];

/**
 * Get all explanations
 */
export const ALL_EXPLANATIONS: Explanation[] = [
  ...TRUMP_EXPLANATIONS,
  ...TEAM_EXPLANATIONS,
  ...SCORING_EXPLANATIONS,
  ...STRATEGY_EXPLANATIONS,
  ...RULES_EXPLANATIONS,
];

/**
 * Get explanations by category
 */
export function getExplanationsByCategory(category: TipCategory): Explanation[] {
  return ALL_EXPLANATIONS.filter(exp => exp.category === category);
}

/**
 * Get explanation by ID
 */
export function getExplanationById(id: string): Explanation | undefined {
  return ALL_EXPLANATIONS.find(exp => exp.id === id);
}
