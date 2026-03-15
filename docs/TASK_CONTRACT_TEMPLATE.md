# Task Contract — [Task Name]

> Copy this template for any non-trivial task. Fill in the sections before starting work.
> A task is not complete until every acceptance criterion is verifiably satisfied.

## Objective

<!-- One sentence: what does this task accomplish? -->

## Decision (if research was needed)

<!-- What approach was chosen and why? Reference a DECISION.md or inline the key choices.
     Be specific: "Use X library with Y config" not "implement the feature" -->

## Acceptance Criteria

<!-- Every item must be checkable — no subjective criteria like "code is clean" -->

- [ ] All existing tests pass (`npm test`)
- [ ] No new TypeScript errors (`npm run type-check`)
- [ ] No new lint warnings (`npm run lint`)
- [ ] <!-- task-specific criterion -->
- [ ] <!-- task-specific criterion -->

## Protected Files (do NOT modify)

<!-- List files that must not be changed — typically test files, configs, or contracts -->
<!-- e.g., __tests__/engine/Card.test.ts — verify against, don't modify -->

## Verification Steps

<!-- How to prove the criteria are met — concrete commands or checks -->

1. Run `npm test` — all green
2. Run `npm run type-check` — no errors
3. Run `npm run lint` — no warnings
4. <!-- task-specific verification -->

## Scope Boundaries

<!-- What is explicitly OUT of scope? Prevents scope creep -->
<!-- e.g., "Do NOT refactor existing game engine logic" -->
<!-- e.g., "Do NOT add new dependencies without asking" -->
