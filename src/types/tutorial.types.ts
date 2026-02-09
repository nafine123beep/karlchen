// tutorial.types.ts
export interface TutorialSlide {
  id: string;
  headline: string;
  text: string | string[]; // Array for multiple paragraphs
  bulletPoints?: string[]; // Optional bullet list
  visual?: {
    type: 'cards' | 'players' | 'points' | 'rules';
    data?: any; // Visual-specific data
  };
  highlightText?: string; // Important text to emphasize
}