import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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

import { PlatformId } from './src/components/screens/PlatformSelectView';
import { AcademicData } from './src/types';

import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [academicData, setAcademicData] = useState<AcademicData | null>(null);
  const [activePlatform, setActivePlatform] = useState<PlatformId | null>(null);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Inter_600SemiBold,
    Inter_800ExtraBold
  });

  if (!fontsLoaded) {
    return null; 
  }

  const handleLoginSuccess = (fetchedData: AcademicData) => {
    setAcademicData(fetchedData); //save data
    setIsLoggedIn(true); //swap screens
  };

  return (
    <SafeAreaProvider>
      <AppNavigator 
        isLoggedIn={isLoggedIn}
        academicData={academicData}
        activePlatform={activePlatform}
        setActivePlatform={setActivePlatform}
        handleLoginSuccess={handleLoginSuccess}
      />
    </SafeAreaProvider>
  );
}