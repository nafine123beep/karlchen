/**
 * Tutorial Slides - 5 introductory slides for Doppelkopf basics
 */

import { TutorialSlide } from '@/types/tutorial.types';

export const TUTORIAL_SLIDES: TutorialSlide[] = [
  {
    id: 'welcome',
    title: 'Willkommen bei Doppelkopf!',
    subtitle: 'Das beliebteste Kartenspiel Deutschlands',
    content: [
      '4 Spieler treten in wechselnden Teams gegeneinander an',
      'Jeder Spieler bekommt 12 Karten',
      'Ziel: Mehr Punkte sammeln als das gegnerische Team',
      'Insgesamt gibt es 240 Punkte im Spiel',
    ],
    illustration: '🃏',
    backgroundColor: '#2563eb',
  },
  {
    id: 'cards',
    title: 'Die Karten',
    subtitle: 'Jede Karte hat einen Punktwert',
    content: [
      'Ass = 11 Punkte (die wertvollste Karte)',
      'Zehn = 10 Punkte',
      'König = 4 Punkte',
      'Dame = 3 Punkte',
      'Bube = 2 Punkte',
      'Neun = 0 Punkte',
    ],
    illustration: '🂡',
    backgroundColor: '#059669',
  },
  {
    id: 'trump',
    title: 'Trumpfkarten',
    subtitle: 'Trumpf schlägt alle anderen Karten',
    content: [
      'Alle Damen sind Trumpf (Kreuz-Dame ist die stärkste)',
      'Alle Buben sind Trumpf',
      'Alle Karo-Karten sind Trumpf',
      'Trumpf-Reihenfolge: Damen > Buben > Karo',
      '26 von 48 Karten sind Trumpf!',
    ],
    illustration: '👑',
    backgroundColor: '#dc2626',
  },
  {
    id: 'teams',
    title: 'Die Teams',
    subtitle: 'Re gegen Kontra',
    content: [
      'Wer eine Kreuz-Dame hat, gehört zum Team Re',
      'Alle anderen gehören zum Team Kontra',
      'Die Teams sind zu Beginn geheim!',
      'Re braucht 121 Punkte zum Sieg, Kontra nur 120',
    ],
    illustration: '🤝',
    backgroundColor: '#7c3aed',
  },
  {
    id: 'tricks',
    title: 'Der Stich',
    subtitle: 'So wird gespielt',
    content: [
      'Ein Spieler spielt eine Karte aus (Vorhand)',
      'Die anderen müssen die gleiche Farbe bedienen',
      'Trumpf schlägt jede Fehlfarbe',
      'Die höchste Karte gewinnt den Stich',
      'Der Gewinner spielt den nächsten Stich an',
    ],
    illustration: '🎴',
    backgroundColor: '#0891b2',
  },
];
