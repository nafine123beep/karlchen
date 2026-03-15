# Pending Doppelkopf Rules — Not Yet Implemented

> Features referenced in the user's rule review (2026-03-14) that are not yet in the engine.
> Ordered by implementation priority.

---

## 1. Gegen die Alten (+1 Sonderpunkt)

Wenn das Kontra-Team das Re-Team besiegt, gibt es einen zusätzlichen Sonderpunkt.
- Ohne Kontra-Ansage: +1 Extrapunkt
- Mit Kontra-Ansage + Sieg: +2 Extrapunkte

**Affected files:** `scoreLogic.ts` (calculateGameValue), `game.types.ts` (SpecialPoints)

---

## 2. Ansagen-Wertung (Re/Kontra scoring effects)

Ansagen beeinflussen die Punktwertung:
- „Re" angesagt + gewonnen: alle Punkte x2
- „Kontra" angesagt + gewonnen: +2 Extrapunkte (Gegen die Alten + Ansage)
- Ansagen müssen bis zur 5. gespielten Karte (insgesamt, nicht pro Spieler) erfolgen
- Risiko: Wenn du ansagst und verlierst, bekommt der Gegner alle Punkte

**Current state:** `hasAnnounced` flag exists, `canAnnounce` has timing check, but scoring ignores announcements entirely.

**Affected files:** `scoreLogic.ts`, `teamLogic.ts` (canAnnounce timing), `GameEngine.ts`

---

## 3. Absagen-Kette (Keine 9 / Keine 6 / Keine 3)

Erweiterte Ansagen mit Zeitlimits:
- „Keine 9" (Keine 90): muss angesagt werden bis zur 9. gespielten Karte. Gewonnen = +1
- „Keine 6" (Keine 60): bis zur 13. Karte. Gewonnen = +1
- „Keine 3" (Keine 30): bis zur 17. Karte. Gewonnen = +1

Jede Absage setzt die vorherige voraus (man kann nicht „Keine 6" sagen ohne vorher „Keine 9").

**Affected files:** `Player.ts` (announcement state), `teamLogic.ts` (canAnnounce), `scoreLogic.ts`, `game.types.ts`

---

## 4. Schweinchen (beide Karo-Asse)

Wenn ein Spieler beide Karo-Asse auf der Hand hat, kann er „Schweinchen" ansagen. Zwei Varianten:
1. Beide Karo-Asse werden zu den höchsten Trümpfen (über der Dulle)
2. Nur eines wird zum allerhöchsten Trumpf

Das Karo-Ass bleibt in beiden Varianten der Fuchs.

**Affected files:** `trumpLogic.ts` (trump ordering), `Card.ts`, `game.types.ts`, UI for announcement

---

## 5. Sonderspiele

### 5.1 Hochzeit (Wedding)
Ein Spieler hat beide Kreuz-Damen. Er sucht sich einen Partner über den ersten Stich (Findungsstich). Der erste Fremde, der einen Stich gewinnt, wird sein Partner.

Reihenfolge der Erkennung: Hochzeit > Armut > Solo.

### 5.2 Armut (Poverty)
Ein Spieler hat 3 oder weniger Trümpfe. Er kann seine Trümpfe an einen anderen Spieler abgeben, der dafür die gleiche Anzahl Karten zurückgibt.

### 5.3 Solo
Ein Spieler spielt allein gegen die anderen drei. Verschiedene Solo-Typen (Trumpf-Solo, Damen-Solo, Buben-Solo, Fleischlos).

### 5.4 Schmeiß (Re-Deal)
Unter bestimmten Bedingungen (z.B. 5+ Neunen) kann ein Spieler das Spiel „schmeißen" und die Karten werden neu gemischt.

**Note:** Bei Sonderspielen zählen Findungsstiche nicht für die Absagen-Timing-Regeln.

**Affected files:** `teamLogic.ts` (detectSpecialGame), `GameEngine.ts`, `GameState.ts`, UI screens

---

## 6. Herz-Durchlauf (+1 Sonderpunkt)

Wenn in einem Stich Herz als Fehlfarbe gespielt wird (nicht als Trumpf), gibt es einen Sonderpunkt.

**Note:** Herz-10 (Dulle) ist Trumpf, nicht Herz. Herz-Ass, Herz-König und Herz-9 sind Fehlfarben.

**Affected files:** `scoreLogic.ts`, `game.types.ts` (SpecialPoints)

---

## Implementation Notes

- Features 1-3 (Gegen die Alten, Ansagen-Wertung, Absagen) are scoring-only changes and can be done incrementally.
- Feature 4 (Schweinchen) requires trump logic changes and UI for announcement.
- Feature 5 (Sonderspiele) is the largest change — it requires team reassignment, card exchange (Armut), and entirely new game flows.
- Feature 6 (Herz-Durchlauf) is a simple detection in scoreLogic.

For each feature, update `docs/game-logic-spec.md` and tests when implementing.
