/**
 * Stats Screen - Display learning progress and statistics
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { useLearningStore } from '@/store/learningStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Stats'>;

const StatsScreen: React.FC<Props> = () => {
  const stats = useLearningStore(state => state.stats);
  const tutorialProgress = useLearningStore(state => state.getTutorialProgress());

  const winRate = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Deine Statistiken</Text>

        {/* Tutorial Progress */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📚 Tutorial-Fortschritt</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${tutorialProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>{tutorialProgress}% abgeschlossen</Text>
        </View>

        {/* Game Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎮 Spielstatistiken</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Gespielte Spiele:</Text>
            <Text style={styles.statValue}>{stats.gamesPlayed}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Gewonnen:</Text>
            <Text style={[styles.statValue, styles.winText]}>{stats.gamesWon}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Verloren:</Text>
            <Text style={[styles.statValue, styles.loseText]}>{stats.gamesLost}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Gewinnrate:</Text>
            <Text style={styles.statValue}>{winRate}%</Text>
          </View>
        </View>

        {/* Score Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Punktestatistiken</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Durchschnitt:</Text>
            <Text style={styles.statValue}>{Math.round(stats.averageScore)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Bester Score:</Text>
            <Text style={styles.statValue}>{stats.bestScore}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Stiche genommen:</Text>
            <Text style={styles.statValue}>{stats.totalTricksTaken}</Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏆 Erfolge</Text>
          <Text style={styles.placeholder}>
            {stats.achievements.length} Erfolge freigeschaltet
          </Text>
          {/* TODO: Display achievement list */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statLabel: {
    fontSize: 16,
    color: '#4b5563',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  winText: {
    color: '#059669',
  },
  loseText: {
    color: '#dc2626',
  },
  placeholder: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});

export default StatsScreen;
