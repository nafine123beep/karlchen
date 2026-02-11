// tutorial.types.ts
export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface TutorialQuiz {
  question: string;
  options: QuizOption[];
  feedbackCorrect: string;
  feedbackIncorrect: string;
}

export interface TutorialSlide {
  id: string;
  headline: string;
  text: string | string[]; // Array for multiple paragraphs
  bulletPoints?: string[]; // Optional bullet list
  visual?: {
    type: 'cards' | 'players' | 'points' | 'rules' | 'suits';
    data?: any; // Visual-specific data
  };
  highlightText?: string; // Important text to emphasize
  quiz?: TutorialQuiz;
}