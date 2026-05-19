import React, { useState, useSyncExternalStore } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../styles/theme';
import { RemindersStore } from '../../config/remindersStore';
import { AppSettings } from '../../config/settings';
import ReminderAssignmentItem from '../elements/ListItems/ReminderAssignmentItem';
import { AcademicData, Assignment } from '../../types';

export default function RemindersView({ data }: { data: AcademicData }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  const remindersState = useSyncExternalStore(RemindersStore.subscribe, RemindersStore.getSnapshot);
  const settings = useSyncExternalStore(AppSettings.subscribe, AppSettings.getSnapshot);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempMinutes, setTempMinutes] = useState('');

  const now = Date.now();

  //flatten all assignments, filter out completed/past ones, and sort by date
  const allUpcoming = data.courses.flatMap(c => c.assignments)
    .filter(a => !a.isCompleted && a.date && new Date(a.date).getTime() > now)
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  const openEditor = (id: string, currentMinutes: number) => {
    setEditingId(id);
    setTempMinutes(String(currentMinutes));
  };

  const saveTime = () => {
    if (editingId) {
      const current = remindersState[editingId] || { enabled: true, minutesAhead: settings.defaultReminderMinutes };
      RemindersStore.updateAssignment(editingId, { ...current, minutesAhead: parseInt(tempMinutes) || 0 });
    }
    setEditingId(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Reminders</Text>
      </View>
      
      <FlatList
        data={allUpcoming}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const individualSetting = remindersState[item.id] || { 
            enabled: true, 
            minutesAhead: settings.defaultReminderMinutes || 60 
          };
          
          return (
            <ReminderAssignmentItem 
              assignment={item} 
              reminderSettings={individualSetting}
              onPress={() => openEditor(item.id, individualSetting.minutesAhead)}
            />
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No upcoming assignments</Text>}
      />

      <Modal visible={!!editingId} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Reminder Time</Text>
            <Text style={styles.modalSub}>Minutes before due date:</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={tempMinutes}
              onChangeText={setTempMinutes}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setEditingId(null)} style={styles.modalBtn}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveTime} style={styles.modalBtn}>
                {/* Fallback to #4CAF50 if gradeGreen doesn't exist */}
                <Text style={[styles.modalBtnText, { color: theme.colors.gradeGreen || '#4CAF50' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  empty: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: 50 
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  modalBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10
  },
  modalBtnText: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  modalContent: {
    width: 300,
    backgroundColor: theme.colors.cardBackground || theme.colors.background,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center'
  },
  modalInput: {
    width: '100%',
    backgroundColor: theme.colors.background,
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontFamily: theme.fonts.heading,
    textAlign: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 24
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalSub: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.title,
    color: theme.colors.textPrimary,
    marginBottom: 8
  },
  title: {
    fontSize: 32,
    fontFamily: theme.fonts.title,
    color: theme.colors.textPrimary
  },
});