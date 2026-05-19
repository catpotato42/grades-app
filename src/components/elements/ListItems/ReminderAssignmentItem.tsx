import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Assignment } from '../../../types';
import { useTheme } from '../../../styles/theme';
import BaseAssignmentItem from './BaseAssignmentItem';
import { RemindersStore } from '../../../config/remindersStore';

interface ReminderItemProps {
  assignment: Assignment;
  reminderSettings: { enabled: boolean; minutesAhead: number };
  onPress: () => void;
}

export default function ReminderAssignmentItem({ assignment, reminderSettings, onPress }: ReminderItemProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const toggleReminder = () => {
    RemindersStore.updateAssignment(assignment.id, {
      ...reminderSettings,
      enabled: !reminderSettings.enabled
    });
  };

  const dueDate = assignment.date ? (() => {
    const d = new Date(assignment.date);
    const datePart = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const timePart = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
    return `${datePart} ${timePart.replace('am', 'a.m.').replace('pm', 'p.m.')}`;
  })() : 'No Date';

  return (
    <BaseAssignmentItem
      barColor={theme.colors.textUnavailable}
      opacity={reminderSettings.enabled ? 1 : 0.5}
      onPress={onPress}
      leftContent={
        <TouchableOpacity onPress={toggleReminder} style={styles.checkBox} hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}>
           {reminderSettings.enabled && <Text style={styles.checkText}>✓</Text>}
        </TouchableOpacity>
      }
      centerContent={
        <View style={styles.centerTextContainer}>
          <Text style={styles.title} numberOfLines={1}>{assignment.title}</Text>
          <Text style={styles.dateText}>{dueDate}</Text>
        </View>
      }
      rightContent={
        <Text style={styles.timeText}>{reminderSettings.minutesAhead}m</Text>
      }
    />
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  centerTextContainer: {
    alignItems: 'center'
  },
  checkBox: { 
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: theme.colors.textSecondary,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  checkText: {
    fontSize: 20,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  dateText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.body,
    fontSize: 12
  },
  timeText: {
    color: theme.colors.textSecondary, 
    fontFamily: theme.fonts.heading
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.heading,
    fontSize: 15
  },
});