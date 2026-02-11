export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'Q_FARBZWANG',
    questionText: 'Kreuz 9 wird ausgespielt und ist kein Trumpf \u2013 was musst du tun?',
    options: [
      'Eine beliebige Karte spielen',
      'Kreuz bedienen, falls m\u00f6glich',
      'Immer Trumpf spielen',
    ],
    correctOptionIndex: 1,
    explanation: 'Bei einer Fehlfarbe gilt Farbzwang \u2013 du musst die Farbe bedienen, wenn du kannst.',
  },
  {
    id: 'Q_HIGHEST_OF_SUIT_WINS',
    questionText: 'Pik 9 wird ausgespielt. Niemand spielt Trumpf. Wer gewinnt den Stich?',
    options: [
      'Die h\u00f6chste Pik-Karte',
      'Die erste gespielte Karte',
      'Die h\u00f6chste Karte insgesamt',
    ],
    correctOptionIndex: 0,
    explanation: 'Wenn kein Trumpf gespielt wird, gewinnt die h\u00f6chste Karte der angespielten Farbe.',
  },
  {
    id: 'Q_TRUMPFZWANG',
    questionText: 'Karo 10 (Trumpf) wird ausgespielt. Du hast noch Trumpf auf der Hand. Was musst du tun?',
    options: [
      'Trumpf spielen',
      'Eine beliebige Fehlfarbe spielen',
      'Nur bedienen, wenn du h\u00f6her bist',
    ],
    correctOptionIndex: 0,
    explanation: 'Wird Trumpf ausgespielt, gilt Trumpfzwang. Du musst Trumpf spielen, wenn du welchen hast.',
  },
  {
    id: 'Q_MULTIPLE_TRUMPS',
    questionText: 'Im Stich liegen zwei Trumpfkarten. Welche gewinnt?',
    options: [
      'Die zuerst gespielte',
      'Die h\u00f6here Trumpfkarte',
      'Die mit dem h\u00f6chsten Zahlenwert',
    ],
    correctOptionIndex: 1,
    explanation: 'Sind mehrere Tr\u00fcmpfe im Stich, gewinnt der h\u00f6here Trumpf gem\u00e4\u00df der Trumpfreihenfolge.',
  },
  {
    id: 'Q_JACKS_QUEENS_TRUMP',
    questionText: 'Sind Buben und Damen immer Trumpf?',
    options: [
      'Ja, im normalen Spiel immer',
      'Nur wenn sie in Karo sind',
      'Nein, sie geh\u00f6ren zur Fehlfarbe',
    ],
    correctOptionIndex: 0,
    explanation: 'Im normalen Doppelkopf sind alle Damen und alle Buben Trumpf.',
  },
  {
    id: 'Q_DIAMONDS_TRUMP',
    questionText: 'Welche Farbe ist im normalen Spiel zus\u00e4tzlich Trumpf?',
    options: [
      'Herz',
      'Karo',
      'Pik',
    ],
    correctOptionIndex: 1,
    explanation: 'Im Normalspiel sind alle Karo-Karten Trumpf.',
  },
  {
    id: 'Q_NO_SUIT_AVAILABLE',
    questionText: 'Kreuz wird ausgespielt. Du hast kein Kreuz und keinen Trumpf. Was darfst du spielen?',
    options: [
      'Eine beliebige Karte',
      'Du musst passen',
      'Nur eine hohe Karte',
    ],
    correctOptionIndex: 0,
    explanation: 'Wenn du weder die Farbe bedienen noch Trumpf spielen kannst, darfst du eine beliebige Karte spielen.',
  },
  {
    id: 'Q_TRUMP_OVERRIDES',
    questionText: 'Herz wird ausgespielt. Spieler 3 spielt Trumpf. Was bedeutet das f\u00fcr den Stich?',
    options: [
      'Herz bleibt trotzdem entscheidend',
      'Trumpf gewinnt den Stich',
      'Der erste Spieler gewinnt automatisch',
    ],
    correctOptionIndex: 1,
    explanation: 'Sobald Trumpf im Stich liegt, schl\u00e4gt er jede Fehlfarbe.',
  },
  {
    id: 'Q_IDENTIFY_FEHL',
    questionText: 'Welche Karte ist im normalen Spiel eine Fehlkarte?',
    options: [
      'Karo 9',
      'Herz K\u00f6nig',
      'Pik Dame',
    ],
    correctOptionIndex: 1,
    explanation: 'Karo ist Trumpf und Damen sind immer Trumpf. Herz K\u00f6nig ist eine normale Fehlkarte.',
  },
  {
    id: 'Q_MUST_FOLLOW_LOW',
    questionText: 'Pik Ass wird ausgespielt. Du hast nur Pik 9. Was musst du tun?',
    options: [
      'Trumpf spielen',
      'Pik 9 spielen',
      'Eine andere Fehlfarbe spielen',
    ],
    correctOptionIndex: 1,
    explanation: 'Du musst die angespielte Farbe bedienen, auch wenn deine Karte niedriger ist.',
  },
];
