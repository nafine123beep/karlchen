# Doppelkopf Game Logic Specification

> Documents **real current behavior** of the engine as of 2026-03-14.
> Each rule is labeled: **Implemented** | **Partially implemented** | **Not implemented** | **Unclear/inconsistent**.

---

## 1. Overview

Karlchen is a Doppelkopf teaching app built with React Native / Expo. It implements the "mit Neunen" variant (48 cards). The engine supports a single round of play (4 players, 12 tricks) with basic AI opponents, a scripted tutorial ("Illusion Game"), and a contextual hint system.

**Variant:** Mit Neunen (48 cards: 4 suits x 6 ranks x 2 copies).
**Players:** 4 (1 human at index 0, 3 AI).
**Total points in deck:** 240.

---

## 2. Core Gameplay Flow

**Status: Implemented**

The game progresses through these phases, defined in `GamePhase` enum:

1. **DEALING** — Deck created, shuffled (Fisher-Yates), 12 cards dealt to each player.
2. **ANNOUNCEMENTS** — Players may announce Re/Kontra (limited window).
3. **PLAYING** — 12 tricks played in sequence; trick winner leads next trick.
4. **SCORING** — Final scores calculated.
5. **FINISHED** — Game over.

**Orchestrator:** [GameEngine.ts](src/engine/GameEngine.ts) — `initialize()` creates deck, deals, initializes trump flags, assigns teams, sorts hands, sets phase to ANNOUNCEMENTS.

**State model:** [GameState.ts](src/engine/models/GameState.ts) — holds players, current trick, completed tricks, scores, special points.

