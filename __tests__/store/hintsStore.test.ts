import { useHintsStore } from '@/store/hintsStore';
import { HintId } from '@/types/hint.types';

describe('hintsStore', () => {
  beforeEach(() => {
    useHintsStore.getState().resetForNewGame();
  });

  it('initializes with empty state', () => {
    const state = useHintsStore.getState();
    expect(state.shownHintsThisGame.size).toBe(0);
    expect(state.hintsShownThisTrick).toBe(0);
    expect(state.totalHintsShown).toBe(0);
    expect(state.currentTrickIndex).toBe(0);
  });

  it('records hint shown', () => {
    useHintsStore.getState().recordHintShown('TRUMP_BEATS_SUIT');

    const state = useHintsStore.getState();
    expect(state.shownHintsThisGame.has('TRUMP_BEATS_SUIT')).toBe(true);
    expect(state.hintsShownThisTrick).toBe(1);
    expect(state.totalHintsShown).toBe(1);
  });

  it('enforces max 1 hint per trick', () => {
    const store = useHintsStore.getState();

    expect(store.canShowHint('TRUMP_BEATS_SUIT', false)).toBe(true);
    store.recordHintShown('TRUMP_BEATS_SUIT');

    expect(store.canShowHint('SAVE_HIGH_TRUMPS', false)).toBe(false);
  });

  it('allows rule violations even after trick limit', () => {
    const store = useHintsStore.getState();

    store.recordHintShown('TRUMP_BEATS_SUIT');
    expect(store.canShowHint('FOLLOW_SUIT_OR_TRUMP', true)).toBe(true);
  });

  it('resets trick counter on trick complete', () => {
    useHintsStore.getState().recordHintShown('TRUMP_BEATS_SUIT');
    expect(useHintsStore.getState().hintsShownThisTrick).toBe(1);

    useHintsStore.getState().onTrickComplete();
    expect(useHintsStore.getState().hintsShownThisTrick).toBe(0);
    expect(useHintsStore.getState().canShowHint('SAVE_HIGH_TRUMPS', false)).toBe(true);
  });

  it('enforces max 8 hints per game', () => {
    // Show 8 hints across multiple tricks
    const hints: HintId[] = [
      'TRUMP_BEATS_SUIT',
      'SAVE_HIGH_TRUMPS',
      'FOX_PROTECTION',
      'EYES_MANAGEMENT',
      'SCHMIEREN',
      'KARLCHEN_LATE_GAME',
      'TRUMP_BEATS_SUIT', // Can repeat across tricks
      'SAVE_HIGH_TRUMPS',
    ];

    for (let i = 0; i < 8; i++) {
      useHintsStore.getState().recordHintShown(hints[i]);
      useHintsStore.getState().onTrickComplete();
    }

    const state = useHintsStore.getState();
    expect(state.totalHintsShown).toBe(8);
    expect(state.canShowHint('FOX_PROTECTION', false)).toBe(false);
  });

  it('prevents repeating same hint', () => {
    const store = useHintsStore.getState();

    store.recordHintShown('TRUMP_BEATS_SUIT');
    store.onTrickComplete();

    expect(store.canShowHint('TRUMP_BEATS_SUIT', false)).toBe(false);
  });

  it('resets all state on new game', () => {
    const store = useHintsStore.getState();

    store.recordHintShown('TRUMP_BEATS_SUIT');
    store.recordHintShown('SAVE_HIGH_TRUMPS');

    store.resetForNewGame();

    expect(store.shownHintsThisGame.size).toBe(0);
    expect(store.hintsShownThisTrick).toBe(0);
    expect(store.totalHintsShown).toBe(0);
    expect(store.currentTrickIndex).toBe(0);
  });

  it('tracks trick index progression', () => {
    expect(useHintsStore.getState().currentTrickIndex).toBe(0);

    useHintsStore.getState().onTrickComplete();
    expect(useHintsStore.getState().currentTrickIndex).toBe(1);

    useHintsStore.getState().onTrickComplete();
    expect(useHintsStore.getState().currentTrickIndex).toBe(2);
  });
});
