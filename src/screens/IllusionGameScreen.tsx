/**
 * IllusionGameScreen - Beginner demo game with open cards and teaching hints
 *
 * Uses predefined card distributions, scripted AI moves, and contextual hints.
 * Can only be played once (persistent flag in learningStore).
 */

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { IllusionGameEngine } from '@/engine/illusionGame/IllusionGameEngine';
import { ScoreBoard } from '@/components/game/ScoreBoard';
import { GameTable } from '@/components/game/GameTable';
import { PlayerHand } from '@/components/game/PlayerHand';
import { IllegalMoveModal } from '@/components/game/IllegalMoveModal';
import { HintModal } from '@/components/game/HintModal';
import { LernmodusLabel } from '@/components/game/LernmodusLabel';
import { IllusionGameOverModal } from '@/components/game/IllusionGameOverModal';
import { validateMove } from '@/engine/logic/legalMoves';
import { checkFollowSuitOrTrump } from '@/engine/hints/triggers/followSuitOrTrump';
import { getIllusionHint } from '@/data/illusionGame/illusionHints';
import { useLearningStore } from '@/store/learningStore';
import { Team, GamePhase } from '@/types/game.types';
import { Hint } from '@/types/hint.types';
import { Card } from '@/engine/models/Card';

type Props = NativeStackScreenProps<RootStackParamList, 'IllusionGame'>;

const AI_MOVE_DELAY = 600;
const TRICK_WIN_DISPLAY_TIME = 1500;

