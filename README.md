# 🃏 Karlchen - Doppelkopf Lern-App

Eine iOS-App zum Lernen und Spielen von Doppelkopf mit interaktiven Tutorials und KI-Gegnern.

## 📋 Features (geplant)

- ✅ **Interaktives Tutorial**: Schritt-für-Schritt Einführung in Doppelkopf-Regeln
- 🤖 **KI-Gegner**: Spiele gegen Medium-Level AI
- 📊 **Fortschritt-Tracking**: Verfolge deinen Lernfortschritt und Stats
- 💡 **Kontextuelle Tipps**: Lerne während des Spiels mit Echtzeit-Erklärungen
- 🎯 **Offline-First**: Komplett offline spielbar

## 🏗️ Projekt-Struktur

```
karlchen/
├── src/
│   ├── engine/           # Game Logic (platform-agnostic)
│   │   ├── models/       # Card, Deck, Player, GameState
│   │   ├── logic/        # Trump-, Trick-, Score-Logik
│   │   └── ai/           # KI-Strategien
│   ├── store/            # Zustand State Management
│   ├── components/       # React Native UI Components
│   ├── screens/          # App Screens
│   └── data/             # Hardcoded Tutorials & Erklärungen
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **Xcode** >= 14 (für iOS)
- **CocoaPods** (automatisch via RN)

### Installation

```bash
# Dependencies installieren
npm install

# iOS Pods installieren
cd ios && pod install && cd ..
```

### Development

```bash
# Metro Bundler starten
npm start

# iOS App starten (Simulator)
npm run ios

# iOS App starten (bestimmtes Device)
npm run ios -- --simulator="iPhone 15 Pro"
```

### Testing

```bash
# Unit Tests
npm test

# Tests mit Coverage
npm run test:coverage

# Tests im Watch-Mode
npm run test:watch
```

### Code Quality

```bash
# Linting
npm run lint

# Linting mit Auto-Fix
npm run lint:fix

# Code Formatierung
npm run format

# TypeScript Type-Check
npm run type-check
```

## 🧩 Tech Stack

- **React Native** 0.73 mit TypeScript
- **React Navigation** für Screen-Navigation
- **Zustand** für State Management
- **AsyncStorage** für lokale Datenpersistenz
- **Jest** + **Testing Library** für Tests
- **ESLint** + **Prettier** für Code Quality

## 📦 Module-Auflösung

Das Projekt nutzt Path Aliases für saubere Imports:

```typescript
import { Card } from '@/engine/models/Card';
import { gameStore } from '@/store/gameStore';
import { Button } from '@/components/common/Button';
```

## 🎮 Game Engine Design

Die **Game Engine** ist bewusst **UI-unabhängig**:
- Pure TypeScript Logic in `src/engine/`
- Keine React-Dependencies
- Komplett testbar ohne UI
- Könnte theoretisch in anderen Frameworks wiederverwendet werden

## 📝 Development Workflow

1. **Engine-First**: Beginne mit Game Logic (Models, Logic)
2. **Store**: Verbinde Engine mit Zustand Stores
3. **UI**: Baue Components, die auf Store reagieren
4. **Tests**: Schreibe Tests für Engine-Logik
5. **Tutorial**: Implementiere Lern-Content

## 🤝 Contributing

Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für Guidelines.

## 📄 License

Privates Projekt - Alle Rechte vorbehalten.

---

**Status**: 🚧 In Entwicklung - v0.1.0
