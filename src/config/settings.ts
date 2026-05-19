import AsyncStorage from '@react-native-async-storage/async-storage';
import { RemindersStore } from './remindersStore';

const STORAGE_KEY = '@app_settings';

let settingsState = {
  //if false hides classes that would show up as grey
  showClassesWithNoData: true,
  //needs more implementation
  accessibleFonts: false,
  colorblindMode: false,
  //unlockable
  darkMode: false,
  //unlockable
  remindersEnabled: false,
  defaultReminderMinutes: 60,
};

const listeners = new Set<() => void>();

export const AppSettings = {

  getSnapshot: () => settingsState,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  //saves, triggers update
  update: async (key: keyof typeof settingsState, value: boolean | number) => {
    settingsState = { ...settingsState, [key]: value };
    listeners.forEach(listener => listener()); 
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settingsState));
  },

  load: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        settingsState = { ...settingsState, ...JSON.parse(jsonValue) };
        listeners.forEach(listener => listener());
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
  }
};