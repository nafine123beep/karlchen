/**
 * Button Component - Reusable button component
 * TODO: Implement variants, sizes, icons
 */

import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
}) => {
  // TODO: Implement button variants and sizes
  const buttonStyle: ViewStyle = {
    ...styles.button,
    ...styles[`button_${variant}`],
    ...styles[`button_${size}`],
    ...(disabled && styles.button_disabled),
    ...style,
  };

  const textStyle: TextStyle = {
    ...styles.text,
    ...styles[`text_${size}`],
  };

  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyle,
        pressed && !disabled && styles.button_pressed,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  button_primary: {
    backgroundColor: '#2563eb',
  },
  button_secondary: {
    backgroundColor: '#6b7280',
  },
  button_danger: {
    backgroundColor: '#dc2626',
  },
  button_disabled: {
    opacity: 0.5,
  },
  button_pressed: {
    opacity: 0.8,
  },
  button_small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  button_medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  button_large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  text: {
    color: '#ffffff',
    fontWeight: '600',
  },
  text_small: {
    fontSize: 14,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
  },
});
