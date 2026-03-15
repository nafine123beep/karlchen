# Project Instructions for Claude Code

> **First session?** Read this file completely before doing anything. Check `SESSION_NOTES.md` for continuity from previous sessions.

---

## Project Overview

**Karlchen** — Doppelkopf Lern-App für iOS. Interactive tutorials, quizzes, and AI opponents for learning the German card game Doppelkopf. Built with React Native (Expo) and TypeScript.

### What This Project Is NOT

- **NOT a backend/server app** — purely client-side, offline-first. Don't suggest server endpoints or databases.
- **NOT a general card game engine** — Doppelkopf only. Don't abstract for other games.
- **NOT an Android app** (yet) — iOS-first via Expo. Don't optimize for Android-specific quirks.

## Quick Commands

```bash
npm start              # Start Metro bundler
npm run ios            # Run on iOS simulator
npm test               # Run tests (Jest)
npm run test:watch     # Tests in watch mode
npm run test:coverage  # Tests with coverage report
npm run lint           # ESLint
npm run lint:fix       # ESLint with auto-fix
npm run format         # Prettier formatting
npm run type-check     # TypeScript type checking
npm run build:web      # Export web app
```

## Architecture

```
UI (React Native Components / Screens)
  ↓ via Zustand stores
State Management (src/store/ — gameStore, learningStore, hintsStore, quizStore, settingsStore)
  ↓
Game Engine (src/engine/ — pure TypeScript, no React dependencies)
  ↓
Models & Logic (Card, Deck, GameState, Player, Trick)
```

The game engine is intentionally UI-agnostic. Keep it free of React/React Native imports.

## Key Directories

- `src/engine/` — Game logic (models, logic, AI, hints)
- `src/store/` — Zustand state stores
- `src/components/` — React Native UI components
- `src/screens/` — Full-screen views (React Navigation)
- `src/theme/` — Design tokens and theme constants
- `src/data/` — Hardcoded tutorial/quiz content
- `src/types/` — Shared TypeScript type definitions
- `__tests__/` — Jest tests (mirrors src/ structure)

## Principles

This project follows 5 axiomatic principles. See [`docs/PRINCIPLE_LATTICE.md`](docs/PRINCIPLE_LATTICE.md) for the full lattice with details.

| # | Principle | Axiom |
|---|-----------|-------|
| 1 | **Modularity** | Lego blocks, not monoliths |
| 2 | **Simplicity Wins** | Don't reinvent the wheel |
| 3 | **Errors Are Answers** | Every failure teaches |
| 4 | **Fix The Pattern** | Cure the root cause, not the symptom |
| 5 | **Secrets Stay Secret** | Nothing left open to exploitation |

## Code Conventions

- **TypeScript strict mode** enabled
- **Formatting**: Prettier — 100 char line width, 2-space indent, single quotes, trailing commas, semicolons required
- **Naming**: PascalCase for types/components, camelCase for variables/functions, UPPER_SNAKE_CASE for constants, `is/has/can` prefixes for booleans
- **Path aliases**: Use `@/` prefix for internal imports (e.g., `@/engine/models/Card`)
- **No `any` types** — use proper typing
- **Unused variables**: Prefix with `_` if intentionally unused

## Testing

- Jest 29 with React Native Testing Library
- Coverage thresholds: 70% (branches, functions, lines, statements)
- Test file location: `__tests__/` mirroring `src/` structure
- Pattern: `describe` → `describe` → `it('should ...')` with Arrange/Act/Assert

## Language

The app UI is in **German**. Code, comments, and variable names are in **English**. Commit messages use a mix (German descriptions are fine).

---

## Coding Standards (CRITICAL)

These patterns prevent bugs that occur in every codebase. **Follow them exactly.**

### 1. Simple Solutions Over Complex Ones
ALWAYS prefer the simpler approach that already works. If something worked before, check git history before rewriting it.

### 2. Error Messages Must Be Actionable
Every error must say what happened, why, and what the user (or developer) can do about it.

### 3. Don't Create Dead Code
If you replace a function or variable, **remove the old one.** No commented-out code, no unused imports.

### 4. Check Git History Before "Fixing"
If something used to work, the fix may be reverting to what worked — not adding more code.

### 5. Fix ALL Instances of a Pattern
When you find a bug, **search for the same pattern everywhere.** One bug usually means 3-5 more.

### 6. No Cross-File String Contracts Without a Shared Source
If two files must agree on a string value — there MUST be a single source of truth.

### 7. Closed By Default
Security/permission boundaries must default to rejecting everything, not accepting everything.

### 8. Dual-Layer Changes Must Update Both Sides
When logic exists in two places (store + engine, model + test), updating one without the other is a silent bug.

---

## Things to Avoid

