# Beginner Hints System - Implementation Status

## ✅ Completed Components

### Core System (All Done)
1. **Type Definitions** (`src/types/hint.types.ts`)
   - HintId type with 7 hint types
   - Hint interface
   - HintContext interface

2. **Hints Store** (`src/store/hintsStore.ts`)
   - Suppression tracking (max 1/trick, 8/game, no repeats)
   - Rule violations bypass limits
   - Trick/game lifecycle hooks

3. **Settings Store** (`src/store/settingsStore.ts`) - MODIFIED
   - Added `beginnerHintsEnabled: boolean` (default: true)
   - Added `setBeginnerHintsEnabled()` action
   - Persisted via AsyncStorage

4. **Hint Utilities** (`src/engine/hints/utils.ts`)
   - SUIT_NAMES_DE
   - getCurrentWinningCard()
   - getCurrentWinningPlayer()
   - canBeat()
   - getRequiredSuit()

5. **All 7 Hint Triggers** (`src/engine/hints/triggers/`)
   - ✅ followSuitOrTrump.ts - Rule violations
   - ✅ trumpBeatsSuit.ts - Trump priority
   - ✅ saveHighTrumps.ts - Trump conservation
   - ✅ foxProtection.ts - Fox protection
   - ✅ eyesManagement.ts - Point management
   - ✅ schmieren.ts - Team strategy
   - ✅ karlchenLateGame.ts - Endgame bonus

6. **Hint Engine Core** (`src/engine/hints/HintEngine.ts`)
   - Main `getHint(context)` function
   - Trigger priority ordering
   - Suppression integration

7. **HintModal Component** (`src/components/game/HintModal.tsx`)
   - Info/Warning styling (blue/orange)
   - "Verstanden" + optional "Mehr erfahren" buttons
   - Follows IllegalMoveModal pattern

8. **SettingsScreen** (`src/screens/SettingsScreen.tsx`)
   - Toggle for beginner hints
   - Clean UI matching app theme

9. **Navigation** - COMPLETED
   - Added Settings route to AppNavigator
   - Added Settings button to HomeScreen

## ⏳ Remaining Integration Points

### 1. GameScreen Integration (CRITICAL)

The hints need to be integrated into the card play flow. Here's how:

**File to modify:** `src/screens/GameScreen.tsx`

**Required changes:**

```typescript
// 1. Add imports at top
import { getHint } from '@/engine/hints/HintEngine';
import { HintModal } from '@/components/game/HintModal';
import { useHintsStore } from '@/store/hintsStore';
import { useSettingsStore } from '@/store/settingsStore';
import { Hint } from '@/types/hint.types';

// 2. Add state
const [currentHint, setCurrentHint] = useState<Hint | null>(null);
const beginnerHintsEnabled = useSettingsStore(state => state.beginnerHintsEnabled);

// 3. Modify handleCardPress() - BEFORE playCard() call
const handleCardPress = async (cardId: string) => {
  // ... existing code to get card and player ...

  // Validate move (existing)
  const validation = validateMove(card, humanPlayer, gameState.currentTrick);

  if (!validation.valid) {
    setIllegalMoveError({...}); // existing
    return;
  }

  // NEW: Check for hints if enabled
  if (beginnerHintsEnabled) {
    const hint = getHint({
      selectedCard: card,
      playerHand: humanPlayer.hand,
      currentTrick: gameState.currentTrick,
      legalMoves: getLegalMoves(), // or however you get legal moves
      completedTricks: gameState.completedTricks,
      trickIndex: gameState.completedTricks.length,
      playerTeam: humanPlayer.team,
      announcements: {
        re: gameState.players.some(p => p.team === Team.RE && p.hasAnnounced),
        kontra: gameState.players.some(p => p.team === Team.CONTRA && p.hasAnnounced),
      },
    });

    if (hint) {
      setCurrentHint(hint);
      return; // Don't play card yet, show hint first
    }
  }

  // ... existing card play logic ...
};

// 4. Add HintModal render (after other modals)
<HintModal
  visible={currentHint !== null}
  hint={currentHint}
  onDismiss={() => {
    const card = currentHint; // Save card info if needed
    setCurrentHint(null);
    // Optionally: auto-play the card after dismissing hint
    // Or require user to click card again
  }}
  onLearnMore={(key) => {
    // Optional: navigate to tutorial section
    // navigation.navigate('BasicTutorial', { scrollTo: key });
  }}
/>
```

### 2. Game Store Lifecycle Hooks

**File to modify:** `src/store/gameStore.ts`

**Required changes:**

```typescript
// Add import
import { useHintsStore } from './hintsStore';

// In startNewGame() action:
startNewGame: () => {
  // ... existing game setup ...
  useHintsStore.getState().resetForNewGame();
},

// In completeTrick() or wherever tricks complete:
completeTrick: () => {
  // ... existing trick completion ...
  useHintsStore.getState().onTrickComplete();
},
```

### 3. Optional: Quick In-Game Hints Toggle

Add to GameScreen header/menu area:

```typescript
const toggleHints = () => {
  useSettingsStore.getState().setBeginnerHintsEnabled(!beginnerHintsEnabled);
};

// In render:
<Pressable onPress={toggleHints} style={styles.hintToggle}>
  <Text>{beginnerHintsEnabled ? '💡' : '🚫'}</Text>
</Pressable>
```

## 🧪 Testing

### Basic Test (Already Created)

