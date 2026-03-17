/**
 * Tutorial Lessons - Step-by-step learning content
 */

import { TutorialStep } from '@/types/learning.types';

export interface TutorialLesson {
  step: TutorialStep;
  title: string;
  description: string;
  objectives: string[];
  instructions: string[];
  tips: string[];
  completionCriteria: string;
}

export const TUTORIAL_LESSONS: TutorialLesson[] = [
  {
    step: TutorialStep.INTRODUCTION,
    title: 'Willkommen zu Doppelkopf! 🃏',
    description:
      'Doppelkopf ist ein traditionelles deutsches Kartenspiel für 4 Spieler. ' +
      'Du spielst im Team (2 vs 2) und das Ziel ist es, mehr als 120 Punkte zu sammeln!',
    objectives: [
      'Verstehe die Grundidee von Doppelkopf',
      'Lerne die Teamaufteilung kennen',
      'Verstehe das Spielziel',
    ],
    instructions: [
      '4 Spieler spielen zusammen',
      'Es gibt 2 Teams: Re (mit Kreuz-Damen) und Kontra (ohne)',
      'Ziel: Mehr als 120 von 240 Punkten sammeln',
      'Gespielt werden 12 Stiche',
    ],
    tips: [
      'Doppelkopf bedeutet "doppelter Kopf" - jede Karte gibt es 2x!',
      'Gute Kommunikation mit dem Partner ist wichtig',
    ],
    completionCriteria: 'Lies die Einführung und starte das Tutorial',
  },
  {
    step: TutorialStep.CARD_RANKS,
    title: 'Kartenwerte lernen 📊',
    description: 'Nicht alle Karten sind gleich viel wert! Lerne die Punktwerte der Karten kennen.',
    objectives: [
      'Kenne alle Kartenwerte auswendig',
      'Verstehe welche Karten wertvoll sind',
      'Erkenne hohe und niedrige Karten',
    ],
    instructions: [
      'Ass = 11 Punkte (höchster Wert!)',
      '10 = 10 Punkte',
      'König = 4 Punkte',
      'Dame = 3 Punkte',
      'Bube = 2 Punkte',
      '9 = 0 Punkte (niedrigster Wert)',
    ],
    tips: [
      'Asse und Zehner sind die wertvollsten Karten',
      'Neuner sind nichts wert - gut zum "Abwerfen"',
    ],
    completionCriteria: 'Beantworte 5 Kartenwert-Fragen richtig',
  },
  {
    step: TutorialStep.TRUMP_CARDS,
    title: 'Trümpfe verstehen 🔥',
    description: 'Trümpfe sind die mächtigsten Karten im Spiel. Sie schlagen alle anderen Karten!',
    objectives: [
      'Erkenne alle Trumpfkarten',
      'Kenne die Trumpf-Reihenfolge',
      'Verstehe wann Trümpfe gespielt werden',
    ],
    instructions: [
      'Alle Damen sind Trümpfe (8 Karten)',
      'Alle Buben sind Trümpfe (8 Karten)',
      'Alle Karo-Karten sind Trümpfe (10 Karten)',
      'Insgesamt gibt es 26 Trümpfe!',
      'Kreuz-Dame ist der höchste Trumpf',
      'Karo-9 ist der niedrigste Trumpf',
    ],
    tips: ['Über die Hälfte aller Karten sind Trümpfe!', 'Merke: Kreuz-Dame ist unschlagbar!'],
    completionCriteria: 'Identifiziere 10 Trümpfe korrekt',
  },
  {
    step: TutorialStep.TEAMS,
    title: 'Teams: Re vs Kontra ⚔️',
    description:
      'Doppelkopf ist ein Teamspiel. Lerne, wie die Teams gebildet werden und wer dein Partner ist.',
    objectives: [
      'Verstehe wie Teams gebildet werden',
      'Erkenne dein Team anhand deiner Karten',
      'Lerne Teamspiel-Strategie',
    ],
    instructions: [
      'Wer eine Kreuz-Dame hat, ist im Re-Team',
      'Die beiden Kreuz-Damen-Spieler spielen zusammen',
      'Die anderen zwei Spieler sind automatisch Kontra',
      'Am Anfang weißt du nicht, wer dein Partner ist!',
      'Partner zeigt sich durch Ansage oder Kreuz-Damen-Spiel',
    ],
    tips: [
      'Unterstütze deinen Partner, wenn er einen Stich gewinnt',
      'Versuche Gegner-Stiche zu verhindern',
    ],
    completionCriteria: 'Spiele 3 Runden und erkenne dein Team',
  },
  {
    step: TutorialStep.TRICKS,
    title: 'Stiche gewinnen 🏆',
    description: 'Lerne wie Stiche funktionieren und welche Regeln du befolgen musst.',
    objectives: [
      'Verstehe den Ablauf eines Stichs',
      'Lerne die Bedienpflicht',
      'Erkenne wann du Trümpfe spielen kannst',
    ],
    instructions: [
      'Spieler 1 spielt eine Karte aus (führt an)',
      'Alle anderen müssen die Farbe bedienen, wenn möglich',
      'Höchste Karte der ausgespielten Farbe gewinnt',
      'Trümpfe schlagen alle anderen Karten',
      'Gewinner führt den nächsten Stich an',
    ],
    tips: [
      'Kannst du nicht bedienen? Dann darfst du Trumpf spielen!',
      'Der Gewinner sammelt alle Punkte des Stichs',
    ],
    completionCriteria: 'Gewinne 5 Stiche korrekt',
  },
  {
    step: TutorialStep.SCORING,
    title: 'Punkte zählen 🔢',
    description: 'Verstehe wie Punkte gezählt werden und welche Sonderpunkte es gibt.',
    objectives: [
      'Berechne Spielpunkte korrekt',
      'Verstehe Sonderpunkte',
      'Erkenne wann du gewinnst',
    ],
    instructions: [
      'Zähle alle Kartenpunkte deines Teams zusammen',
      'Mehr als 120 Punkte = Gewonnen!',
      'Gegen 90: +1 Punkt (Gegner < 90)',
      'Gegen 60: +1 Punkt (Gegner < 60)',
      'Gegen 30: +1 Punkt (Gegner < 30)',
      'Schwarz: +1 Punkt (Gegner 0 Stiche)',
    ],
    tips: [
      'Ein normales Spiel ist 1 Punkt wert',
      'Mit Sonderpunkten kannst du bis zu 5 Punkte gewinnen!',
    ],
    completionCriteria: 'Berechne 3 Spielergebnisse korrekt',
  },
  {
    step: TutorialStep.FIRST_GAME,
    title: 'Dein erstes Spiel! 🎮',
    description: 'Jetzt weißt du genug! Spiele dein erstes vollständiges Doppelkopf-Spiel.',
    objectives: [
      'Wende alle gelernten Regeln an',
      'Spiele strategisch',
      'Gewinne oder lerne aus Fehlern',
    ],
    instructions: [
      'Erkenne deine Trümpfe',
      'Finde heraus welches Team du bist',
      'Befolge die Bedienpflicht',
      'Spiele strategisch mit deinem Partner',
      'Sammle mehr als 120 Punkte zum Gewinnen',
    ],
    tips: [
      'Keine Sorge bei Fehlern - Übung macht den Meister!',
      'Schau dir die Tipps an, wenn du unsicher bist',
      'Viel Erfolg!',
    ],
    completionCriteria: 'Spiele ein komplettes Spiel bis zum Ende',
  },
];

/**
 * Get tutorial lesson by step
 */
export function getTutorialLesson(step: TutorialStep): TutorialLesson | undefined {
  return TUTORIAL_LESSONS.find(lesson => lesson.step === step);
}

/**
 * Get all tutorial steps in order
 */
export function getAllTutorialSteps(): TutorialStep[] {
  return TUTORIAL_LESSONS.map(lesson => lesson.step);
}

/**
 * Get next tutorial step
 */
export function getNextTutorialStep(currentStep: TutorialStep): TutorialStep | null {
  const currentIndex = TUTORIAL_LESSONS.findIndex(lesson => lesson.step === currentStep);
  if (currentIndex === -1 || currentIndex === TUTORIAL_LESSONS.length - 1) {
    return null;
  }
  return TUTORIAL_LESSONS[currentIndex + 1].step;
}

/**
 * Check if tutorial is complete
 */
export function isTutorialComplete(completedSteps: TutorialStep[]): boolean {
  return completedSteps.length === TUTORIAL_LESSONS.length;
}
