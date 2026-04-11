import { useMemo, useSyncExternalStore } from 'react';
import { StyleSheet } from 'react-native';
import { AppSettings } from '../config/settings';

const standardGradeColors = {
  //Grade Indicators
  gradeGreen: '#34C759', //A
  gradeBlue: '#007AFF', //B
  gradeYellow: '#FFCC00', //C
  gradeOrange: '#FF9500', //D
  gradeRed: '#FF3B30', //E
  gradeGrey: '#606060'
}

const colorblindGradeColors = {
  gradeGreen: '#009E73',  //A - Turquoise
  gradeBlue: '#0072B2',   //B - Darker Blue
  gradeYellow: '#BBAA00',  //C - Darker Yellow
  gradeOrange: '#D55E00',  //D - Orange-Red
  gradeRed: '#CC79A7',    //E - Pinkish
  gradeGrey: '#606060'
};

const darkThemeColors = {
  //Backgrounds
  background: '#121212',
  surface: '#1E1E1E',
  
  //Typography
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textUnavailable: '#5A5A5A',
  //should not be swapped in light mode
  textGrades: '#121212',

  //UI Elements
  border: '#2C2C2E',
  accent: '#0A84FF',
  buttonPrimary: '#FFFFFF',
  buttonSecondary: '#606060'
}

const lightThemeColors = {
  //Backgrounds
  background: '#EDF2F7',
  surface: '#FFFFFF',
  
  //Typography
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textUnavailable: '#A0AEC0',
  //should not be swapped in light mode
  textGrades: '#121212',

  //UI Elements
  border: '#E2E8F0',
  accent: '#0A84FF',
  buttonPrimary: '#2f3238',
  buttonSecondary: '#CBD5E0'
}

export const useTheme = () => {
  const settings = useSyncExternalStore(AppSettings.subscribe, AppSettings.getSnapshot);

  //generate raw theme object
  const theme = useMemo(() => ({
    dark: settings.darkMode,
    colors: {
      //General Theme
      ...(settings.darkMode ? darkThemeColors : lightThemeColors),
      
      //Grade Indicators
      ...(settings.colorblindMode ? colorblindGradeColors : standardGradeColors),
      
    },

    fonts: {
      //really just a test of the accessibility settings, change to diff fonts later.
      title: settings.accessibleFonts ? 'PlusJakartaSans_700Bold' : 'PlusJakartaSans_800ExtraBold',
      heading: 'PlusJakartaSans_700Bold',
      body: 'PlusJakartaSans_400Regular',
      gradeDisplay: 'Inter_800ExtraBold', 
    }
  }), [settings.darkMode, settings.accessibleFonts, settings.colorblindMode]);

  return theme;
};