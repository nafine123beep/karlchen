import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/cards/Card';
import { Suit, Rank } from '@/types/card.types';

interface PlayersVisualProps {
  data?: { highlightQueens?: boolean };
}

const TEAM_COLORS = {
  re: '#2563eb',
  kontra: '#dc2626',
};

const PLAYERS = [
  { name: 'Anna', team: 'kontra' as const },
  { name: 'Ben', team: 're' as const },
  { name: 'Clara', team: 'kontra' as const },
  { name: 'Du', team: 're' as const },
] as const;

export const PlayersVisual: React.FC<PlayersVisualProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      {/* Top player */}
      <View style={styles.topRow}>
        <PlayerSeat name={PLAYERS[0].name} team={PLAYERS[0].team} showQueen={data?.highlightQueens} />
      </View>

      {/* Middle row: left + table + right */}
      <View style={styles.middleRow}>
        <PlayerSeat name={PLAYERS[1].name} team={PLAYERS[1].team} showQueen={data?.highlightQueens} />
        <View style={styles.table}>
          <Text style={styles.tableText}>Tisch</Text>
        </View>
        <PlayerSeat name={PLAYERS[2].name} team={PLAYERS[2].team} showQueen={data?.highlightQueens} />
      </View>

      {/* Bottom player */}
      <View style={styles.bottomRow}>
        <PlayerSeat name={PLAYERS[3].name} team={PLAYERS[3].team} showQueen={data?.highlightQueens} />
      </View>
    </View>
  );
};

const PlayerSeat: React.FC<{
  name: string;
  team: 're' | 'kontra';
  showQueen?: boolean;
}> = ({ name, team, showQueen }) => {
  const color = TEAM_COLORS[team];

  return (
    <View style={styles.seatWrapper}>
      <View style={[styles.seat, { borderLeftColor: color }]}>
        <Text style={styles.seatName}>{name}</Text>
        <Text style={[styles.seatTeam, { color }]}>
          {team === 're' ? 'Re' : 'Kontra'}
        </Text>
      </View>
      {showQueen && team === 're' && (
        <View style={styles.queenCard}>
          <View style={{ transform: [{ scale: 0.45 }] }}>
            <Card suit={Suit.CLUBS} rank={Rank.QUEEN} isTrump size="small" />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 260,
    height: 200,
    alignSelf: 'center',
    marginBottom: 24,
  },
  topRow: {
    alignItems: 'center',
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  bottomRow: {
    alignItems: 'center',
  },
  table: {
    width: 70,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  tableText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
  },
  seatWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seat: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderLeftWidth: 3,
  },
  seatName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  seatTeam: {
    fontSize: 10,
    fontWeight: '600',
  },
  queenCard: {
    width: 22,
    height: 32,
    overflow: 'hidden',
  },
});
