/**
 * Storage Utilities - AsyncStorage wrapper for type-safe storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  GAME_STATE: '@karlchen/game_state',
  TUTORIAL_PROGRESS: '@karlchen/tutorial_progress',
  LEARNING_STATS: '@karlchen/learning_stats',
  SETTINGS: '@karlchen/settings',
  LAST_SESSION: '@karlchen/last_session',
} as const;

/**
 * Save data to AsyncStorage
 */
export async function saveData<T>(key: string, data: T): Promise<boolean> {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
    return false;
  }
}

/**
 * Load data from AsyncStorage
 */
export async function loadData<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error loading data for key ${key}:`, error);
    return null;
  }
}

/**
 * Remove data from AsyncStorage
 */
export async function removeData(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    return false;
  }
}

/**
 * Clear all app data
 */
export async function clearAllData(): Promise<boolean> {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
}

/**
 * Get all storage keys
 */
export async function getAllKeys(): Promise<readonly string[]> {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
}

/**
 * Check if key exists
 */
export async function hasKey(key: string): Promise<boolean> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys.includes(key);
  } catch (error) {
    console.error(`Error checking key ${key}:`, error);
    return false;
  }
}
