/**
 * Helper Utilities - Common utility functions
 */

import { Suit, Rank } from '@/types/card.types';
import { Team } from '@/types/game.types';

/**
 * Get display string for suit
 */
export function getSuitSymbol(suit: Suit): string {
  const symbols: Record<Suit, string> = {
    [Suit.HEARTS]: '♥️',
    [Suit.DIAMONDS]: '♦️',
    [Suit.SPADES]: '♠️',
    [Suit.CLUBS]: '♣️',
  };
  return symbols[suit];
}

/**
 * Get display string for rank
 */
export function getRankDisplay(rank: Rank): string {
  const displays: Record<Rank, string> = {
    [Rank.NINE]: '9', // Neun
    [Rank.JACK]: 'B', // Bube
    [Rank.QUEEN]: 'D', // Dame
    [Rank.KING]: 'K', // König
    [Rank.TEN]: '10',
    [Rank.ACE]: 'A',
  };
  return displays[rank];
}

/**
 * Get color for suit (for UI styling)
 */
export function getSuitColor(suit: Suit): 'red' | 'black' {
  return suit === Suit.HEARTS || suit === Suit.DIAMONDS ? 'red' : 'black';
}

/**
 * Get team display name
 */
export function getTeamName(team: Team): string {
  const names: Record<Team, string> = {
    [Team.RE]: 'Re',
    [Team.CONTRA]: 'Kontra',
    [Team.UNKNOWN]: 'Unbekannt',
  };
  return names[team];
}

/**
 * Get team color (for UI)
 */
export function getTeamColor(team: Team): string {
  const colors: Record<Team, string> = {
    [Team.RE]: '#2563eb', // Blue
    [Team.CONTRA]: '#dc2626', // Red
    [Team.UNKNOWN]: '#6b7280', // Gray
  };
  return colors[team];
}

/**
 * Format score display (e.g., "135:105")
 */
export function formatScore(reScore: number, kontraScore: number): string {
  return `${reScore}:${kontraScore}`;
}

/**
 * Format player name for display
 */
export function formatPlayerName(name: string, maxLength: number = 12): string {
  if (name.length <= maxLength) return name;
  return `${name.substring(0, maxLength - 3)}...`;
}

/**
 * Delay utility for async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Shuffle array (Fisher-Yates)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format time for display
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Pluralize German words
 */
export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
