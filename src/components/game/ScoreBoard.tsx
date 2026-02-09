/**
 * ScoreBoard Component - Display game scores and info
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Team, GamePhase } from '@/types/game.types';
import { getTeamColor, getTeamName } from '@/utils/helpers';

// Doppelkopf game constants
const TOTAL_POINTS = 240;
const WINNING_THRESHOLD = 121;

interface ScoreBoardProps {
  reScore: number;
  kontraScore: number;
  trickNumber: number;
  phase: GamePhase;
  isPlayerTurn: boolean;
  playerTeam?: Team;
  announcements?: {
    re: boolean;
    kontra: boolean;
  };
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  reScore,
  kontraScore,
  trickNumber,
  phase,
  isPlayerTurn,
  playerTeam = Team.UNKNOWN,
  announcements = { re: false, kontra: false },
}) => {
  // Calculate progress percentages
  const totalScored = reScore + kontraScore;
  const rePercentage = totalScored > 0 ? (reScore / TOTAL_POINTS) * 100 : 0;
  const kontraPercentage = totalScored > 0 ? (kontraScore / TOTAL_POINTS) * 100 : 0;

  // Determine who is winning
  const reWinning = reScore >= WINNING_THRESHOLD;
  const kontraWinning = kontraScore >= WINNING_THRESHOLD;

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      {/* Score display */}
      <View style={styles.scoreContainer}>
        {/* Re score */}
        <View style={styles.teamScore}>
          <Text style={[styles.teamLabel, { color: getTeamColor(Team.RE) }]}>
            Re
          </Text>
          <Text style={styles.scoreValue}>{reScore}</Text>
          {announcements.re && (
            <View style={[styles.announcementBadge, { backgroundColor: getTeamColor(Team.RE) }]}>
              <Text style={styles.announcementText}>!</Text>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <Text style={styles.dividerText}>:</Text>
        </View>

        {/* Kontra score */}
        <View style={styles.teamScore}>
          <Text style={[styles.teamLabel, { color: getTeamColor(Team.CONTRA) }]}>
            Kontra
          </Text>
          <Text style={styles.scoreValue}>{kontraScore}</Text>
          {announcements.kontra && (
            <View style={[styles.announcementBadge, { backgroundColor: getTeamColor(Team.CONTRA) }]}>
              <Text style={styles.announcementText}>!</Text>
            </View>
          )}
        </View>
      </View>

      {/* Points progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {/* Re progress */}
          <View
            style={[
              styles.progressFillRe,
              { width: `${rePercentage}%` },
              reWinning && styles.progressWinning,
            ]}
          />
          {/* Kontra progress */}
          <View
            style={[
              styles.progressFillKontra,
              { width: `${kontraPercentage}%` },
              kontraWinning && styles.progressWinning,
            ]}
          />
          {/* Winning threshold marker */}
          <View style={styles.thresholdMarker} />
        </View>
        {/* Points info text */}
        <View style={styles.pointsInfo}>
          <Text style={styles.pointsInfoText}>
            {WINNING_THRESHOLD} zum Sieg • {TOTAL_POINTS} Punkte gesamt
          </Text>
        </View>
      </View>

      {/* Game info row */}
      <View style={styles.infoRow}>
        {/* Trick counter */}
        <View style={styles.infoBadge}>
          <Text style={styles.infoLabel}>Stich</Text>
          <Text style={styles.infoValue}>{trickNumber}/10</Text>
        </View>

        {/* Turn indicator */}
        <View style={[styles.turnBadge, isPlayerTurn && styles.turnBadgeActive]}>
          <Text style={[styles.turnText, isPlayerTurn && styles.turnTextActive]}>
            {isPlayerTurn ? 'Du bist dran!' : 'Warte...'}
          </Text>
        </View>

        {/* Player team */}
        {playerTeam !== Team.UNKNOWN && (
          <View style={[styles.teamBadge, { backgroundColor: getTeamColor(playerTeam) }]}>
            <Text style={styles.teamBadgeText}>{getTeamName(playerTeam)}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  teamScore: {
    alignItems: 'center',
    minWidth: 70,
    position: 'relative',
  },
  teamLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  divider: {
    paddingHorizontal: 16,
  },
  dividerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  announcementBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  announcementText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  progressFillRe: {
    height: '100%',
    backgroundColor: '#f59e0b', // Amber/gold for Re
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  progressFillKontra: {
    height: '100%',
    backgroundColor: '#3b82f6', // Blue for Kontra
    position: 'absolute',
    right: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  progressWinning: {
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  thresholdMarker: {
    position: 'absolute',
    left: '50.4%', // 121/240 ≈ 50.4%
    top: -2,
    bottom: -2,
    width: 2,
    backgroundColor: '#22c55e',
    borderRadius: 1,
  },
  pointsInfo: {
    alignItems: 'center',
    marginTop: 4,
  },
  pointsInfoText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  infoBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
  },
  infoValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  turnBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  turnBadgeActive: {
    backgroundColor: '#22c55e',
  },
  turnText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  turnTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  teamBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  teamBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default ScoreBoard;
