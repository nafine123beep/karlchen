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
          Doppelkopf ist ein Kartenspiel für vier Spieler. Das Spiel wird mit 48 Karten gespielt (jede Karte existiert doppelt: 9, Bube, Dame, König, 10, Ass in vier Farben).
        </Text>
        <Text style={styles.text}>
          Jeder Spieler erhält 12 Karten. Das Spiel besteht aus 12 Stichen. In jedem Stich spielt jeder Spieler genau eine Karte. Die höchste Karte gewinnt den Stich und alle darin enthaltenen Punkte. Der Gewinner des Stichs spielt im nächsten Stich aus.
        </Text>
        <Text style={styles.text}>
          Bedienpflicht: Wenn eine Farbe ausgespielt wird, musst du diese Farbe bedienen, falls du sie auf der Hand hast. Trumpf zählt als eigene Farbe.
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
          Trümpfe sind: die Herz-10 (Dulle), alle Damen, alle Buben und alle Karo-Karten. Insgesamt 26 Trumpfkarten.
        </Text>
        <Text style={styles.text}>
          Die Trumpfreihenfolge (höchste zuerst):
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>1. Herz-10 (Dulle – höchster Trumpf!)</Text>
          <Text style={styles.listItem}>2. Kreuz-Dame</Text>
          <Text style={styles.listItem}>3. Pik-Dame</Text>
          <Text style={styles.listItem}>4. Herz-Dame</Text>
          <Text style={styles.listItem}>5. Karo-Dame</Text>
          <Text style={styles.listItem}>6. Kreuz-Bube</Text>
          <Text style={styles.listItem}>7. Pik-Bube</Text>
          <Text style={styles.listItem}>8. Herz-Bube</Text>
          <Text style={styles.listItem}>9. Karo-Bube</Text>
          <Text style={styles.listItem}>10. Karo-Ass</Text>
          <Text style={styles.listItem}>11. Karo-Zehn</Text>
          <Text style={styles.listItem}>12. Karo-König</Text>
          <Text style={styles.listItem}>13. Karo-Neun</Text>
        </View>
        <Text style={styles.text}>
          Sonderregel: Treffen beide Herz-10 in einem Stich aufeinander, gewinnt die zweite – außer im letzten Stich, da gewinnt die erste.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fuchs und Karlchen</Text>
        <Text style={styles.text}>
          Das Karo-Ass heißt „Fuchs". Wenn die gegnerische Partei deinen Fuchs in einem Stich fängt, bekommt sie einen Sonderpunkt (+1).
        </Text>
        <Text style={styles.text}>
          Der Kreuz-Bube heißt „Karlchen". Wer den letzten Stich (Stich 12) mit dem Kreuz-Buben gewinnt, bekommt einen Sonderpunkt (+1). Wird Karlchen im letzten Stich aber vom Gegner gefangen, bekommt der Gegner stattdessen den Punkt.
        </Text>
        <Text style={styles.text}>
          Wer den letzten Stich mit einem Fuchs (Karo-Ass) gewinnt, bekommt ebenfalls einen Sonderpunkt (+1).
        </Text>
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
        <Text style={styles.sectionTitle}>Ansagen</Text>
        <Text style={styles.text}>
          Re-Spieler können „Re" ansagen, Kontra-Spieler „Kontra". Dies muss vor der eigenen zweiten Karte geschehen. Eine Ansage zeigt Stärke und beeinflusst die Wertung.
        </Text>
        <Text style={styles.text}>
          Sage nur an, wenn du denkst, dass dein Team gewinnt – denn wenn du verlierst, bekommt der Gegner die Punkte!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wertung</Text>
        <Text style={styles.text}>
          Re braucht mindestens 121 Punkte zum Sieg. Bei 120:120 gewinnt Kontra. Punkte werden für das Erreichen bestimmter Ziele vergeben:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Sieg (121+ Punkte): 1 Punkt</Text>
          <Text style={styles.listItem}>• Keine 90 (Gegner unter 90): +1 Punkt</Text>
          <Text style={styles.listItem}>• Keine 60 (Gegner unter 60): +1 Punkt</Text>
          <Text style={styles.listItem}>• Keine 30 (Gegner unter 30): +1 Punkt</Text>
          <Text style={styles.listItem}>• Schwarz (Gegner 0 Stiche): +1 Punkt</Text>
        </View>
        <Text style={styles.sectionTitle}>Sonderpunkte</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Fuchs gefangen (Gegner-Karo-Ass erobert): +1</Text>
          <Text style={styles.listItem}>• Karlchen (letzter Stich mit Kreuz-Bube): +1</Text>
          <Text style={styles.listItem}>• Karlchen gefangen: +1 für den Gegner</Text>
          <Text style={styles.listItem}>• Fuchs im letzten Stich gewinnt: +1</Text>
          <Text style={styles.listItem}>• Doppelkopf (Stich mit 40+ Punkten): +1</Text>
          <Text style={styles.listItem}>• Gegen die Alten (Kontra besiegt Re): +1</Text>
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
