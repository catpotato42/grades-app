import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../styles/theme';
import { AcademicData } from '../../types';

import DashboardView from './DashboardView';
//temp
const AttendanceView = () => <View style={{flex: 1}}><Text style={{color: 'white', padding: 20}}>Attendance</Text></View>;
const GPAView = () => <View style={{flex: 1}}><Text style={{color: 'white', padding: 20}}>GPA Calculator</Text></View>;
const ArchiveView = () => <View style={{flex: 1}}><Text style={{color: 'white', padding: 20}}>Archive</Text></View>;
const SettingsView = () => <View style={{flex: 1}}><Text style={{color: 'white', padding: 20}}>Settings</Text></View>;

const TAB_ICONS: Record<TabId, any> = {
  settings: require('../../../assets/icons/settings.png'),
  archive: require('../../../assets/icons/archive.png'),
  dashboard: require('../../../assets/icons/home.png'),
  attendance: require('../../../assets/icons/attendance.png'),
  gpa: require('../../../assets/icons/calculator.png'),
};

interface MainScreenProps {
  data: AcademicData;
}

type TabId = 'dashboard' | 'attendance' | 'gpa' | 'archive' | 'settings';

export default function MainScreen({ data }: MainScreenProps) {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const theme = useTheme();
  const styles = createStyles(theme);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView data={data} />;
      case 'attendance': return <AttendanceView />;
      case 'gpa': return <GPAView />;
      case 'archive': return <ArchiveView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView data={data} />;
    }
  };


  //function to prevent flickering when switching tabs (icons are now not rendered again when changing color)
  const renderTabButton = (id: TabId, label: string, icon: ImageSourcePropType, isLast?: boolean) => {
    const isActive = activeTab === id;
    
    return (
      <TouchableOpacity 
        key={id}
        style={[
          styles.tabButton, 
          !isLast && styles.tabButtonBorder
        ]} 
        onPress={() => setActiveTab(id)}
      >
        <Image 
          source={icon}
          style={[
            styles.icon,
            { tintColor: isActive ? theme.colors.textPrimary : theme.colors.textSecondary }
          ]}
          resizeMode="contain"
          fadeDuration={0}
        />
        <Text style={[
          styles.tabLabel, 
          isActive ? styles.labelActive : styles.labelInactive
        ]}>
          {label}
        </Text>
        {isActive && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        {renderActiveView()}
      </View>

      <SafeAreaView edges={['bottom']} style={styles.tabBar}>
        {renderTabButton('settings', 'Settings', TAB_ICONS.settings)}
        {renderTabButton('archive', 'Archive', TAB_ICONS.archive)}
        {renderTabButton('dashboard', 'Home', TAB_ICONS.dashboard)}
        {renderTabButton('attendance', 'Attendance', TAB_ICONS.attendance)}
        {renderTabButton('gpa', 'GPA Calc.', TAB_ICONS.gpa, true)}
      </SafeAreaView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    height: 85,
    alignItems: 'stretch',
  },
  tabButton: { 
    flex: 1, //same width
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 10,
    position: 'relative',
  },
  tabButtonBorder: {
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
  icon: {
    width: 24,
    height: 24,
    maxWidth: 24,
    maxHeight: 24,
    marginBottom: 4,
  },
  tabLabel: { 
    fontSize: 10, 
    fontFamily: theme.fonts.heading, 
    marginTop: 2 
  },
  labelActive: { color: theme.colors.textPrimary },
  labelInactive: { color: theme.colors.textSecondary },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    width: 24,
    height: 3,
    backgroundColor: theme.colors.textPrimary,
    borderRadius: 2
  }
});