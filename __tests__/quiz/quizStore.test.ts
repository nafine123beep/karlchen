import { useQuizStore } from '@/store/quizStore';
import { quizQuestions } from '@/data/quiz/quizQuestions';

describe('quizStore', () => {
  beforeEach(() => {
    useQuizStore.getState().startQuiz();
  });

  it('initializes with correct state', () => {
    const state = useQuizStore.getState();
    expect(state.questions).toHaveLength(quizQuestions.length);
    expect(state.currentIndex).toBe(0);
    expect(state.answers.every(a => a === null)).toBe(true);
    expect(state.isCompleted).toBe(false);
  });

  it('records answer for current question', () => {
    useQuizStore.getState().answerQuestion(1);
    const state = useQuizStore.getState();
    expect(state.answers[0]).toBe(1);
  });

  it('advances to next question', () => {
    useQuizStore.getState().nextQuestion();
    expect(useQuizStore.getState().currentIndex).toBe(1);
  });

  it('marks completed on last question advance', () => {
    const state = useQuizStore.getState();
    // Advance to last question
    for (let i = 0; i < state.questions.length - 1; i++) {
      useQuizStore.getState().nextQuestion();
    }
    expect(useQuizStore.getState().currentIndex).toBe(state.questions.length - 1);
    expect(useQuizStore.getState().isCompleted).toBe(false);

    // Advance past last
    useQuizStore.getState().nextQuestion();
    expect(useQuizStore.getState().isCompleted).toBe(true);
  });

  it('calculates score correctly', () => {
    const questions = useQuizStore.getState().questions;

    // Answer first 3 correctly
    for (let i = 0; i < 3; i++) {
      useQuizStore.getState().answerQuestion(questions[i].correctOptionIndex);
      useQuizStore.getState().nextQuestion();
    }

    // Answer 4th incorrectly
    const wrongIndex = questions[3].correctOptionIndex === 0 ? 1 : 0;
    useQuizStore.getState().answerQuestion(wrongIndex);

    const { correct, total } = useQuizStore.getState().getScore();
    expect(correct).toBe(3);
    expect(total).toBe(questions.length);
  });

  it('resets state on startQuiz', () => {
    // Make some progress
    useQuizStore.getState().answerQuestion(0);
    useQuizStore.getState().nextQuestion();
    useQuizStore.getState().answerQuestion(1);

    // Reset
    useQuizStore.getState().startQuiz();

    const state = useQuizStore.getState();
    expect(state.currentIndex).toBe(0);
    expect(state.answers.every(a => a === null)).toBe(true);
    expect(state.isCompleted).toBe(false);
  });
});
