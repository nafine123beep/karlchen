/**
 * GameOverModal Component - Enhanced winner screen with special achievements
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { Team, SpecialPoints, PlayerId } from '@/types/game.types';

interface GameOverModalProps {
  visible: boolean;
  reScore: number;
  kontraScore: number;
  specialPoints: SpecialPoints;
  playerTeam: Team;
  playerNames: Record<PlayerId, string>;
  onNewGame: () => void;
  onExit: () => void;
}

// Team colors
const TEAM_COLORS = {
  [Team.RE]: '#f59e0b',      // Amber/gold
  [Team.CONTRA]: '#3b82f6',  // Blue
  [Team.UNKNOWN]: '#6b7280', // Gray
};

export const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  reScore,
  kontraScore,
  specialPoints,
  playerTeam,
  playerNames,
  onNewGame,
  onExit,
}) => {
  const winner = specialPoints.winner || (reScore > kontraScore ? Team.RE : Team.CONTRA);
  const isReWinner = winner === Team.RE;
  const winnerColor = TEAM_COLORS[winner];
  const playerWon = playerTeam === winner;

  // Calculate game value
  const gameValue = calculateGameValue(specialPoints);

  // Build special achievements list
  const achievements = buildAchievementsList(specialPoints, playerNames);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          entering={SlideInUp.springify()}
          style={styles.container}
        >
          {/* Winner Banner */}
          <View style={[styles.winnerBanner, { backgroundColor: winnerColor }]}>
            <Text style={styles.trophyIcon}>🏆</Text>
            <Text style={styles.winnerTitle}>
              {isReWinner ? 'RE GEWINNT!' : 'KONTRA GEWINNT!'}
            </Text>
          </View>

          {/* Score Display */}
          <View style={styles.scoreSection}>
            <View style={[styles.teamScore, isReWinner && styles.winningTeamScore]}>
              <Text style={[styles.teamLabel, { color: TEAM_COLORS[Team.RE] }]}>Re</Text>
              <Text style={[styles.scoreValue, isReWinner && styles.winningScore]}>
                {reScore}
              </Text>
            </View>
            <Text style={styles.scoreDivider}>–</Text>
            <View style={[styles.teamScore, !isReWinner && styles.winningTeamScore]}>
              <Text style={[styles.teamLabel, { color: TEAM_COLORS[Team.CONTRA] }]}>Kontra</Text>
              <Text style={[styles.scoreValue, !isReWinner && styles.winningScore]}>
                {kontraScore}
              </Text>
            </View>
          </View>

          {/* Special Achievements */}
          {achievements.length > 0 && (
            <View style={styles.achievementsSection}>
              <Text style={styles.sectionTitle}>Sonderpunkte</Text>
              <ScrollView style={styles.achievementsList}>
                {achievements.map((achievement, index) => (
                  <View key={index} style={styles.achievementRow}>
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    <Text style={styles.achievementText}>{achievement.text}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Game Value */}
          <View style={styles.gameValueSection}>
            <Text style={styles.gameValueLabel}>Spielwert:</Text>
            <Text style={styles.gameValueNumber}>{gameValue} {gameValue === 1 ? 'Punkt' : 'Punkte'}</Text>
          </View>

          {/* Player Result */}
          <View style={[styles.playerResult, playerWon ? styles.playerWon : styles.playerLost]}>
            <Text style={styles.playerResultText}>
              Du warst im Team {playerTeam === Team.RE ? 'Re' : 'Kontra'} – {playerWon ? 'Gewonnen!' : 'Verloren'}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <Pressable style={[styles.button, styles.newGameButton]} onPress={onNewGame}>
              <Text style={styles.buttonText}>Neues Spiel</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.exitButton]} onPress={onExit}>
              <Text style={styles.buttonText}>Beenden</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

/**
 * Calculate total game value from special points
 */
function calculateGameValue(specialPoints: SpecialPoints): number {
  let value = 1; // Base game value

  if (specialPoints.against90) value += 1;
  if (specialPoints.against60) value += 1;
  if (specialPoints.against30) value += 1;
  if (specialPoints.schwarz) value += 1;
  if (specialPoints.foxesCaught && specialPoints.foxesCaught.length > 0) {
    value += specialPoints.foxesCaught.length;
  }
  if (specialPoints.karlchen) value += 1;
  if (specialPoints.doppelkopfTricks && specialPoints.doppelkopfTricks.length > 0) {
    value += specialPoints.doppelkopfTricks.length;
  }

  return value;
}

interface Achievement {
  icon: string;
  text: string;
}

/**
 * Build list of achievements to display
 */
function buildAchievementsList(
  specialPoints: SpecialPoints,
  playerNames: Record<PlayerId, string>
): Achievement[] {
  const achievements: Achievement[] = [];

  // Against 90/60/30
  if (specialPoints.against90) {
    const team = specialPoints.against90 === Team.RE ? 'Re' : 'Kontra';
    achievements.push({ icon: '🎯', text: `Keine 90 (${team})` });
  }
  if (specialPoints.against60) {
    const team = specialPoints.against60 === Team.RE ? 'Re' : 'Kontra';
    achievements.push({ icon: '🎯', text: `Keine 60 (${team})` });
  }
  if (specialPoints.against30) {
    const team = specialPoints.against30 === Team.RE ? 'Re' : 'Kontra';
    achievements.push({ icon: '🎯', text: `Keine 30 (${team})` });
  }

  // Schwarz
  if (specialPoints.schwarz) {
    const team = specialPoints.schwarz === Team.RE ? 'Re' : 'Kontra';
    achievements.push({ icon: '⬛', text: `Schwarz (${team})` });
  }

  // Fox catches
  if (specialPoints.foxesCaught) {
    specialPoints.foxesCaught.forEach(fox => {
      const team = fox.caughtByTeam === Team.RE ? 'Re' : 'Kontra';
      achievements.push({ icon: '🦊', text: `Fuchs gefangen (${team})` });
    });
  }

  // Karlchen
  if (specialPoints.karlchen) {
    const playerName = playerNames[specialPoints.karlchen.playerId] || 'Spieler';
    achievements.push({ icon: '👦', text: `Karlchen (${playerName})` });
  }

  // Doppelkopf tricks
  if (specialPoints.doppelkopfTricks) {
    specialPoints.doppelkopfTricks.forEach(dk => {
      const playerName = playerNames[dk.playerId] || 'Spieler';
      achievements.push({ icon: '💎', text: `Doppelkopf ${dk.points}P (${playerName})` });
    });
  }

  return achievements;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#1f2937',
    borderRadius: 20,
    width: '100%',
    maxWidth: 360,
    overflow: 'hidden',
  },
  winnerBanner: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  trophyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  winnerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  teamScore: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  winningTeamScore: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  teamLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  winningScore: {
    fontSize: 42,
  },
  scoreDivider: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 8,
  },
  achievementsSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 12,
    textAlign: 'center',
  },
  achievementsList: {
    maxHeight: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  achievementText: {
    fontSize: 14,
    color: '#ffffff',
  },
  gameValueSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
  },
  gameValueLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginRight: 8,
  },
  gameValueNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  playerResult: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  playerWon: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  playerLost: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  playerResultText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  newGameButton: {
    backgroundColor: '#22c55e',
  },
  exitButton: {
    backgroundColor: '#6b7280',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GameOverModal;
