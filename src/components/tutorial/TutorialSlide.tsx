/**
 * TutorialSlide Component - Displays a single tutorial slide
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TutorialSlide as TutorialSlideData } from '@/types/tutorial.types';
import { CardsVisual, PlayersVisual, PointsVisual, RulesVisual, SuitsVisual, TrumpOverviewVisual } from './visuals';

interface TutorialSlideProps {
  slide: TutorialSlideData;
  isActive: boolean;
}

const renderVisual = (visual: { type: string; data?: any }) => {
  switch (visual.type) {
    case 'cards':
      return <CardsVisual data={visual.data} />;
    case 'players':
      return <PlayersVisual data={visual.data} />;
    case 'points':
      return <PointsVisual />;
    case 'rules':
      return <RulesVisual />;
    case 'suits':
      return <SuitsVisual />;
    case 'trumpOverview':
      return <TrumpOverviewVisual />;
    default:
      return (
        <View style={styles.fallbackPlaceholder}>
          <Text style={styles.fallbackLabel}>{visual.type}</Text>
        </View>
      );
  }
};

export const TutorialSlide: React.FC<TutorialSlideProps> = ({ slide, isActive }) => {
  if (!isActive) return null;

  const textArray = Array.isArray(slide.text) ? slide.text : [slide.text];

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Visual content */}
      {slide.visual && renderVisual(slide.visual)}

      <Text style={styles.headline}>{slide.headline}</Text>

      {textArray.map((paragraph, index) => (
        <Text key={index} style={styles.text}>{paragraph}</Text>
      ))}

      {slide.highlightText && (
        <View style={styles.highlightContainer}>
          <Text style={styles.highlightText}>{slide.highlightText}</Text>
        </View>
      )}

      {slide.bulletPoints && slide.bulletPoints.length > 0 && (
        <View style={styles.bulletContainer}>
          {slide.bulletPoints.map((item, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bullet}>{'•'}</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  fallbackPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    opacity: 0.85,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: '#0891b2',
  },
  fallbackLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  headline: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  highlightContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 12,
    alignSelf: 'stretch',
  },
  highlightText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  bulletContainer: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bullet: {
    fontSize: 16,
    color: '#ffffff',
    marginRight: 10,
    lineHeight: 22,
  },
  bulletText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 22,
    flex: 1,
  },
});
