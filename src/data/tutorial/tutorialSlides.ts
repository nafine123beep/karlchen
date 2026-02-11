import { TutorialSlide } from '@/types/tutorial.types';

export const basicTutorialSlides: TutorialSlide[] = [
  {
    id: 'slide-1',
    headline: 'Willkommen bei Doppelkopf!',
    text: [
      'Doppelkopf ist ein Teamspiel – aber du weißt am Anfang nicht, wer dein Partner ist.',
      'Gespielt wird mit 48 Karten (inkl. 9er).'
    ],
    highlightText: 'Ziel: Als Team 121 Punkte holen',
    visual: {
      type: 'cards',
      data: { showFullDeck: true }
    }
  },
  {
    id: 'slide-2',
    headline: 'Re gegen Kontra – Das versteckte Team',
    text: 'Niemand sagt am Anfang, wer wo ist – du musst es herausfinden!',
    bulletPoints: [
      'Re-Team: Die zwei Spieler mit den Kreuz-Damen',
      'Kontra-Team: Die anderen beiden'
    ],
    visual: {
      type: 'players',
      data: { highlightQueens: true }
    }
  },
  {
    id: 'slide-3',
    headline: 'Farben und Fehlfarbe',
    text: [
      'Im Doppelkopf gibt es vier Farben: \u2663 Kreuz, \u2660 Pik, \u2665 Herz und \u2666 Karo.',
      'Aber Achtung: Nicht alle Karten einer Farbe geh\u00f6ren zur selben Gruppe! Damen und Buben sind immer Trumpf, egal welche Farbe. Alle \u2666 Karo-Karten sind im Normalspiel ebenfalls Trumpf.',
      'Eine Fehlfarbe ist eine Farbe, die kein Trumpf ist. Wenn eine Fehlfarbe ausgespielt wird, gilt Farbzwang: Du musst diese Farbe bedienen, wenn du sie auf der Hand hast. Hast du sie nicht, darfst du Trumpf spielen.',
    ],
    highlightText: 'Beispiel: Spieler 1 spielt \u2665 Herz 10 (kein Trumpf) aus \u2013 alle m\u00fcssen \u2665 Herz bedienen. Wer kein \u2665 Herz hat, darf Trumpf spielen.',
    visual: {
      type: 'suits',
    },
    quiz: {
      question: '\u2663 Kreuz 9 wird ausgespielt und ist kein Trumpf \u2013 was musst du tun?',
      options: [
        { text: 'Eine beliebige Karte spielen', isCorrect: false },
        { text: 'Kreuz bedienen, falls m\u00f6glich', isCorrect: true },
        { text: 'Immer Trumpf spielen', isCorrect: false },
      ],
      feedbackCorrect: 'Richtig! Bei einer Fehlfarbe gilt Farbzwang \u2013 du musst die Farbe bedienen, wenn du kannst.',
      feedbackIncorrect: 'Nicht ganz. Denk an den Farbzwang: Wenn eine Fehlfarbe ausgespielt wird, musst du sie bedienen!',
    },
  },
  {
    id: 'slide-4',
    headline: '26 von 48 Karten sind Trumpf!',
    text: 'Trümpfe stechen alle anderen Karten.',
    highlightText: 'Die stärksten 5 Trümpfe:',
    bulletPoints: [
      'Herz 10 ("Dulle" – die mächtigste Karte)',
      'Kreuz Dame ("Alte" – es gibt 2 davon!)',
      'Pik Dame',
      'Herz Dame',
      'Karo Dame'
    ],
    visual: {
      type: 'cards',
      data: { showTopTrumps: true }
    }
  },
  {
    id: 'slide-5',
    headline: 'Es geht um Punkte, nicht um Stiche!',
    text: 'Alle Karten zusammen = 240 Punkte. Re braucht 121+, Kontra reichen 120.',
    bulletPoints: [
      'Ass = 11 Punkte',
      '10 = 10 Punkte',
      'König = 4 Punkte',
      'Dame = 3 Punkte',
      'Bube = 2 Punkte',
      '9 = 0 Punkte'
    ],
    visual: {
      type: 'points'
    }
  },
  {
    id: 'slide-6',
    headline: 'Die drei wichtigsten Regeln',
    text: 'Merke dir diese drei Grundregeln:',
    bulletPoints: [
      'Farbzwang: Wenn eine Farbe ausgespielt wird, musst du sie bedienen (falls vorhanden)',
      'Höchste Karte gewinnt: Bei Trümpfen → höchster Trumpf, bei Fehlfarben → höchste Karte der Farbe',
      'Stich-Reihenfolge: Wer den Stich macht, spielt als nächstes aus'
    ],
    highlightText: 'Jetzt bist du bereit für dein erstes Spiel!',
    visual: {
      type: 'rules'
    }
  }
];