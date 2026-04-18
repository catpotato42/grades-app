import React, { useSyncExternalStore } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../styles/theme';
import { AppSettings } from '../../config/settings';
import { SmoothSwitch } from '../elements/CustomSwitch';

export default function SettingsView() {
    const theme = useTheme();
    const styles = createStyles(theme);

    const settings = useSyncExternalStore(AppSettings.subscribe, AppSettings.getSnapshot);

    return (
    <ScrollView style={styles.container}>
        <Text style={styles.headerTitle}>Settings</Text>

        <Text style={styles.sectionHeader}>Accessibility</Text>
        <View style={styles.sectionContainer}>
        <View style={styles.row}>
            <Text style={styles.rowLabel}>Colorblind Mode</Text>
            <SmoothSwitch 
                value={settings.colorblindMode}
                onValueChange={(val) => AppSettings.update('colorblindMode', val)}
                theme={theme}
            />
        </View>
        
        <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.rowLabel}>Accessible Fonts</Text>
            <SmoothSwitch 
                value={settings.accessibleFonts}
                onValueChange={(val) => AppSettings.update('accessibleFonts', val)}
                theme={theme} 
            />
        </View>
        </View>

        <Text style={styles.sectionHeader}>Customization</Text>
        <View style={styles.sectionContainer}>
        <View style={styles.row}>
            <Text style={styles.rowLabel}>Show Classes With No Data</Text>
            <SmoothSwitch 
                value={settings.showClassesWithNoData} 
                onValueChange={(val) => AppSettings.update('showClassesWithNoData', val)} 
                theme={theme} 
            />
        </View>
        
        <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.rowLabel}>Dark Mode</Text>
            <View>
            <SmoothSwitch
                value={settings.darkMode}
                onValueChange={(val) => AppSettings.update('darkMode', val)}
                theme={theme}
            />
            </View>
        </View>
        </View>
    </ScrollView>
    );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    fontSize: 32,
    fontFamily: theme.fonts.title,
    marginTop: 60,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rowLabel: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontFamily: theme.fonts.heading,
  },
  sectionHeader: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontFamily: theme.fonts.heading,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 25,
    paddingLeft: 10,
  },
  sectionContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 15,
    overflow: 'hidden',
  },
});