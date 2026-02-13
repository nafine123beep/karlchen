/**
 * Game Rules Screen
 * Static reference for Doppelkopf game rules and instructions
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'GameRules'>;

const GameRulesScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Spiel-Anleitung</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Grundregeln</Text>
        <Text style={styles.text}>
          Doppelkopf ist ein Kartenspiel für vier Spieler. Das Spiel wird mit 48 Karten (zwei Standardkartenspiele ohne 2-8) gespielt.
        </Text>
        <Text style={styles.text}>
          Jeder Spieler erhält 12 Karten. Das Ziel ist es, durch Stiche möglichst viele Punkte zu sammeln.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kartenwerte</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Ass: 11 Punkte</Text>
          <Text style={styles.listItem}>• Zehn: 10 Punkte</Text>
          <Text style={styles.listItem}>• König: 4 Punkte</Text>
          <Text style={styles.listItem}>• Dame: 3 Punkte</Text>
          <Text style={styles.listItem}>• Bube: 2 Punkte</Text>
          <Text style={styles.listItem}>• Neun: 0 Punkte</Text>
        </View>
        <Text style={styles.text}>
          Insgesamt gibt es 240 Punkte im Spiel. Eine Partei benötigt mindestens 121 Punkte, um zu gewinnen.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trumpfkarten</Text>
        <Text style={styles.text}>
          Standardmäßig sind alle Kreuz-Damen, Pik-Buben, Herz-Buben, Karo-Buben und Karo-Karten Trumpf.
        </Text>
        <Text style={styles.text}>
          Die Trumpfreihenfolge (höchste zuerst):
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>1. Kreuz-Dame</Text>
          <Text style={styles.listItem}>2. Pik-Dame</Text>
          <Text style={styles.listItem}>3. Herz-Dame</Text>
          <Text style={styles.listItem}>4. Karo-Dame</Text>
          <Text style={styles.listItem}>5. Kreuz-Bube</Text>
          <Text style={styles.listItem}>6. Pik-Bube</Text>
          <Text style={styles.listItem}>7. Herz-Bube</Text>
          <Text style={styles.listItem}>8. Karo-Bube</Text>
          <Text style={styles.listItem}>9. Karo-Ass</Text>
          <Text style={styles.listItem}>10. Karo-Zehn</Text>
          <Text style={styles.listItem}>11. Karo-König</Text>
          <Text style={styles.listItem}>12. Karo-Neun</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Teams</Text>
        <Text style={styles.text}>
          Die Spieler mit den Kreuz-Damen bilden das "Re"-Team. Die anderen beiden Spieler bilden das "Contra"-Team.
        </Text>
        <Text style={styles.text}>
          Die Teamzugehörigkeit ist zu Beginn geheim und wird durch das Ausspielen oder Ansagen offenbart.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sonderspiele</Text>
        <Text style={styles.text}>
          Es gibt verschiedene Sonderspiele wie Hochzeit, Solo, und Armut, die besondere Regeln und höhere Punktwerte haben.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wertung</Text>
        <Text style={styles.text}>
          Das Spiel wird in der Regel über mehrere Runden gespielt. Punkte werden für das Erreichen bestimmter Ziele vergeben:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Sieg (121+ Punkte): 1 Punkt</Text>
          <Text style={styles.listItem}>• Keine 90 (Gegner unter 90): +1 Punkt</Text>
          <Text style={styles.listItem}>• Keine 60 (Gegner unter 60): +1 Punkt</Text>
          <Text style={styles.listItem}>• Keine 30 (Gegner unter 30): +1 Punkt</Text>
          <Text style={styles.listItem}>• Schwarz (Gegner 0 Punkte): +1 Punkt</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Viel Erfolg beim Lernen! 🃏
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b', // Dark background like Settings
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#334155',
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 16,
    color: '#e2e8f0',
    lineHeight: 24,
    marginBottom: 12,
  },
  list: {
    marginVertical: 8,
    paddingLeft: 8,
  },
  listItem: {
    fontSize: 15,
    color: '#cbd5e1',
    lineHeight: 22,
    marginBottom: 4,
  },
  footer: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
});

export default GameRulesScreen;
