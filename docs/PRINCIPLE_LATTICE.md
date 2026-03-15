# Principle Lattice

**Decision framework for software that doesn't rot.**

---

## What This Is

These are axiomatic principles — non-negotiable values that guide every design decision, every line of code, every architectural choice. They aren't features. They aren't goals. They're the DNA.

When you're stuck on a decision, check it against the lattice. If a choice violates a principle, it's wrong — even if it "works." If it honors multiple principles simultaneously, it's probably right.

Each principle has **instantiations** — concrete proof that the principle lives in the codebase, not just on paper. A principle without instantiations is a wish. We don't do wishes.

---

## The Five Principles

### 1. Modularity

> *Lego blocks, not monoliths.*

Every component should be self-contained. Pull one out — that specific thing stops working. The rest stands. No module should be load-bearing for something unrelated to its purpose.

When two systems need to talk, build a bridge — don't duplicate. If data already lives somewhere, reference it. Don't maintain two copies of anything.

**Instantiations:**
- Game engine (`src/engine/`) is UI-agnostic — no React/React Native imports allowed
- Zustand stores are domain-separated (gameStore, learningStore, hintsStore, quizStore, settingsStore)
- Models (Card, Deck, Player, Trick, GameState) are independent value types
- AI strategies are pluggable functions, not hardcoded into the engine

**Demands:**
- Each component fails independently — one breaking doesn't cascade
- No hidden coupling between unrelated modules
- Shared types and interfaces live in `src/types/`
- Modules own their own state via Zustand stores
- Engine logic must never import from `src/components/` or `src/screens/`

---

### 2. Simplicity Wins

> *Don't reinvent the wheel. Code exists to be used.*

The best code is code someone else already debugged. Use battle-tested libraries. If something already works — in your own git history, in someone else's MIT repo, in a standard library — use it. Only write novel code for novel problems.

Complexity is a cost, not a feature. Three clear lines beat one clever abstraction. A working simple solution beats an elegant broken one. Always.

**Instantiations:**
- Zustand for state management (not Redux, not custom pub/sub)
- Expo for build tooling (not bare React Native)
- Hardcoded tutorial/quiz content in `src/data/` (not a CMS, not a database)
- Pure TypeScript for game logic (no external game framework)

**Demands:**
- Before writing a new system, search for existing solutions first
- Before rewriting a function, check git history — maybe the old version worked
- If a dependency does 80% of the job, use it and handle the 20%
- Don't create abstractions for one-time operations

---

### 3. Errors Are Answers

> *Every failure teaches. Errors must be actionable.*

An error message that says "something went wrong" is itself a bug. Every error must say what happened, why, and what the user can do about it. Logs aren't optional — they're the program's memory of its own behavior.

**Instantiations:**
- Game engine functions throw descriptive errors for illegal moves
- AI player logs decision reasoning during development
- Type system enforces valid card/trick states at compile time

**Demands:**
- Every error message is actionable (says what to do, not just what happened)
- No silent failures — if something goes wrong, someone (user or developer) knows
- Maintain an honest status table in CLAUDE.md (Working / PARTIAL / MISSING / BROKEN)

---

### 4. Fix The Pattern, Not The Instance

> *Cure the root cause. Don't treat symptoms.*

When you find a bug, the bug is never alone. The same mistake that caused it exists in 3-5 other places — you just haven't hit them yet. Search for the pattern. Fix every instance. If you only fix the one you found, you're treating symptoms while the disease spreads.

**Instantiations:**
- Card comparison logic centralized in Card model (not scattered across trick/score logic)
- Suit/rank enums as single source of truth for all card operations

**Demands:**
- Every bug fix includes a search for the same pattern across the codebase
- If a pattern produces bugs twice, add it to CLAUDE.md as a Trap
- Root cause analysis before fix — the error might be downstream of the real bug

---

### 5. Secrets Stay Secret

> *Nothing left open to exploitation.*

API keys are not config — they're secrets. They belong in environment variables or encrypted storage, never in localStorage, never in plaintext, never logged, never in error messages.

**Instantiations:**
- No external API calls currently (offline-first app)
- `.env` in `.gitignore` from day one

**Demands:**
- **Closed by default** — empty allowlists mean "deny all", not "allow all"
- Environment variables for any future secrets, never committed to git
- If external APIs are added, enforce HTTPS and set User-Agent headers

---

## Using The Lattice

### For Design Decisions

When stuck between two approaches, score them against the principles:

| Approach A | Approach B |
|-----------|-----------|
| Violates #1 (couples two modules) | Honors #1 (clean separation) |
| Honors #2 (simpler) | Violates #2 (complex) |
| **Mixed — needs thought** | **Mixed — needs thought** |

If one approach cleanly honors more principles without violating any, it wins.

### For Code Review

Every PR can be checked: *does this change violate any principle?* Not "is this code clean" — that's subjective. "Does this violate the lattice" — that's answerable.

### For New Sessions

Read this document first. If Claude understands these 5 principles, it understands how this project thinks.

---

*Lattice concept adapted from [vincitamore/claude-org-template](https://github.com/vincitamore/claude-org-template). Principles distilled from the [HIVE](https://github.com/LucidPaths/HiveMind) project.*
