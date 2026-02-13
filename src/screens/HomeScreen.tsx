/**
 * Home Screen - Ornate game-themed main menu
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { useLearningStore } from '@/store/learningStore';
import { FeltBackground } from '@/components/home/textures/FeltTexture';
import { OrnateButton } from '@/components/home/OrnateButton';
import { OrnateHeader } from '@/components/home/OrnateHeader';
import { HOME_LAYOUT } from '@/theme/homeTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const tutorialProgress = useLearningStore(state => state.getTutorialProgress());
  const stats = useLearningStore(state => state.stats);

  return (
    <FeltBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Ornate Header */}
          <OrnateHeader
            title="🃏 Karlchen"
            subtitle="Lerne Doppelkopf spielen"
          />

          {/* Top Row: 3 Buttons */}
          <View style={styles.topRow}>
            <OrnateButton
              title="Spiel-Anleitung"
              onPress={() => navigation.navigate('GameRules')}
            />
            <View style={styles.buttonGap} />
            <OrnateButton
              title="Tutorial"
              subtitle={`${tutorialProgress}%`}
              onPress={() => navigation.navigate('BasicTutorial')}
            />
            <View style={styles.buttonGap} />
            <OrnateButton
              title="Quiz"
              onPress={() => navigation.navigate('QuizIntro')}
            />
          </View>

          {/* Center Featured Button */}
          <View style={styles.featuredContainer}>
            <OrnateButton
              title="🎮 Freies Spiel"
              subtitle="Übe gegen KI-Gegner"
              variant="featured"
              onPress={() => navigation.navigate('Game', { mode: 'practice' })}
            />
          </View>

          {/* Bottom Row: 2 Buttons */}
          <View style={styles.bottomRow}>
            <OrnateButton
              title="⚙️ Einstellungen"
              subtitle="Lernhilfen"
              onPress={() => navigation.navigate('Settings')}
            />
            <View style={styles.buttonGap} />
            <OrnateButton
              title="📊 Statistiken"
              subtitle={`${stats.gamesPlayed} Spiele`}
              onPress={() => navigation.navigate('Stats')}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Version 0.1.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </FeltBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: HOME_LAYOUT.padding.screen,
  },
  topRow: {
    flexDirection: 'row',
    marginTop: 24,
  },
  featuredContainer: {
    alignItems: 'center',
    width: '100%',
  },
  bottomRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  buttonGap: {
    width: HOME_LAYOUT.button.horizontal.gap,
  },
  footer: {
    marginTop: 32,
    marginBottom: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default HomeScreen;