const IllusionGameScreen: React.FC<Props> = ({ navigation }) => {
  const engineRef = useRef<IllusionGameEngine | null>(null);
  const [stateVersion, setStateVersion] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [currentHint, setCurrentHint] = useState<Hint | null>(null);
  const [illegalMoveError, setIllegalMoveError] = useState<{
    reason: string;
    explanation?: string;
  } | null>(null);

  // Trick animation state (matching GameScreen pattern)
  const [isAnimatingTrickWin, setIsAnimatingTrickWin] = useState(false);
  const [trickWinInfo, setTrickWinInfo] = useState<{
    winnerPlayerId: string;
    winnerName: string;
    winningCardId: string;
  } | null>(null);
  const [lastCompletedTrickCards, setLastCompletedTrickCards] = useState<
    Array<{ card: Card; playerId: string }> | null
  >(null);

  const setIllusionGamePlayed = useLearningStore(s => s.setIllusionGamePlayed);

  // Initialize engine on mount
  useEffect(() => {
    const engine = new IllusionGameEngine();
    engineRef.current = engine;
    setStateVersion(1);

    // Show first trick hint after a brief delay
    setTimeout(() => {
      const hint = getIllusionHint(0, 'before_play');
      if (hint) setCurrentHint(hint);
    }, 500);
  }, []);

  const engine = engineRef.current;
  const gameState = engine?.getGameState();
  const humanPlayer = gameState?.players[0];

  // Derived state
  const isPlayerTurn = engine?.isHumanTurn() ?? false;
  const legalMoves = engine?.getLegalMovesForHuman() ?? [];

  const currentTrickCards = useMemo(() => {
    if (!gameState?.currentTrick) return [];
    return gameState.currentTrick.cards.map(tc => ({
      card: tc.card,
      playerId: tc.playerId,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateVersion]);

  /**
   * Process AI turns sequentially with delays.
   */
  const processAITurns = useCallback(async () => {
    if (!engine) return;
    setIsProcessing(true);

    while (!engine.isHumanTurn() && !engine.isFinished()) {
      const currentPlayer = engine.getCurrentPlayer();
      const trickCardsBefore = engine.getGameState().currentTrick?.cards || [];

      await new Promise(resolve => setTimeout(resolve, AI_MOVE_DELAY));

      const result = engine.playAICard();
      if (!result.success) break;

      const stateAfter = engine.getGameState();

      // Check if trick completed
      const trickJustCompleted =
        trickCardsBefore.length === 3 && stateAfter.currentTrick?.size === 0;

      if (trickJustCompleted && stateAfter.completedTricks.length > 0) {
        const completedTrick =
          stateAfter.completedTricks[stateAfter.completedTricks.length - 1];
        const winnerId = completedTrick.winnerId;
        const winnerPlayer = stateAfter.players.find(p => p.id === winnerId);
        const winningCard = winnerId ? completedTrick.getCardByPlayer(winnerId) : null;

        // Build animation cards
        const playedCardRef = currentPlayer.hand.find(c => c.id === result.cardId)
          ?? stateAfter.completedTricks[stateAfter.completedTricks.length - 1]
              .getCards()
              .find(c => c.id === result.cardId);

        const trickCardsForAnimation = [
          ...trickCardsBefore,
          ...(playedCardRef
            ? [{ card: playedCardRef, playerId: currentPlayer.id }]
            : []),
        ];

        setTrickWinInfo(
          winnerId
            ? {
                winnerPlayerId: winnerId,
                winnerName: winnerPlayer?.name || 'Spieler',
                winningCardId: winningCard?.id || '',
              }
            : null
        );
        setLastCompletedTrickCards(trickCardsForAnimation);
        setIsAnimatingTrickWin(true);
        setStateVersion(v => v + 1);
        setIsProcessing(false);

        // Wait for animation, then continue
        await new Promise(resolve => setTimeout(resolve, TRICK_WIN_DISPLAY_TIME));

        setIsAnimatingTrickWin(false);
        setTrickWinInfo(null);
        setLastCompletedTrickCards(null);
        setStateVersion(v => v + 1);

        // Show after-trick hint
        const trickNum = stateAfter.completedTricks.length - 1;
        const afterHint = getIllusionHint(trickNum, 'after_trick');
        if (afterHint) {
          setCurrentHint(afterHint);
          // Wait for user to dismiss hint before continuing
          return;
        }

        // Check game over
        if (engine.isFinished()) {
          handleGameFinish();
          return;
        }

        // Show before-play hint for next trick
        const nextTrickNum = engine.getTrickNumber();
        if (engine.isHumanTurn()) {
          const beforeHint = getIllusionHint(nextTrickNum, 'before_play');
          if (beforeHint) {
            setCurrentHint(beforeHint);
            return;
          }
        }

        // Continue processing if still AI turn
        if (!engine.isHumanTurn() && !engine.isFinished()) {
          setIsProcessing(true);
          continue;
        }

        return;
      }

      // Normal card play (no trick completion)
      setStateVersion(v => v + 1);
    }

    setIsProcessing(false);

    // After AI done, show hint for human's turn
    if (engine.isHumanTurn() && !engine.isFinished()) {
      const trickNum = engine.getTrickNumber();
      const hint = getIllusionHint(trickNum, 'before_play');
      if (hint && !currentHint) {
        setCurrentHint(hint);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine]);

  /**
   * Handle human card press.
   */
  const handleCardPress = async (cardId: string) => {
    if (!isPlayerTurn || isProcessing || isAnimatingTrickWin || !gameState || !humanPlayer || !engine)
      return;

    const card = humanPlayer.hand.find(c => c.id === cardId);
    if (!card) return;

    // Validate the move
    const validation = validateMove(card, humanPlayer, gameState.currentTrick);

    if (!validation.valid) {
      // Show educational hint for illegal move
      const hint = checkFollowSuitOrTrump({
        selectedCard: card,
        playerHand: humanPlayer.hand,
        currentTrick: gameState.currentTrick,
        legalMoves: legalMoves,
        completedTricks: gameState.completedTricks,
        trickIndex: gameState.completedTricks.length,
        playerTeam: humanPlayer.team,
        announcements: { re: false, kontra: false },
      });

      if (hint) {
        setCurrentHint(hint);
        return;
      }

      setIllegalMoveError({
        reason: validation.reason || 'Ungültiger Zug',
        explanation: validation.explanation,
      });
      return;
    }

    // Save trick state before playing
    const trickCardsBefore = gameState.currentTrick?.cards || [];
    const playedCardRef = card;

    // Play the card
    const result = engine.playHumanCard(cardId);
    if (!result.success) {
      setIllegalMoveError({
        reason: result.error || 'Ungültiger Zug',
      });
      return;
    }

    setSelectedCardId(null);

    // Check if trick was completed by human's card
    const stateAfter = engine.getGameState();
    const trickJustCompleted =
      trickCardsBefore.length === 3 && stateAfter.currentTrick?.size === 0;

    if (trickJustCompleted && stateAfter.completedTricks.length > 0) {
      const completedTrick =
        stateAfter.completedTricks[stateAfter.completedTricks.length - 1];
      const winnerId = completedTrick.winnerId;
      const winnerPlayer = stateAfter.players.find(p => p.id === winnerId);
      const winningCard = winnerId ? completedTrick.getCardByPlayer(winnerId) : null;

      const trickCardsForAnimation = [
        ...trickCardsBefore,
        { card: playedCardRef, playerId: humanPlayer.id },
      ];

      setTrickWinInfo(
        winnerId
          ? {
              winnerPlayerId: winnerId,
              winnerName: winnerPlayer?.name || 'Spieler',
              winningCardId: winningCard?.id || '',
            }
          : null
      );
      setLastCompletedTrickCards(trickCardsForAnimation);
      setIsAnimatingTrickWin(true);
      setStateVersion(v => v + 1);

      // Wait for animation
      setTimeout(async () => {
        setIsAnimatingTrickWin(false);
        setTrickWinInfo(null);
        setLastCompletedTrickCards(null);
        setStateVersion(v => v + 1);

        // Show after-trick hint
        const trickNum = stateAfter.completedTricks.length - 1;
        const afterHint = getIllusionHint(trickNum, 'after_trick');
        if (afterHint) {
          setCurrentHint(afterHint);
          return;
        }

        if (engine.isFinished()) {
          handleGameFinish();
          return;
        }

        // Process AI turns if needed
        if (!engine.isHumanTurn()) {
          await processAITurns();
        } else {
          // Show before-play hint for next trick
          const nextTrickNum = engine.getTrickNumber();
          const hint = getIllusionHint(nextTrickNum, 'before_play');
          if (hint) setCurrentHint(hint);
        }
      }, TRICK_WIN_DISPLAY_TIME);

      return;
    }

    // Normal play - update and process AI turns
    setStateVersion(v => v + 1);

    if (!engine.isHumanTurn() && !engine.isFinished()) {
      await processAITurns();
    }
  };

  /**
   * Handle game completion.
   */
  const handleGameFinish = () => {
    setIllusionGamePlayed();
    setShowGameOver(true);
  };

  /**
   * Handle hint dismissal - continue game flow after hint.
   */
  const handleHintDismiss = async () => {
    const cardToPlay = selectedCardId;
    setCurrentHint(null);
    setSelectedCardId(null);

    if (cardToPlay && engine) {
      const result = engine.playHumanCard(cardToPlay);
      if (result.success) {
        setStateVersion(v => v + 1);
        if (!engine.isHumanTurn() && !engine.isFinished()) {
          await processAITurns();
        }
      }
    } else if (engine && !engine.isHumanTurn() && !engine.isFinished()) {
      // Continue AI turns after after-trick hint
      await processAITurns();
    }
  };

  // Loading state
  if (!gameState || !humanPlayer) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Lernspiel wird geladen...</Text>
      </View>
    );
  }

  const trickNumber = (gameState.completedTricks?.length ?? 0) + 1;

  return (
    <View style={styles.container}>
      {/* Lernmodus Label */}
      <LernmodusLabel />

      {/* Score Board */}
      <ScoreBoard
        reScore={gameState.scores.re}
        kontraScore={gameState.scores.kontra}
        trickNumber={trickNumber}
        phase={gameState.phase}
        isPlayerTurn={isPlayerTurn}
        playerTeam={humanPlayer.team}
        announcements={{ re: false, kontra: false }}
      />

      {/* Game Table (always open cards) */}
      <View style={styles.tableArea}>
        <GameTable
          players={gameState.players}
          humanPlayerId={humanPlayer.id}
          currentPlayerId={gameState.players[gameState.currentPlayerIndex]?.id ?? ''}
          currentTrickCards={
            isAnimatingTrickWin && lastCompletedTrickCards
              ? lastCompletedTrickCards
              : currentTrickCards
          }
          winningCardId={trickWinInfo?.winningCardId ?? null}
          winnerPlayerId={trickWinInfo?.winnerPlayerId ?? null}
          winnerName={trickWinInfo?.winnerName}
          isAnimatingTrickWin={isAnimatingTrickWin}
          onTrickAnimationComplete={() => {
            // Animation handled by setTimeout in processAITurns/handleCardPress
          }}
          openCards={true}
        />
      </View>

      {/* AI Thinking Indicator */}
      {isProcessing && !isPlayerTurn && (
        <View style={styles.thinkingIndicator}>
          <Text style={styles.thinkingText}>Gegner spielt...</Text>
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

      {/* Button Row */}
      <View style={styles.buttonRow}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Beenden</Text>
        </Pressable>
      </View>

      {/* Game Over Modal */}
      <IllusionGameOverModal
        visible={showGameOver}
        onStartRealGame={() => navigation.replace('Game', { mode: 'practice' })}
        onGoHome={() => navigation.replace('Home')}
      />

      {/* Illegal Move Modal */}
      <IllegalMoveModal
        visible={!!illegalMoveError}
        reason={illegalMoveError?.reason || ''}
        explanation={illegalMoveError?.explanation}
        onDismiss={() => setIllegalMoveError(null)}
      />

      {/* Hint Modal */}
      <HintModal
        visible={currentHint !== null}
        hint={currentHint}
        onDismiss={handleHintDismiss}
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
  tableArea: {
    flex: 1,
    marginVertical: 8,
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

export default IllusionGameScreen;
