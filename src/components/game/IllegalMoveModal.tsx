/**
 * IllegalMoveModal - Shows error when player attempts an illegal move
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Platform } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';

const isWeb = Platform.OS === 'web';

interface IllegalMoveModalProps {
  visible: boolean;
  reason: string;
  explanation?: string;
  onDismiss: () => void;
}

export const IllegalMoveModal: React.FC<IllegalMoveModalProps> = ({
  visible,
  reason,
  explanation,
  onDismiss,
}) => {
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
          style={styles.container}
        >
          {/* Warning icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>⚠️</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Ungültiger Zug!</Text>

          {/* Reason */}
          <Text style={styles.reason}>{reason}</Text>

          {/* Explanation */}
          {explanation && (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanation}>{explanation}</Text>
            </View>
          )}

          {/* Dismiss button */}
          <Pressable style={styles.button} onPress={onDismiss}>
            <Text style={styles.buttonText}>Verstanden</Text>
          </Pressable>
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
    borderColor: '#dc2626',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
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
    color: '#dc2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  reason: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  explanationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  explanation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default IllegalMoveModal;