```typescript
// __tests__/store/hintsStore.test.ts
describe('HintsStore', () => {
  it('enforces max 1 hint per trick', () => {
    const store = useHintsStore.getState();
    store.resetForNewGame();

    expect(store.canShowHint('TRUMP_BEATS_SUIT', false)).toBe(true);
    store.recordHintShown('TRUMP_BEATS_SUIT');

    expect(store.canShowHint('SAVE_HIGH_TRUMPS', false)).toBe(false);
  });

  it('allows rule violations even after limits', () => {
    const store = useHintsStore.getState();
    store.resetForNewGame();

    store.recordHintShown('TRUMP_BEATS_SUIT');
    expect(store.canShowHint('FOLLOW_SUIT_OR_TRUMP', true)).toBe(true);
  });
});
```

### To Run Tests

```bash
npx jest
```

## 📋 Implementation Checklist

- [x] Type definitions
- [x] Hints store with suppression logic
- [x] Settings store integration
- [x] Hint utilities (game state helpers)
- [x] All 7 hint triggers implemented
- [x] Hint engine core
- [x] HintModal component
- [x] SettingsScreen
- [x] Navigation (Settings route + HomeScreen button)
- [ ] GameScreen integration (see above)
- [ ] Game store lifecycle hooks (see above)
- [ ] Tests (basic hintsStore test created)
- [ ] Manual testing

## 🎯 How to Use

1. **Enable Hints:** Go to Settings screen (⚙️ button on Home), toggle "Anfänger-Hinweise" ON
2. **Play Game:** Start a practice game
3. **See Hints:**
   - Try to play illegal card → "Du musst X bedienen!" warning
   - Play non-trump when trump in trick → "Trumpf sticht immer!" info
   - Use high trump unnecessarily → "Hohen Trumpf sparen?" info
   - etc.
4. **Suppress:** Hints auto-suppress (max 1/trick, 8/game, no repeats)

## 🔧 How to Add New Hints

1. Add new hint ID to `src/types/hint.types.ts`:
   ```typescript
   export type HintId =
     | 'FOLLOW_SUIT_OR_TRUMP'
     // ... existing
     | 'YOUR_NEW_HINT';
   ```

2. Create trigger file `src/engine/hints/triggers/yourNewHint.ts`:
   ```typescript
   export function checkYourNewHint(context: HintContext): Hint | null {
     // Your logic here
     if (shouldShowHint) {
       return {
         id: 'YOUR_NEW_HINT',
         title: 'German Title',
         message: 'German explanation',
         severity: 'info',
       };
     }
     return null;
   }
   ```

3. Add to trigger list in `src/engine/hints/HintEngine.ts`:
   ```typescript
   import { checkYourNewHint } from './triggers/yourNewHint';

   const triggers = [
     // ... existing
     checkYourNewHint,
   ];
   ```

4. Write test in `__tests__/engine/hints/HintEngine.test.ts`

## 📚 Hint Trigger Details

### 1. FOLLOW_SUIT_OR_TRUMP (warn)
- **When:** Player attempts illegal move
- **Message:** "Du musst [Suit] bedienen!" or "Du musst Trumpf bedienen!"
- **Always shown:** Yes (educational priority)

### 2. TRUMP_BEATS_SUIT (info)
- **When:** Playing non-trump while trump already in trick
- **Message:** "Trumpf sticht immer!"
- **Helps with:** Understanding trump priority

### 3. SAVE_HIGH_TRUMPS (info)
- **When:** Using high trump (Queens/Jacks) when lower trump would win
- **Message:** "Hohen Trumpf sparen?"
- **Helps with:** Trump conservation strategy

### 4. FOX_PROTECTION (warn)
- **When:** Playing Diamond Ace in losing trick
- **Message:** "Fuchs in Gefahr!"
- **Helps with:** Special card awareness

### 5. EYES_MANAGEMENT (info)
- **When:** Discarding 10/Ace in losing trick with lower option available
- **Message:** "Augen abwerfen?"
- **Helps with:** Point minimization

### 6. SCHMIEREN (info)
- **When:** Partner winning, player could add high-value card
- **Message:** "Schmieren möglich!"
- **Note:** Conservative (only triggers with announcements)

### 7. KARLCHEN_LATE_GAME (info)
- **When:** Holding Club Jack in tricks 10-11
- **Message:** "Karlchen-Chance!" or "Karlchen für letzten Stich?"
- **Helps with:** Endgame bonus awareness

## 🎨 UI/UX Details

- **Info hints:** Blue border/icon (💡)
- **Warning hints:** Orange border/icon (⚠️)
- **Buttons:**
  - "Verstanden" (primary) - Dismisses hint
  - "Mehr erfahren" (optional) - Future: links to tutorial
- **Settings:** Toggle in Settings screen + optional quick toggle in-game
- **All text:** German (as per requirements)

## 🚀 Performance Notes

- Hint checks run on every card selection
- Triggers designed for early returns (fast)
- No expensive calculations
- Store updates are lightweight (Set operations)
- Modal animations use Reanimated (smooth)

## 📝 Known Limitations

1. **Schmieren hint:** Rarely triggers due to conservative teammate detection (intentional - no hidden info leakage)
2. **Learn More:** Button rendered but not fully wired to tutorial navigation
3. **GameScreen integration:** Requires manual completion based on your specific game flow
4. **Tests:** Basic store tests created, full integration tests pending

## ✨ Future Enhancements

- Adjustable hint frequency in settings
- Hint history/recap after game
- More advanced hints (announcement timing, solo declarations)
- Analytics on which hints are most helpful
- Multi-language support
