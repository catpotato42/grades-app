import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@app_reminders';

export interface ReminderSettings {
  enabled: boolean;
  minutesAhead: number;
}

let remindersState: Record<string, ReminderSettings> = {};
const listeners = new Set<() => void>();

export const RemindersStore = {
  getSnapshot: () => remindersState,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener); // Cleanup
  },

  updateAssignment: async (id: string, settings: ReminderSettings) => {
    remindersState = { ...remindersState, [id]: settings };
    listeners.forEach(listener => listener());
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remindersState));
  },

  load: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        remindersState = JSON.parse(jsonValue);
        listeners.forEach(listener => listener());
      }
    } catch (e) {
      console.error("Failed to load reminders state", e);
    }
  }
};