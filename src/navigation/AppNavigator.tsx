import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from '../styles/theme';
import { AcademicData } from '../types';
import { PlatformId } from '../components/screens/PlatformSelectView';

import PlatformSelectView from '../components/screens/PlatformSelectView';
import SkywardLoginView from '../components/screens/SkywardLoginView';
import DashboardView from '../components/screens/DashboardView';

//temporary until new screens are created
const AttendanceView = () => null;
const GPACalculatorView = () => null;
const ArchiveView = () => null;
const SettingsView = () => null;

const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();

interface AppNavigatorProps {
  isLoggedIn: boolean;
  academicData: AcademicData | null;
  activePlatform: PlatformId | null;
  setActivePlatform: (platform: PlatformId | null) => void;
  handleLoginSuccess: (data: AcademicData) => void;
}

export default function AppNavigator({
  isLoggedIn,
  academicData,
  activePlatform,
  setActivePlatform,
  handleLoginSuccess
}: AppNavigatorProps) {
  const theme = useTheme();

  const MainTabNavigator = () => (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border
        },
        tabBarActiveTintColor: theme.colors.textPrimary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen name="Dashboard">
        {() => <DashboardView data={academicData!} />}
      </Tab.Screen>
      <Tab.Screen name="Attendance" component={AttendanceView} />
      <Tab.Screen name="GPACalculator" component={GPACalculatorView} />
      <Tab.Screen name="Archive" component={ArchiveView} />
      <Tab.Screen name="Settings" component={SettingsView} />
    </Tab.Navigator>
  );

  const AuthNavigator = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="PlatformSelect">
        {() => <PlatformSelectView onSelectPlatform={setActivePlatform} />}
      </AuthStack.Screen>
      {activePlatform === 'skyward' && (
        <AuthStack.Screen name="SkywardLogin">
          {() => <SkywardLoginView onLoginSuccess={handleLoginSuccess} />}
        </AuthStack.Screen>
      )}
    </AuthStack.Navigator>
  );

  return (
    <NavigationContainer>
      {isLoggedIn && academicData ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}