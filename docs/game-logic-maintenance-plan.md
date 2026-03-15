# Game Logic Maintenance Plan

> Companion to [game-logic-spec.md](game-logic-spec.md). Covers best practices for keeping logic and documentation aligned, test gaps, and refactoring recommendations.

---

## 1. Best Practices for Keeping Logic and Docs Aligned

### When to update this documentation

- **Any change to trump logic** (ordering, what counts as trump) — update Section 4 of the spec.
- **Any change to scoring** (new special points, announcement effects) — update Section 7.
- **New game features** (Solo, Hochzeit, Absagen) — add to relevant sections, move from "Not implemented" to "Implemented" in Section 10.
- **Bug fixes** — remove the bug from Section 10 once fixed; add a note to the relevant section if behavior changed.
- **New UI screens referencing rules** — check against the spec to avoid drift (see INC-1 and INC-2 as examples of what happens when you don't).

### Documentation update checklist

For any PR touching game logic:

1. Does the change affect trump hierarchy? Update Section 4 table.
2. Does the change affect legal moves? Update Section 5.
3. Does the change affect trick evaluation? Update Section 6.
4. Does the change affect scoring? Update Section 7.
5. Does the change add/remove a file? Update Section 11 source code mapping.
6. Does the change fix a listed bug? Remove from Section 10.
7. Does any UI screen display the affected rule? Check for drift.

### Preventing UI/engine drift

The current GameRulesScreen is a static React component with hardcoded strings. To prevent future drift:

- **Short-term**: When updating engine rules, grep for the affected German text across all `.tsx` files. Key screens to check: `GameRulesScreen.tsx`, tutorial slides, quiz questions, hint messages, explanations.
- **Long-term**: Consider deriving rule display text from the same constants used by the engine (e.g., generate trump order list from `getTrumpOrder()` rather than hardcoding it in JSX).

---

## 2. Missing Tests

### Current test coverage (24 suites, 365 tests)

| File | Tests | Coverage quality |
|------|-------|-----------------|
| `trumpLogic.test.ts` | 17 | Good — Dulle, ordering, comparison |
| `trickLogic.test.ts` | 15 | Good — trick winner, canBeat, Dulle rule |
| `legalMoves.test.ts` | 6 | Medium — basic Bedienzwang; still missing diamond lead edge case |
| `scoreLogic.test.ts` | 52 | Good — final score, special points, fox/Karlchen/Doppelkopf detection |
| `teamLogic.test.ts` | 35 | Good — team assignment, announcements, partner detection, team reveal |
| `GameEngine.test.ts` | 29 | Good — init, play flow, trick completion, full 12-trick simulation |
| `Card.test.ts` | 20+ | Good — constructor, values, setTrump, compareTo, serialization |
| `Player.test.ts` | 30 | Good — hand management, sorting, announcements, serialization |
| `Trick.test.ts` | 25 | Good — card adding, lead suit, total value, serialization |
| `Deck.test.ts` | 20 | Good — 48 cards, deal, shuffle, find |
| `aiStrategies.test.ts` | 19 | Good — lead/follow selection, strength eval, announcements |
| `aiPlayer.test.ts` | 8 | Basic — legal move compliance across AI levels |
| `HintEngine.test.ts` | varies | Hint triggering |
| `hintsStore.test.ts` | 9 | Good — all passing (cooldown bug fixed) |
| `quizStore.test.ts` | varies | Quiz state management |
| Component/tutorial tests | varies | UI rendering tests |

### Remaining test gaps

1. **legalMoves edge cases** — diamond lead (following diamonds = following trump), Herz 10 when Hearts led
2. **FeedbackHintEngine** — zero coverage, low risk
3. **Hint trigger files** — individual trigger functions untested

---

## 3. Refactoring Recommendations

### Resolved (2026-03-14)

All previously listed bugs (BUG-1/2/3), UI inconsistencies (INC-1/2/3/4), misleading TODOs, empty stubs (`GameState.updateScores()`, `Player.determineTeamFromCards()`), and the hintsStore cooldown bug have been fixed.

### Remaining refactoring opportunities

| Improvement | Rationale | Effort |
|-------------|-----------|--------|
| Extract `RANK_STRENGTH` from `Card.compareTo()` to a shared constant | Currently defined inline. Could be shared with `Player.sortHand()` for consistency. | 15 min |

### Future features (if/when needed)

These are referenced in TODOs or UI but not yet needed:

| Feature | Complexity | Dependencies |
|---------|------------|--------------|
| Absagen (No 90/60/30 announcements) | Medium | Requires announcement timing changes, score multiplier logic |
| Hochzeit (Wedding) | Medium | `detectSpecialGame()` stub exists; needs team reassignment after first trick |
| Solo | High | Complete trump suit override, team assignment changes (1 vs 3) |
| Armut (Poverty) | Medium | Card exchange mechanism between players |
| Multi-round scoring | Low | Wrap `GameEngine` in a session manager, track running totals |

---

## 4. Test Infrastructure Notes

- **Framework**: Jest with `jest-expo` preset
- **Coverage threshold**: 70% configured in `jest.config.js`
- **Test location**: `__tests__/` mirrors `src/` structure
- **Running tests**: `npx jest` (all), `npx jest --testPathPattern=trumpLogic` (single file)
- **Current status**: 24 suites, 365 tests, all passing
- **Integration test**: `GameEngine.test.ts` includes a full 12-trick game simulation (deal → play → score → verify 240 points)