**Known issue:** `GameState.startNewTrick()` ([GameState.ts:76](src/engine/models/GameState.ts#L76)) reads `this.currentTrick.winnerId` which may be undefined if called before trick winner is set. In practice this is safe because `GameEngine.completeTrick()` always sets the winner before calling `startNewTrick()`, but the fallback expression `?? player_${this.currentPlayerIndex}` masks potential bugs.

---

## 3. Card Model

**Status: Implemented**

**File:** [Card.ts](src/engine/models/Card.ts)

Each card has:
- `id`: `${suit}_${rank}_${copyNumber}` (e.g., `hearts_10_1`)
- `suit`: clubs | spades | hearts | diamonds
- `rank`: 9 | J | Q | K | 10 | A
- `value`: point value (A=11, 10=10, K=4, Q=3, J=2, 9=0)
- `isTrump`: set by `initializeTrumpCards()` after dealing
- `trumpOrder`: 0-12 for trump cards, undefined for non-trump

**Card ID format:** `{suit}_{rank}_{1|2}` — copy number distinguishes duplicates.

`Card.compareTo(other)` compares by rank strength only: A(5) > 10(4) > K(3) > Q(2) > J(1) > 9(0). Used in `trickLogic.ts` for non-trump suit comparison and in `Player.sortHand()`. This is correct because call sites guarantee both cards are non-trump.

**Deck:** [Deck.ts](src/engine/models/Deck.ts) — creates 48 cards, Fisher-Yates shuffle (implemented despite TODO saying otherwise), deals 4 hands of 12.

---

## 4. Trump / Non-Trump Logic

**Status: Implemented**

**File:** [trumpLogic.ts](src/engine/logic/trumpLogic.ts)

### Trump hierarchy (highest to lowest)

| Order | Card | Trump Order Value |
|-------|------|-------------------|
| 1 | Herz 10 (Dulle) | 0 |
| 2 | Kreuz-Dame | 1 |
| 3 | Pik-Dame | 2 |
| 4 | Herz-Dame | 3 |
| 5 | Karo-Dame | 4 |
| 6 | Kreuz-Bube | 5 |
| 7 | Pik-Bube | 6 |
| 8 | Herz-Bube | 7 |
| 9 | Karo-Bube | 8 |
| 10 | Karo-Ass | 9 |
| 11 | Karo-10 | 10 |
| 12 | Karo-König | 11 |
| 13 | Karo-9 | 12 |

Lower `trumpOrder` value = stronger card.

### What counts as trump

- `isDulle(card)`: rank=10 AND suit=hearts → **true** ([trumpLogic.ts:19-21](src/engine/logic/trumpLogic.ts#L19-L21))
- All Queens (any suit)
- All Jacks (any suit)
- All Diamonds (any rank)
- The Herz 10 (Dulle) — highest trump

**Total trump cards:** 26 (2 Dulles + 8 Queens + 8 Jacks + 8 Diamonds).
Defined in [constants.ts](src/data/constants.ts) as `TRUMP_COUNTS`.

### Initialization

`initializeTrumpCards(cards, trumpSuit)` iterates all cards, calls `isTrump()` and `getTrumpOrder()`, then calls `card.setTrump(order)` for each trump card. Called once during `GameEngine.initialize()`.

### Second Dulle Rule

**Status: Implemented**

When two Herz 10 cards appear in the same trick, the **second one played** beats the first — **except in the last trick (trick 12)**, where the **first Dulle wins**. This is implemented in three places:
- [trickLogic.ts](src/engine/logic/trickLogic.ts) — `calculateTrickWinner()` checks `isLastTrick` flag
- [trickLogic.ts](src/engine/logic/trickLogic.ts) — `canBeat(isLastTrick)` parameter
- [hints/utils.ts](src/engine/hints/utils.ts) — `beats(isLastTrick)` parameter

Logic: when `compareTrumpCards` returns 0 (equal order) AND the card is a Dulle AND it's **not the last trick**, the later card wins. In trick 12, the first Dulle holds.

---

## 5. Legal Move Rules (Bedienzwang / Farbzwang)

**Status: Implemented**

**File:** [legalMoves.ts](src/engine/logic/legalMoves.ts)

### Rules

1. **Leading the trick** (trick size = 0): any card is legal.
2. **Lead card is trump**: must play a trump card if you have one.
3. **Lead card is non-trump**: must follow the lead suit (excluding trump cards of that suit). E.g., if Hearts is led, Herz 10 is NOT required (it's trump, not a Hearts suit card).
4. **Cannot follow suit**: any card is legal (may trump or discard).

### Key detail: Trump-suit exclusion

`sameSuitCards` is filtered with `!card.isTrump` ([legalMoves.ts:44](src/engine/logic/legalMoves.ts#L44)). This correctly excludes:
- Queens and Jacks of the led suit (they are trump, not suit cards)
- Herz 10 when Hearts is led (it's the Dulle, a trump)
- Diamond cards when Diamonds is led (all Diamonds are trump)

### Validation

`validateMove()` returns German error messages with Doppelkopf rule explanations ([legalMoves.ts:133-184](src/engine/logic/legalMoves.ts#L133-L184)).

### `getWinningMoves()`

**Status: Implemented** ([legalMoves.ts:97-109](src/engine/logic/legalMoves.ts#L97-L109))
Filters legal moves to only those that can beat the current winning card, using `getCurrentWinningCard()` and `canBeat()` from trickLogic. Returns all legal moves when leading.

---

## 6. Trick Evaluation

**Status: Implemented**

**File:** [trickLogic.ts](src/engine/logic/trickLogic.ts)

### Winner determination (`calculateTrickWinner`)

1. If any trump cards were played: highest trump wins (lowest `trumpOrder`), with second-Dulle-beats-first rule.
2. If no trump: highest card of lead suit wins (compared by `Card.compareTo()` rank strength).
3. Fallback: lead player wins (should never happen in a valid game).

### Card comparison for non-trump

Uses `Card.compareTo()` which compares by rank strength: A(5) > 10(4) > K(3) > Q(2) > J(1) > 9(0). This works for non-trump comparison because Queens/Jacks of suit are already classified as trump and filtered out.

### `canBeat()` function

Used by `getCurrentWinningCard()` to track the running winner during a trick. Handles trump-vs-non-trump, trump-vs-trump (with Dulle rule), and same-suit non-trump comparison.

### Trick model

[Trick.ts](src/engine/models/Trick.ts) — stores played cards with player IDs, tracks lead player, winner, provides `getTotalValue()` (sum of card values).

---

## 7. Scoring / Special Scoring

**Status: Partially implemented**

**File:** [scoreLogic.ts](src/engine/logic/scoreLogic.ts)

### Base scoring

- Total points: 240 (validated by `validateTotalPoints()`).
- Winner: team with more points. At exactly 120-120, **Kontra wins** (Re needs 121+). Implemented at [scoreLogic.ts:43](src/engine/logic/scoreLogic.ts#L43): `rePoints > kontraPoints ? Team.RE : Team.CONTRA`.

### Game value calculation

Base game value = 1, plus:
- Against 90 (+1): opponent < 90 points
- Against 60 (+1): opponent < 60 points
- Against 30 (+1): opponent < 30 points
- Schwarz (+1): opponent = 0 points

Maximum game value: 5 (1 base + 4 bonuses). Announcements do **not** multiply or add to game value.

### Special point detection

Tracked in `GameState.specialPoints` via `GameEngine.trackSpecialAchievements()`:

| Special | Status | Detection | File Reference |
|---------|--------|-----------|----------------|
| Fox catch (opponent captures your Karo-Ass) | **Implemented** | `detectFoxCatch()` | [scoreLogic.ts](src/engine/logic/scoreLogic.ts) |
| Karlchen (win trick 12 with Kreuz-Bube) | **Implemented** | `detectKarlchen()` | [scoreLogic.ts](src/engine/logic/scoreLogic.ts) |
| Karlchen caught (opponent captures Kreuz-Bube in trick 12) | **Implemented** | `detectKarlchenCaught()` | [scoreLogic.ts](src/engine/logic/scoreLogic.ts) |
| Fox in last trick (win trick 12 with Karo-Ass) | **Implemented** | `detectFoxLastTrick()` | [scoreLogic.ts](src/engine/logic/scoreLogic.ts) |
| Doppelkopf trick (40+ points in one trick) | **Implemented** | `detectDoppelkopfTrick()` | [scoreLogic.ts](src/engine/logic/scoreLogic.ts) |

**Note:** These special points are **detected and stored** but their effect on final game value is unclear. `calculateGameValue()` only counts base + against90/60/30 + schwarz. Fox catch, Karlchen, Karlchen caught, Fox last trick, and Doppelkopf trick bonuses are tracked in `specialPoints` but not added to `totalGameValue`.

### Not implemented

- Announcement-based score modifiers (Re/Kontra doubling)
- Absagen (No 90, No 60, No 30, Schwarz announcements)
- Multi-round scoring / running totals across games

---

## 8. Announcement Logic

**Status: Partially implemented**

### What works

- Players can announce Re or Kontra via `Player.announceTeam()` ([Player.ts:77-85](src/engine/models/Player.ts#L77-L85)).
- `canAnnounce()` in [teamLogic.ts:78-91](src/engine/logic/teamLogic.ts#L78-L91) restricts announcements to: not already announced, team is known, and player has played at most 1 card.
- `announceTeam()` in teamLogic verifies the announced team matches the player's actual team.
- AI uses `shouldAnnounce()` ([aiStrategies.ts:148-155](src/engine/ai/aiStrategies.ts#L148-L155)) — announces if 6+ trumps or 5+ high-value cards.

### What is missing

- **No score impact**: Announcements are tracked (`hasAnnounced` flag) but do not affect game value calculation.
- **No Absagen**: No 90, No 60, No 30, Schwarz announcements are not implemented.
- **Announcement timing in UI**: The game transitions from ANNOUNCEMENTS to PLAYING, but the UI flow for this is basic.

---

## 9. End-of-Round / End-of-Game Logic

**Status: Partially implemented**

### End of round

- `GameState.isGameFinished()`: true when 12 tricks completed ([GameState.ts:92-94](src/engine/models/GameState.ts#L92-L94)).
- `GameEngine.finishGame()`: sets phase to SCORING, calculates final score, stores special points, sets phase to FINISHED.

### What is missing

- **Multi-round games**: No support for playing multiple rounds. Each `GameEngine` instance is one round.
- **No game-over UI logic** in the engine (handled entirely by the store/UI layer).

---

## 10. Open Issues / Inconsistencies

### Resolved bugs (fixed 2026-03-14)

| ID | Resolution |
|----|------------|
| BUG-1 | Dead `leadSuit` parameter removed from `Card.compareTo()`. Call sites in trickLogic updated. |
| BUG-2 | `Player.determineTeamFromCards()` deleted (was dead code duplicating `teamLogic.determinePlayerTeam()`). |
| BUG-3 | `getWinningMoves()` now filters legal moves using `canBeat()` + `getCurrentWinningCard()` from trickLogic. |
| INC-1 | GameRulesScreen updated: Dulle shown as #1 trump, second-Dulle rule added. |
| INC-2 | Sonderspiele section removed from GameRulesScreen (Hochzeit/Solo/Armut not implemented). |
| INC-3 | Tutorial slide 5 clarified: "Bei 120:120 gewinnt Kontra." |
| INC-4 | Resolved by BUG-2 fix (dead method deleted). |
| TODOs | ~45 misleading TODO comments removed from 12 engine files. Only genuine TODOs remain (Hochzeit, Solo, multi-strategy AI). |
| hintsStore | `onTrickComplete()` now resets `lastHintTimestamp` so the 3-second cooldown doesn't carry across tricks. |

### Not implemented features

| Feature | Where referenced | Engine status |
|---------|-----------------|---------------|
| Hochzeit (Wedding) | teamLogic TODO | `detectSpecialGame()` returns `'normal'` always |
| Solo | teamLogic TODO | Not implemented |
| Armut (Poverty) | N/A (removed from UI) | Not implemented |
| Absagen (No 90/60/30) | scoreLogic comment | Not implemented |
| Announcement score doubling | scoreLogic comment | Not implemented |
| Multi-round play | N/A | Not implemented |

---

## 11. Source Code Mapping

### Engine Core

| File | Purpose | Key exports |
|------|---------|-------------|
| [GameEngine.ts](src/engine/GameEngine.ts) | Game orchestrator | `GameEngine` class |
| [GameState.ts](src/engine/models/GameState.ts) | Central state model | `GameState` class |
| [Card.ts](src/engine/models/Card.ts) | Card model | `Card` class |
| [Player.ts](src/engine/models/Player.ts) | Player model | `Player` class |
| [Trick.ts](src/engine/models/Trick.ts) | Trick model | `Trick` class, `PlayedCard` |
| [Deck.ts](src/engine/models/Deck.ts) | Deck creation/dealing | `Deck` class |

### Game Logic

| File | Purpose | Key exports |
|------|---------|-------------|
| [trumpLogic.ts](src/engine/logic/trumpLogic.ts) | Trump detection, ordering, comparison | `isTrump`, `isDulle`, `getTrumpOrder`, `compareTrumpCards`, `initializeTrumpCards` |
| [trickLogic.ts](src/engine/logic/trickLogic.ts) | Trick winner, beat logic | `calculateTrickWinner`, `canBeat`, `getCurrentWinningCard` |
| [legalMoves.ts](src/engine/logic/legalMoves.ts) | Bedienzwang enforcement | `getLegalMoves`, `validateMove`, `isLegalMove` |
| [scoreLogic.ts](src/engine/logic/scoreLogic.ts) | Points, game value, special detection | `calculateFinalScore`, `detectFoxCatch`, `detectKarlchen`, `detectKarlchenCaught`, `detectFoxLastTrick`, `detectDoppelkopfTrick` |
| [teamLogic.ts](src/engine/logic/teamLogic.ts) | Re/Kontra assignment | `assignTeams`, `determinePlayerTeam`, `getPartner`, `canAnnounce` |

### AI

| File | Purpose | Key exports |
|------|---------|-------------|
| [aiStrategies.ts](src/engine/ai/aiStrategies.ts) | Card selection heuristics | `selectCardToPlay`, `shouldAnnounce` |

### Hint System

| File | Purpose |
|------|---------|
| [HintEngine.ts](src/engine/hints/HintEngine.ts) | Main hint orchestrator |
| [FeedbackHintEngine.ts](src/engine/hints/FeedbackHintEngine.ts) | Post-trick feedback hints |
| [hints/utils.ts](src/engine/hints/utils.ts) | Shared hint helpers (`beats`, `getCurrentWinningCard`) |
| [hints/triggers/](src/engine/hints/triggers/) | 7 trigger files for pre-move hints |
| [hints/feedback/](src/engine/hints/feedback/) | 3 feedback files for post-trick hints |

### Data / Content

| File | Purpose |
|------|---------|
| [constants.ts](src/data/constants.ts) | Trump counts, game constants |
| [explanations.ts](src/data/explanations.ts) | Learning content by category |
| [illusionGameScript.ts](src/data/illusionGame/illusionGameScript.ts) | Scripted tutorial card distributions and AI moves |
| [illusionHints.ts](src/data/illusionGame/illusionHints.ts) | Tutorial-specific contextual hints |
| [quizQuestions.ts](src/data/quiz/quizQuestions.ts) | 10 quiz questions |
| [tutorialSlides.ts](src/data/tutorial/tutorialSlides.ts) | Tutorial slide content |

### State Management (Zustand)

| File | Purpose |
|------|---------|
| [gameStore.ts](src/store/gameStore.ts) | Game state, player actions |
| [hintsStore.ts](src/store/hintsStore.ts) | Hint display, suppression |
| [learningStore.ts](src/store/learningStore.ts) | Tutorial progress |
| [settingsStore.ts](src/store/settingsStore.ts) | User preferences |

### Types

| File | Key types |
|------|-----------|
| [card.types.ts](src/types/card.types.ts) | `Suit`, `Rank`, `ICard`, `TrumpOrder`, `CardData` |
| [game.types.ts](src/types/game.types.ts) | `GamePhase`, `Team`, `PlayerId`, `SpecialPoints` |
| [hint.types.ts](src/types/hint.types.ts) | `Hint`, `HintContext` |
| [learning.types.ts](src/types/learning.types.ts) | `TipCategory` |

### Tests

| File | Covers |
|------|--------|
| [trumpLogic.test.ts](__tests__/engine/trumpLogic.test.ts) | Trump detection, ordering, Dulle |
| [trickLogic.test.ts](__tests__/engine/trickLogic.test.ts) | Trick winner, canBeat, Dulle rule |
| [legalMoves.test.ts](__tests__/engine/legalMoves.test.ts) | Bedienzwang rules |
| [scoreLogic.test.ts](__tests__/engine/scoreLogic.test.ts) | Score calculation, special point detection |
| [Card.test.ts](__tests__/engine/Card.test.ts) | Card model basics |
| [Player.test.ts](__tests__/engine/Player.test.ts) | Player model |
| [Trick.test.ts](__tests__/engine/Trick.test.ts) | Trick model |
| [Deck.test.ts](__tests__/engine/Deck.test.ts) | Deck creation, dealing |
| [GameEngine.test.ts](__tests__/engine/GameEngine.test.ts) | Game orchestration |
| [teamLogic.test.ts](__tests__/engine/teamLogic.test.ts) | Team assignment |
| [aiStrategies.test.ts](__tests__/engine/aiStrategies.test.ts) | AI strategies |
| [aiPlayer.test.ts](__tests__/engine/aiPlayer.test.ts) | AI card selection |
| [HintEngine.test.ts](__tests__/engine/hints/HintEngine.test.ts) | Hint triggering |
| [hintsStore.test.ts](__tests__/store/hintsStore.test.ts) | Zustand hint store |
| [quizStore.test.ts](__tests__/quiz/quizStore.test.ts) | Quiz state |
