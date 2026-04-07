import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import PlatformSelectView, { PlatformId } from './src/components/screens/PlatformSelectView';
import SkywardLoginView from './src/components/screens/SkywardLoginView';

import MainScreen from './src/components/screens/MainScreen';
import { AcademicData } from './src/types';

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

    //default: select platform
    return <PlatformSelectView onSelectPlatform={setActivePlatform} />;
  };

  return (
    <SafeAreaProvider>
      {renderContent()}
    </SafeAreaProvider>
  );
}