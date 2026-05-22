import * as Notifications from 'expo-notifications';
import { AcademicData } from '../types';
import { RemindersStore } from '../config/remindersStore';
import { Platform } from 'react-native';
import { AppSettings } from '../config/settings';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationManager = {
  requestPermissions: async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Assignment Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#b827257c',
      });
    }

    return finalStatus === 'granted';
  },

  scheduleAlarms: async (data: AcademicData) => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      const globalSettings = AppSettings.getSnapshot();
      if (!globalSettings.remindersEnabled) return;

      const reminderSettings = RemindersStore.getSnapshot();

      for (const course of data.courses) {
        for (const assignment of course.assignments) {
          if (assignment.isCompleted || !assignment.date) continue;
          
          const dueDate = new Date(assignment.date).getTime();
          if (dueDate < Date.now()) continue;

          const setting = reminderSettings[assignment.id] || { 
            enabled: true, 
            minutesAhead: globalSettings.defaultReminderMinutes || 60 
          };

          if (!setting.enabled) continue;

          const alarmTime = new Date(dueDate - (setting.minutesAhead * 60000));

          if (alarmTime.getTime() > (Date.now() + 2000)) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Assignment Due",
                body: `"${assignment.title}" is due in ${setting.minutesAhead} minutes.`,
                data: { assignmentId: assignment.id },
              },
              trigger: {
                type: 'date',
                date: alarmTime.getTime(), 
                ...Platform.select({
                  android: { channelId: 'default' }
                })
              } as any,
            });
          }
        }
      }
    } catch (error) {
      console.error("[NotificationManager] Error scheduling alarms:", error);
    }
  }
};