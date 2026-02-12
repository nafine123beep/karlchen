/**
 * HintModal - Shows beginner hints during gameplay
 *
 * Enhancement: Added mute option for Learning Mode
 * - Shows "Hinweise für dieses Spiel ausblenden" button
 * - Only for non-rule hints (timing !== 'rule')
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Platform } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { Hint } from '@/types/hint.types';

const isWeb = Platform.OS === 'web';

interface HintModalProps {
  visible: boolean;
  hint: Hint | null;
  onDismiss: () => void;
  onLearnMore?: (learnMoreKey: string) => void;
  // NEW: Mute option for Learning Mode
  onMute?: () => void;
  showMuteOption?: boolean;
}

export const HintModal: React.FC<HintModalProps> = ({
  visible,
  hint,
  onDismiss,
  onLearnMore,
  onMute,
  showMuteOption = false,
}) => {
  if (!hint) return null;

  const isWarning = hint.severity === 'warn';
  const borderColor = isWarning ? '#f59e0b' : '#3b82f6';
  const iconBg = isWarning ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)';
  const titleColor = isWarning ? '#f59e0b' : '#3b82f6';
  const buttonBg = isWarning ? '#f59e0b' : '#3b82f6';
  const icon = isWarning ? '⚠️' : '💡';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Animated.View
          entering={isWeb ? undefined : SlideInDown.springify()}
          style={[styles.container, { borderColor }]}
        >
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
            <Text style={styles.icon}>{icon}</Text>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: titleColor }]}>{hint.title}</Text>

          {/* Message */}
          <Text style={styles.message}>{hint.message}</Text>

          {/* NEW: Mute button (full-width, above other buttons) */}
          {showMuteOption && onMute && (
            <Pressable
              style={styles.muteButton}
              onPress={onMute}
            >
              <Text style={styles.muteButtonText}>🔇 Hinweise für dieses Spiel ausblenden</Text>
            </Pressable>
          )}

          {/* Buttons */}
          <View style={styles.buttonRow}>
            {/* Learn More button (if learnMoreKey provided) */}
            {hint.learnMoreKey && onLearnMore && (
              <Pressable
                style={styles.secondaryButton}
                onPress={() => onLearnMore(hint.learnMoreKey!)}
              >
                <Text style={styles.secondaryButtonText}>Mehr erfahren</Text>
              </Pressable>
            )}

            {/* Primary dismiss button */}
            <Pressable
              style={[styles.primaryButton, { backgroundColor: buttonBg }]}
              onPress={onDismiss}
            >
              <Text style={styles.primaryButtonText}>Verstanden</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // NEW: Mute button styles
  muteButton: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  muteButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default HintModal;