- **Don't add features, refactoring, or "improvements" beyond what was asked.** A bug fix doesn't need surrounding code cleaned up.
- **Don't add error handling for scenarios that can't happen.** Trust framework guarantees. Only validate at system boundaries.
- **Don't create helpers or abstractions for one-time operations.** Three similar lines beat a premature abstraction.
- **Don't add docstrings, comments, or type annotations to code you didn't change.**
- **Don't leave backwards-compatibility shims.** If it's unused, delete it completely.

---

## Cross-File Contracts

When two files must agree on a value/format — there MUST be a single source of truth.

| Contract | Source of Truth | Mirror | Sync Method |
|----------|----------------|--------|-------------|
| Card suits/ranks | `src/engine/models/Card.ts` | Tests, AI logic, scoring | TypeScript enums |
| Game phases | `src/engine/models/GameState.ts` | Store, UI screens | TypeScript types |
| Tutorial slide data | `src/data/tutorial/` | Tutorial screen components | Direct import |

---

## Common Session Traps

### Trap 1: "Let me optimize this"
**Stop.** Is it slow? Is the user complaining? If not, don't touch it.

### Trap 2: "I'll fix this one place"
**Stop.** Search for the same pattern. Fix them all or none.

### Trap 3: "The error says X, so I'll fix X"
**Stop.** Trace backwards to the root cause before touching code.

### Trap 4: "I need to rewrite this function"
**Stop.** Check git history. Maybe a past version worked. Maybe revert, not rewrite.

### Trap 5: "While I'm here, I'll also clean up..."
**Stop.** Do exactly what was asked. If you see something worth improving, mention it — don't do it.

### Trap 6: "I'll update this validation"
**Stop.** If the same logic exists in store + engine, or model + test, update both sides.

### Trap 7: "I'll wrap this in a helper for reuse"
**Stop.** Is it actually used more than once *right now*? If not, inline it.

### Trap 8: "I think the user wants..."
**Stop.** If ambiguous, **ask** — don't infer. Stated intent > inferred intent > assumed intent.

### Trap 9: "This looks correct to me"
**Stop.** Prove it — trace the logic, find a concrete input. See `.claude/skills/adversarial-review.md`.

### Karlchen-Specific Traps

### Trap 10: "I'll import React in the engine"
**Stop.** The engine layer (`src/engine/`) must remain UI-agnostic. No React/React Native imports. Ever.

### Trap 11: "I'll hardcode this German string"
**Stop.** UI strings are German, but code/comments/variables stay English. Don't mix languages in code.

---

## "When Editing X, Check Y" Rules

### When editing `src/engine/models/Card.ts`:
1. Check `__tests__/engine/Card.test.ts` — tests may need updating
2. Check `src/engine/logic/scoreLogic.ts` — card values affect scoring
3. Check `src/engine/logic/trickLogic.ts` — card comparison affects trick winner
4. Check `src/engine/ai/aiStrategies.ts` — AI card evaluation depends on card model

### When editing game state or phases:
1. Check `src/store/gameStore.ts` — store must reflect engine state
2. Check relevant screen components that read from the store

### When editing AI strategies:
1. Check `src/engine/logic/legalMoves.ts` — AI must only play legal moves
2. Run tests: `npm test -- --testPathPattern=ai`

### When editing tutorial/quiz data:
1. Verify German text accuracy
2. Check that referenced cards/scenarios are valid Doppelkopf situations

---

## Git Workflow

**ALWAYS sync with main before pushing:**
```bash
git fetch origin
git merge origin/main --no-edit
git push -u origin <branch-name>
```

**Commit messages** follow conventional style:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code restructuring
- `chore:` Maintenance tasks

See `.claude/PR_GUIDELINES.md` for pull request format.

---

## Context Discipline

### Research → Decision → Implement

Complex tasks benefit from separating thinking from doing. See `.claude/skills/research-then-implement.md` for the full pattern.

### Task Contracts

Before starting complex work, define what "done" looks like. See `docs/TASK_CONTRACT_TEMPLATE.md`.

---

## Before Submitting Changes

1. Did I test the happy path?
2. Did I search for similar patterns to fix? (Standard #5)
3. Did I remove dead code? No commented-out code, no unused variables.
4. Did I check git history for regressions?
5. Is this simpler than what was there before?
6. If I touched a cross-file contract, did I update ALL sides?
7. Did I stay within scope? No unasked-for refactoring.
8. Are tests still passing? (`npm test`)
9. No type errors? (`npm run type-check`)

---

## Session Continuity

When starting a session, look for `SESSION_NOTES.md`. When ending, update it:

```markdown
# Session Notes — [date]
## What we worked on
- [brief description]
## Current state
- [what's done, what's in progress]
## Next steps
- [what the next session should pick up]
## Key decisions made
- [any architectural or design decisions]
```
