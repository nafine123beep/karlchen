/**
 * GameTable Component - Main game board layout with opponents and trick area
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { OpponentHand } from './OpponentHand';
import { TrickArea } from './TrickArea';
import { Player } from '@/engine/models/Player';
import { Card as CardModel } from '@/engine/models/Card';
import { PlayerId } from '@/types/game.types';

interface TrickCard {
  card: CardModel;
  playerId: string;
}

interface GameTableProps {
  players: Player[];
  humanPlayerId: PlayerId;
  currentPlayerId: PlayerId;
  currentTrickCards: TrickCard[];
  winningCardId?: string | null;
  winnerPlayerId?: string | null;
  winnerName?: string;
  isAnimatingTrickWin?: boolean;
  onTrickAnimationComplete?: () => void;
}

// Player positions around the table (relative to human at bottom)
const POSITION_MAP: Record<number, 'left' | 'top' | 'right'> = {
  0: 'left',
  1: 'top',
  2: 'right',
};

export const GameTable: React.FC<GameTableProps> = ({
  players,
  humanPlayerId,
  currentPlayerId,
  currentTrickCards,
  winningCardId,
  winnerPlayerId,
  winnerName,
  isAnimatingTrickWin = false,
  onTrickAnimationComplete,
}) => {
  // Get opponent players (exclude human)
  const opponents = useMemo(() => {
    const humanIndex = players.findIndex(p => p.id === humanPlayerId);
    const opponentPlayers: Array<{ player: Player; position: 'left' | 'top' | 'right' }> = [];

    // Arrange opponents in clockwise order from human's perspective
    for (let i = 1; i <= 3; i++) {
      const index = (humanIndex + i) % 4;
      const player = players[index];
      if (player) {
        opponentPlayers.push({
          player,
          position: POSITION_MAP[i - 1],
        });
      }
    }

    return opponentPlayers;
  }, [players, humanPlayerId]);

  // Create player position mapping for trick area animations
  const playerPositions = useMemo(() => {
    const positions: Record<string, 'bottom' | 'top' | 'left' | 'right'> = {
      [humanPlayerId]: 'bottom',
    };

    opponents.forEach(({ player, position }) => {
      positions[player.id] = position;
    });

    return positions;
  }, [humanPlayerId, opponents]);

  return (
    <View style={styles.container}>
      {/* Top opponent */}
      <View style={styles.topOpponent}>
        {opponents.find(o => o.position === 'top') && (
          <OpponentHand
            cardCount={opponents.find(o => o.position === 'top')!.player.handSize}
            playerName={opponents.find(o => o.position === 'top')!.player.name}
            position="top"
            isCurrentTurn={opponents.find(o => o.position === 'top')!.player.id === currentPlayerId}
            tricksWon={opponents.find(o => o.position === 'top')!.player.tricksTaken}
          />
        )}
      </View>

      {/* Middle row: Left opponent - Trick Area - Right opponent */}
      <View style={styles.middleRow}>
        {/* Left opponent */}
        <View style={styles.leftOpponent}>
          {opponents.find(o => o.position === 'left') && (
            <OpponentHand
              cardCount={opponents.find(o => o.position === 'left')!.player.handSize}
              playerName={opponents.find(o => o.position === 'left')!.player.name}
              position="left"
              isCurrentTurn={opponents.find(o => o.position === 'left')!.player.id === currentPlayerId}
              tricksWon={opponents.find(o => o.position === 'left')!.player.tricksTaken}
            />
          )}
        </View>

        {/* Center trick area */}
        <View style={styles.centerArea}>
          <TrickArea
            cards={currentTrickCards}
            winningCardId={winningCardId}
            winnerPlayerId={winnerPlayerId}
            winnerName={winnerName}
            playerPositions={playerPositions}
            isAnimating={isAnimatingTrickWin}
            onTrickAnimationComplete={onTrickAnimationComplete}
          />
        </View>

        {/* Right opponent */}
        <View style={styles.rightOpponent}>
          {opponents.find(o => o.position === 'right') && (
            <OpponentHand
              cardCount={opponents.find(o => o.position === 'right')!.player.handSize}
              playerName={opponents.find(o => o.position === 'right')!.player.name}
              position="right"
              isCurrentTurn={opponents.find(o => o.position === 'right')!.player.id === currentPlayerId}
              tricksWon={opponents.find(o => o.position === 'right')!.player.tricksTaken}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topOpponent: {
    alignItems: 'center',
    paddingTop: 8,
  },
  middleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  leftOpponent: {
    width: 100,
    alignItems: 'center',
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightOpponent: {
    width: 100,
    alignItems: 'center',
  },
});

export default GameTable;
