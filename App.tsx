import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginView from './src/components/screens/LoginView';
import DashboardView from './src/components/screens/DashboardView'; 
import { Theme } from './src/styles/theme';
import { SkywardData } from './src/types';
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
} from '@expo-google-fonts/inter'; //for the grade letter

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [skywardData, setSkywardData] = useState<SkywardData | null>(null);
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Inter_600SemiBold,
    Inter_800ExtraBold
  });

  // If fonts aren't loaded, keep the splash screen up or return null
  if (!fontsLoaded) {
    return null; 
  }

  const handleLoginSuccess = (fetchedData: SkywardData) => {
    setSkywardData(fetchedData); //save data
    setIsLoggedIn(true); //swap screens
  };

  return (
    <SafeAreaProvider>
      {isLoggedIn && skywardData ? (
        <DashboardView data={skywardData} />
      ) : (
        <LoginView onLoginSuccess={handleLoginSuccess} />
      )}
    </SafeAreaProvider>
  );
}