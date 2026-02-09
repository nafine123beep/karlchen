/**
 * App Navigator - Main navigation structure
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/HomeScreen';
import TutorialScreen from '@/screens/TutorialScreen';
import GameScreen from '@/screens/GameScreen';
import StatsScreen from '@/screens/StatsScreen';

export type RootStackParamList = {
  Home: undefined;
  Tutorial: undefined;
  Game: { mode: 'practice' | 'tutorial' };
  Stats: undefined;
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
    </Stack.Navigator>
  );
};
