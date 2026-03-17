/**
 * IllusionGameOverModal - Learning feedback screen after demo game completion
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Platform } from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';

const isWeb = Platform.OS === 'web';

interface IllusionGameOverModalProps {
  visible: boolean;
  onStartRealGame: () => void;
  onGoHome: () => void;
}

const LEARNINGS = [
  { icon: '🃏', text: 'Trumpf sticht Fehl – Trumpfkarten gewinnen immer gegen Fehlfarben' },
  { icon: '🎯', text: 'Farbzwang gilt – du musst die angespielte Farbe bedienen' },
  { icon: '👑', text: 'Damen > Buben > Karo – die Trumpf-Hierarchie bestimmt, wer gewinnt' },
  { icon: '🏆', text: 'Die höchste Karte gewinnt den Stich' },
];

export const IllusionGameOverModal: React.FC<IllusionGameOverModalProps> = ({
  visible,
  onStartRealGame,
  onGoHome,
}) => {
  if (__DEV__) {
    console.log('[IllusionGameOverModal] Rendering with visible=', visible);
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          entering={isWeb ? undefined : SlideInUp.springify()}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>🎓</Text>
            <Text style={styles.headerTitle}>Gut gemacht!</Text>
            <Text style={styles.headerSubtitle}>Du hast das Übungsspiel abgeschlossen.</Text>
          </View>

          {/* Section 1: What you learned */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Was du gerade gelernt hast:</Text>
            {LEARNINGS.map((item, index) => (
              <View key={index} style={styles.learningRow}>
                <Text style={styles.learningIcon}>{item.icon}</Text>
                <Text style={styles.learningText}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* Section 2: Next step */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nächster Schritt:</Text>
            <Text style={styles.nextStepText}>
              Jetzt bist du bereit für ein echtes Spiel! Die Karten werden zufällig verteilt und die
              KI-Gegner spielen strategisch.
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
              onPress={() => {
                if (__DEV__) {
                  console.log('[IllusionGameOverModal] "Echtes Spiel starten" pressed');
                }
                onStartRealGame();
              }}
            >
              <Text style={styles.primaryButtonText}>Echtes Spiel starten</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
              onPress={() => {
                if (__DEV__) {
                  console.log('[IllusionGameOverModal] "Zurück zum Menü" pressed');
                }
                onGoHome();
              }}
            >
              <Text style={styles.secondaryButtonText}>Zurück zum Menü</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

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
  header: {
    backgroundColor: '#22c55e',
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  learningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  learningIcon: {
    fontSize: 18,
    marginTop: 1,
  },
  learningText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
  },
  nextStepText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
    marginBottom: 8,
  },
  buttonRow: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
