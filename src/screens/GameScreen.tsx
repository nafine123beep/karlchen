/**
 * Game Screen - Main game interface
 */

import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { useGameStore } from '@/store/gameStore';
import { ScoreBoard } from '@/components/game/ScoreBoard';
import { GameTable } from '@/components/game/GameTable';
import { PlayerHand } from '@/components/game/PlayerHand';
import { IllegalMoveModal } from '@/components/game/IllegalMoveModal';
import { GameOverModal } from '@/components/game/GameOverModal';
import { validateMove } from '@/engine/logic/legalMoves';
import { Team, GamePhase, PlayerId } from '@/types/game.types';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

const GameScreen: React.FC<Props> = ({ navigation, route }) => {
  const { mode } = route.params;

  // Game store state
  const startNewGame = useGameStore(state => state.startNewGame);
  const gameState = useGameStore(state => state.gameState);
  const playCard = useGameStore(state => state.playCard);
  const isPlayerTurn = useGameStore(state => state.isPlayerTurn());
  const legalMoves = useGameStore(state => state.getLegalMoves());
  const isProcessing = useGameStore(state => state.isProcessing);
  const storeError = useGameStore(state => state.error);
  const resetGame = useGameStore(state => state.resetGame);
  const stateVersion = useGameStore(state => state.stateVersion);
  // Animation state
  const isAnimatingTrickWin = useGameStore(state => state.isAnimatingTrickWin);
  const trickWinInfo = useGameStore(state => state.trickWinInfo);
  const lastCompletedTrickCards = useGameStore(state => state.lastCompletedTrickCards);
  const onTrickAnimationComplete = useGameStore(state => state.onTrickAnimationComplete);

  // Local state
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [openCards, setOpenCards] = useState(false);
  const [illegalMoveError, setIllegalMoveError] = useState<{
    reason: string;
    explanation?: string;
  } | null>(null);

  // Start game on mount
  useEffect(() => {
    try {
      startNewGame();
    } catch (err) {
      setInitError(err instanceof Error ? err.message : 'Failed to start game');
    }
    return () => {
      resetGame();
    };
  }, []);

  // Check for game over
  useEffect(() => {
    if (gameState?.phase === GamePhase.FINISHED) {
      setShowGameOver(true);
    }
  }, [gameState?.phase]);

  // Get human player
  const humanPlayer = useMemo(() => {
    return gameState?.players.find(p => p.isHuman);
  }, [gameState?.players]);

  // Get current trick cards for display
  // stateVersion as dependency ensures recomputation when cards are added
  // (gameState/currentTrick are mutable objects with stable references)
  const currentTrickCards = useMemo(() => {
    if (!gameState?.currentTrick) return [];
    return gameState.currentTrick.cards.map(tc => ({
      card: tc.card,
      playerId: tc.playerId,
    }));
  }, [stateVersion]);

  // Build player names map for GameOverModal
  const playerNames = useMemo((): Record<PlayerId, string> => {
    if (!gameState?.players) return {};
    const names: Record<PlayerId, string> = {};
    gameState.players.forEach(p => {
      names[p.id] = p.name;
    });
    return names;
  }, [gameState?.players]);

  // Handle card selection and play
  const handleCardPress = async (cardId: string) => {
    if (!isPlayerTurn || isProcessing || isAnimatingTrickWin || !gameState) return;

    // Find the card in the player's hand
    const card = humanPlayer?.hand.find(c => c.id === cardId);
    if (!card || !humanPlayer) return;

    // Check if the card is a legal move
    const validation = validateMove(card, humanPlayer, gameState.currentTrick);

    if (!validation.valid) {
      // Show error modal explaining why move is illegal
      setIllegalMoveError({
        reason: validation.reason || 'Ungültiger Zug',
        explanation: validation.explanation,
      });
      return;
    }

    // Card is legal - play it directly (single click)
    setSelectedCardId(null);
    await playCard(cardId);
  };

  const error = initError || storeError;

  // Loading state or error
  if (!gameState || !humanPlayer) {
    return (
      <View style={styles.container}>
        {error ? (
          <View style={styles.errorFullScreen}>
            <Text style={styles.errorTitle}>Fehler beim Laden</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>Zurück</Text>
            </Pressable>
          </View>
        ) : (
          <Text style={styles.loadingText}>Spiel wird geladen...</Text>
        )}
      </View>
    );
  }

  const trickNumber = (gameState.completedTricks?.length ?? 0) + 1;

  return (
    <View style={styles.container}>
      {/* Score Board */}
      <ScoreBoard
        reScore={gameState.scores.re}
        kontraScore={gameState.scores.kontra}
        trickNumber={trickNumber}
        phase={gameState.phase}
        isPlayerTurn={isPlayerTurn}
        playerTeam={humanPlayer.team}
        announcements={{
          re: gameState.players.some(p => p.team === Team.RE && p.hasAnnounced),
          kontra: gameState.players.some(p => p.team === Team.CONTRA && p.hasAnnounced),
        }}
      />

      {/* Game Table */}
      <View style={styles.tableArea}>
        <GameTable
          players={gameState.players}
          humanPlayerId={humanPlayer.id}
          currentPlayerId={gameState.players[gameState.currentPlayerIndex]?.id ?? ''}
          currentTrickCards={isAnimatingTrickWin && lastCompletedTrickCards ? lastCompletedTrickCards : currentTrickCards}
          winningCardId={trickWinInfo?.winningCardId ?? null}
          winnerPlayerId={trickWinInfo?.winnerPlayerId ?? null}
          winnerName={trickWinInfo?.winnerName}
          isAnimatingTrickWin={isAnimatingTrickWin}
          onTrickAnimationComplete={onTrickAnimationComplete}
          openCards={openCards}
        />
      </View>

      {/* Error display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* AI Thinking Indicator */}
      {isProcessing && !isPlayerTurn && (
        <View style={styles.thinkingIndicator}>
          <Text style={styles.thinkingText}>KI denkt nach...</Text>
        </View>
      )}

      {/* Player's Hand */}
      <PlayerHand
        cards={humanPlayer.hand}
        legalMoves={legalMoves}
        onCardPress={handleCardPress}
        selectedCardId={selectedCardId}
        disabled={!isPlayerTurn || isProcessing || isAnimatingTrickWin}
      />

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.smallButton, openCards && styles.smallButtonActive]}
          onPress={() => setOpenCards(prev => !prev)}
        >
          <Text style={styles.smallButtonText}>Mit offenen Karten spielen</Text>
        </Pressable>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Beenden</Text>
        </Pressable>
      </View>

      {/* Game Over Modal */}
      <GameOverModal
        visible={showGameOver}
        reScore={gameState.scores.re}
        kontraScore={gameState.scores.kontra}
        specialPoints={gameState.specialPoints}
        playerTeam={humanPlayer.team}
        playerNames={playerNames}
        onNewGame={() => { setShowGameOver(false); startNewGame(); }}
        onExit={() => { setShowGameOver(false); navigation.goBack(); }}
      />

      {/* Illegal Move Modal */}
      <IllegalMoveModal
        visible={!!illegalMoveError}
        reason={illegalMoveError?.reason || ''}
        explanation={illegalMoveError?.explanation}
        onDismiss={() => setIllegalMoveError(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#059669',
    padding: 16,
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 100,
  },
  errorFullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
  },
  tableArea: {
    flex: 1,
    marginVertical: 8,
  },
  errorContainer: {
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
  },
  thinkingIndicator: {
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  thinkingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  smallButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  smallButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.6)',
  },
  smallButtonText: {
    color: '#ffffff',
    fontSize: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default GameScreen;
