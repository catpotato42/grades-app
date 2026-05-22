import React, { useState, useSyncExternalStore, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SyncManager } from './src/services/syncManager';
import PlatformSelectView, { PlatformId } from './src/components/screens/PlatformSelectView';
import SkywardLoginView from './src/components/screens/SkywardLoginView';
import CanvasLoginView from './src/components/screens/CanvasLoginView';

import MainScreen from './src/components/screens/MainScreen';
import { AcademicData } from './src/types';
import { NotificationManager } from './src/services/notificationManager';
import { RemindersStore } from './src/config/remindersStore';
import { AppSettings } from './src/config/settings';

import { 
  useFonts, 
  PlusJakartaSans_400Regular, 
  PlusJakartaSans_600SemiBold, 
  PlusJakartaSans_700Bold, 
  PlusJakartaSans_800ExtraBold 
} from '@expo-google-fonts/plus-jakarta-sans';
import { 
  Inter_600SemiBold, 
  Inter_800ExtraBold 
} from '@expo-google-fonts/inter';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [academicData, setAcademicData] = useState<AcademicData | null>(null);
  const [activePlatform, setActivePlatform] = useState<PlatformId | null>(null);
  const remindersState = useSyncExternalStore(RemindersStore.subscribe, RemindersStore.getSnapshot);
  const settingsState = useSyncExternalStore(AppSettings.subscribe, AppSettings.getSnapshot);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Inter_600SemiBold,
    Inter_800ExtraBold
  });

  useEffect(() => {
    //load saved settings and reminders on startup
    const initStores = async () => {
      await AppSettings.load();
      await RemindersStore.load();
      await NotificationManager.requestPermissions();
    };
    initStores();
  }, []);

  useEffect(() => {
    if (academicData) {
      NotificationManager.scheduleAlarms(academicData);
    }
    //add settingsState to dependencies so global toggle triggers a reschedule
  }, [academicData, remindersState, settingsState]);

  useEffect(() => {
    const tryAutoLogin = async () => {
      try {
        const data = await SyncManager.refreshData();
        setAcademicData(data);
        setIsLoggedIn(true);
      } catch (e) {
        console.log("No valid session found, manual login required.");
      }
    };

    if (fontsLoaded && !isLoggedIn) {
      tryAutoLogin();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; 
  }

  const handleLoginSuccess = (fetchedData: AcademicData) => {
    setAcademicData(fetchedData); //save data
    setIsLoggedIn(true); //swap screens
  };

  //helper
  const renderContent = () => {
    //if logged in, show main screen
    if (isLoggedIn && academicData) {
      return <MainScreen data={academicData} />;
    }

    //if platform selected, show the selected platform
    if (activePlatform === 'skyward') {
      return <SkywardLoginView onLoginSuccess={handleLoginSuccess} />;
    }
    if (activePlatform === 'canvas') {
      return <CanvasLoginView onLoginSuccess={handleLoginSuccess} />;
    }

    //default: select platform
    return <PlatformSelectView onSelectPlatform={setActivePlatform} />;
  };

  return (
    <SafeAreaProvider>
      {renderContent()}
    </SafeAreaProvider>
  );
}