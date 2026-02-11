import { create } from 'zustand';
import { quizQuestions, QuizQuestion } from '@/data/quiz/quizQuestions';

interface QuizStore {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: (number | null)[];
  isCompleted: boolean;

  startQuiz: () => void;
  answerQuestion: (optionIndex: number) => void;
  nextQuestion: () => void;
  getScore: () => { correct: number; total: number };
}

export const useQuizStore = create<QuizStore>()((set, get) => ({
  questions: quizQuestions,
  currentIndex: 0,
  answers: new Array(quizQuestions.length).fill(null),
  isCompleted: false,

  startQuiz: () => {
    set({
      currentIndex: 0,
      answers: new Array(quizQuestions.length).fill(null),
      isCompleted: false,
    });
  },

  answerQuestion: (optionIndex: number) => {
    set(state => {
      const answers = [...state.answers];
      answers[state.currentIndex] = optionIndex;
      return { answers };
    });
  },

  nextQuestion: () => {
    set(state => {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { isCompleted: true };
      }
      return { currentIndex: nextIndex };
    });
  },

  getScore: () => {
    const { questions, answers } = get();
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correctOptionIndex) {
        correct++;
      }
    }
    return { correct, total: questions.length };
  },
}));
