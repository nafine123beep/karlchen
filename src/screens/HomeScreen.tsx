/**
 * Home Screen - Main menu and entry point
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { useLearningStore } from '@/store/learningStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const tutorialProgress = useLearningStore(state => state.getTutorialProgress());
  const stats = useLearningStore(state => state.stats);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🃏 Karlchen</Text>
        <Text style={styles.subtitle}>Lerne Doppelkopf spielen</Text>
      </View>

      <View style={styles.menu}>
        {/* TODO: Implement menu buttons */}
        <Pressable
          style={styles.menuButton}
          onPress={() => navigation.navigate('BasicTutorial')}
        >
          <Text style={styles.buttonText}>📚 Tutorial starten</Text>
          <Text style={styles.buttonSubtext}>
            {tutorialProgress}% abgeschlossen
          </Text>
        </Pressable>

        <Pressable
          style={styles.menuButton}
          onPress={() => navigation.navigate('Game', { mode: 'practice' })}
        >
          <Text style={styles.buttonText}>🎮 Freies Spiel</Text>
          <Text style={styles.buttonSubtext}>
            Übe gegen KI-Gegner
          </Text>
        </Pressable>

        <Pressable
          style={styles.menuButton}
          onPress={() => navigation.navigate('Stats')}
        >
          <Text style={styles.buttonText}>📊 Statistiken</Text>
          <Text style={styles.buttonSubtext}>
            {stats.gamesPlayed} Spiele gespielt
          </Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 0.1.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#2563eb',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    opacity: 0.9,
  },
  menu: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  menuButton: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default HomeScreen;
