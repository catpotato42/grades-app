import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../styles/theme';
import { AcademicData } from '../../types';
import { AppSettings} from '../../config/settings';
import DashboardView from './DashboardView';
import SettingsView from './SettingsView';
import GPAView from './GPAView';
import ArchiveView from './ArchiveView';
//temp
//const AttendanceView = () => <View style={{flex: 1}}><Text style={{color: 'white', padding: 20}}>Attendance</Text></View>;
const LeaderboardView = () => <View style={{flex: 1}}><Text style={{color: 'white', padding: 20}}>Leaderboard</Text></View>;

const TAB_ICONS: Record<TabId, any> = {
  settings: require('../../../assets/icons/settings.png'),
  archive: require('../../../assets/icons/archive.png'),
  dashboard: require('../../../assets/icons/home.png'),
  //attendance: require('../../../assets/icons/attendance.png'),
  gpa: require('../../../assets/icons/calculator.png'),
  leaderboard: require('../../../assets/icons/trophy.png'),
};

interface MainScreenProps {
  data: AcademicData;
}

type TabId = 'dashboard' | 'gpa' | 'archive' | 'settings' | 'leaderboard'; //attendance?

export default function MainScreen({ data }: MainScreenProps) {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const theme = useTheme();
  const styles = createStyles(theme);

  //load here as well because platformselect will be skipped if you are already logged in
  const [isReady, setIsReady] = useState(false);

  React.useEffect(() => {
    AppSettings.load().then(() => setIsReady(true));
  }, []);

  if (!isReady) return null;

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView data={data} />;
      //case 'attendance': return <AttendanceView />;
      case 'gpa': return <GPAView data={data} />;
      case 'archive': return <ArchiveView data={data}/>;
      case 'settings': return <SettingsView />;
      case 'leaderboard': return <LeaderboardView />;
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
        {renderTabButton('gpa', 'GPA Calc.', TAB_ICONS.gpa)}
        {/* {renderTabButton('attendance', 'Attendance', TAB_ICONS.attendance)} */}
        {renderTabButton('leaderboard', 'Leaderboard', TAB_ICONS.leaderboard, true)}
      </SafeAreaView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    width: 24,
    height: 3,
    backgroundColor: theme.colors.textPrimary,
    borderRadius: 2
  },
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  icon: {
    width: 26,
    height: 26,
    maxWidth: 26,
    maxHeight: 26,
    marginBottom: 1,
  },
  labelActive: { 
    color: theme.colors.textPrimary 
  },
  labelInactive: { 
    color: theme.colors.textSecondary 
  },
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
  tabLabel: { 
    fontSize: 10, 
    fontFamily: theme.fonts.heading, 
    marginTop: 2,
  },
});