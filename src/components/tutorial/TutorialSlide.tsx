/**
 * TutorialSlide Component - Displays a single tutorial slide
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { TutorialSlide as TutorialSlideData } from '@/types/tutorial.types';

interface TutorialSlideProps {
  slide: TutorialSlideData;
  isActive: boolean;
}

export const TutorialSlide: React.FC<TutorialSlideProps> = ({ slide, isActive }) => {
  if (!isActive) return null;

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <Text style={styles.illustration}>{slide.illustration}</Text>
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.subtitle}>{slide.subtitle}</Text>
      <View style={styles.contentContainer}>
        {slide.content.map((item, index) => (
          <View key={index} style={styles.contentRow}>
            <Text style={styles.bullet}>{'•'}</Text>
            <Text style={styles.contentText}>{item}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  illustration: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 32,
  },
  contentContainer: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
  },
  contentRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bullet: {
    fontSize: 16,
    color: '#ffffff',
    marginRight: 10,
    lineHeight: 22,
  },
  contentText: {
    fontSize: 15,
    color: '#ffffff',
    lineHeight: 22,
    flex: 1,
  },
});
