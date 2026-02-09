# 🤝 Contributing Guide

## 📐 Code-Konventionen

### TypeScript

- **Strikte Types**: Nutze `strict: true`, vermeide `any`
- **Interfaces über Types**: Für öffentliche APIs
- **Explizite Return Types**: Für alle öffentlichen Funktionen
- **Enums für Konstanten**: `enum Suit { Hearts, Diamonds, Clubs, Spades }`

### Naming

- **PascalCase**: Classes, Interfaces, Types, Components
- **camelCase**: Variablen, Funktionen, Methods
- **UPPER_SNAKE_CASE**: Konstanten (`const MAX_CARDS = 48`)
- **Präfixe**: `is/has/can` für Booleans (`isPlayerTurn`, `hasTrump`)

### File Structure

```typescript
// 1. Imports (externe, dann interne)
import React from 'react';
import { Card } from '@/engine/models/Card';

// 2. Types/Interfaces
interface PlayerProps {
  name: string;
}

// 3. Konstanten
const DEFAULT_HAND_SIZE = 12;

// 4. Komponente/Class
export class Player { ... }

// 5. Helper Functions (nicht exportiert)
function calculateScore() { ... }
```

## 🧪 Testing-Anforderungen

### Coverage-Ziele

- **Engine Logic**: >= 90% Coverage (kritisch!)
- **Stores**: >= 80% Coverage
- **Components**: >= 60% Coverage

### Was muss getestet werden?

```typescript
// ✅ MUSS getestet werden
- Game Engine Logic (trumpLogic, trickLogic, scoreLogic)
- Legal Moves Validation
- AI Strategien
- Zustand Store Actions

// ⚠️ SOLLTE getestet werden
- Complex Components (GameBoard)
- Navigation Flows
- Data Transformations

// 🤷 OPTIONAL
- Einfache UI Components (Button)
- Style-Only Components
```

### Test-Struktur

```typescript
describe('TrickLogic', () => {
  describe('calculateWinner', () => {
    it('should return player with highest trump card', () => {
      // Arrange
      const trick = createTestTrick(...);

      // Act
      const winner = calculateWinner(trick);

      // Assert
      expect(winner).toBe(expectedPlayer);
    });

    it('should handle edge case: all cards same rank', () => {
      // ...
    });
  });
});
```

## 🔄 Git Workflow

### Branches

- `main` - Production-ready Code
- `develop` - Development Branch
- `feature/doppelkopf-rules` - Features
- `fix/trick-calculation-bug` - Bugfixes

### Commits

Nutze **Conventional Commits**:

```bash
feat: add trick winner calculation
fix: resolve trump ordering bug
test: add tests for AI strategy
docs: update README with setup instructions
refactor: extract card comparison logic
chore: update dependencies
```

### Pull Requests

**Vor dem PR:**
```bash
npm run lint:fix    # Code formatieren
npm test           # Alle Tests laufen
npm run type-check # TypeScript Check
```

**PR-Template:**
```markdown
## 🎯 Was macht dieser PR?
- Implementiert Trick Winner Calculation
- Fügt Tests für Edge Cases hinzu

## 🧪 Wie getestet?
- Unit Tests für calculateWinner()
- Manuelle Tests mit verschiedenen Trick-Konstellationen

## 📸 Screenshots (bei UI-Changes)
[...]
```

## 🏗️ Architektur-Entscheidungen

### Separation of Concerns

```
UI (React Native)
    ↓
Stores (Zustand)
    ↓
Engine (Pure TypeScript)
```

**Regel**: Engine kennt UI NICHT. UI kennt Engine nur über Stores.

### State Management

```typescript
// ✅ RICHTIG: Actions in Store
const playCard = (cardId: string) => {
  const result = GameEngine.playCard(get().gameState, cardId);
  set({ gameState: result.newState });
};

// ❌ FALSCH: UI modifiziert State direkt
const MyComponent = () => {
  gameState.currentTrick.addCard(card); // NEIN!
};
```

### Immutability

```typescript
// ✅ RICHTIG: Neue Objekte erstellen
const newGameState = {
  ...gameState,
  currentTrick: [...gameState.currentTrick, newCard],
};

// ❌ FALSCH: State mutieren
gameState.currentTrick.push(newCard);
```

## 🎨 UI-Komponenten Guidelines

### Component-Struktur

```typescript
interface CardProps {
  suit: Suit;
  rank: Rank;
  isTrump: boolean;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ suit, rank, isTrump, onPress }) => {
  // 1. Hooks
  const [isPressed, setIsPressed] = useState(false);

  // 2. Derived State
  const cardColor = getCardColor(suit);

  // 3. Handlers
  const handlePress = () => {
    setIsPressed(true);
    onPress?.();
  };

  // 4. Render
  return <Pressable onPress={handlePress}>...</Pressable>;
};
```

### Performance

- **React.memo**: Für teure Components
- **useCallback**: Für Callbacks an Child-Components
- **useMemo**: Für teure Berechnungen

## 📝 Dokumentation

### JSDoc für Public APIs

```typescript
/**
 * Berechnet den Gewinner eines Stichs nach Doppelkopf-Regeln.
 *
 * @param trick - Der zu bewertende Stich mit 4 Karten
 * @param trumpSuit - Die aktuelle Trumpffarbe
 * @returns Der Index des Gewinners (0-3)
 *
 * @example
 * const winner = calculateWinner(trick, Suit.Hearts);
 * console.log(`Player ${winner} wins this trick`);
 */
export function calculateWinner(trick: Trick, trumpSuit: Suit): number {
  // ...
}
```

### TODO-Kommentare

```typescript
// TODO: Implement Hochzeit announcement
// FIXME: Edge case when both players have same trump
// HACK: Temporary workaround until we refactor AI
// NOTE: This follows official Doppelkopf tournament rules
```

## 🚀 Release Process

1. **Feature Freeze** auf `develop`
2. **Version Bump**: `npm version minor`
3. **Changelog** aktualisieren
4. **Merge** `develop` → `main`
5. **Tag** erstellen: `v0.2.0`
6. **Build** für TestFlight

## 🐛 Bug Reports

```markdown
**Bug**: Trick winner calculation incorrect with Queens

**Schritte zum Reproduzieren**:
1. Start game with Hearts as trump
2. Play: 🂱 → 🃁 → 🃋 → 🂻
3. Observe winner

**Erwartet**: Player 3 (🃋 Queen of Spades)
**Tatsächlich**: Player 1 (🂱 Ace of Hearts)

**Environment**: iOS 17.2, iPhone 15 Simulator
```

---

**Fragen?** Öffne ein Issue oder frag im Team!
