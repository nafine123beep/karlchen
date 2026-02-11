/**
 * App Navigator - Main navigation structure
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/HomeScreen';
import TutorialScreen from '@/screens/TutorialScreen';
import GameScreen from '@/screens/GameScreen';
import StatsScreen from '@/screens/StatsScreen';
import BasicTutorialScreen from '@/screens/tutorial/BasicTutorialScreen';
import QuizIntroScreen from '@/screens/quiz/QuizIntroScreen';
import QuizScreen from '@/screens/quiz/QuizScreen';
import QuizResultScreen from '@/screens/quiz/QuizResultScreen';
import SettingsScreen from '@/screens/SettingsScreen';

export type RootStackParamList = {
  Home: undefined;
  BasicTutorial: undefined;
  Tutorial: undefined;
  Game: { mode: 'practice' | 'tutorial' };
  Stats: undefined;
  QuizIntro: undefined;
  Quiz: undefined;
  QuizResult: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2563eb',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Karlchen - Doppelkopf Lernen' }}
      />
      <Stack.Screen
        name="BasicTutorial"
        component={BasicTutorialScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tutorial"
        component={TutorialScreen}
        options={{ title: 'Tutorial' }}
      />
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={{ title: 'Spiel', headerBackVisible: false }}
      />
      <Stack.Screen
        name="Stats"
        component={StatsScreen}
        options={{ title: 'Statistiken' }}
      />
      <Stack.Screen
        name="QuizIntro"
        component={QuizIntroScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuizResult"
        component={QuizResultScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Einstellungen' }}
      />
    </Stack.Navigator>
  );
};
