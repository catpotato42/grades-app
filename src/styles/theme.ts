import { useMemo } from 'react';
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
  gradeYellow: '#FFCC00',  //C
  gradeOrange: '#D55E00',  //D - Orange-Red
  gradeRed: '#CC79A7',    //E - Pinkish
  gradeGrey: '#606060'
};

export const useTheme = () => {
  const isAccessible = AppSettings.accessibleFonts;
  const isColorblind = AppSettings.colorblindMode;

  //generate raw theme object
  const theme = useMemo(() => ({
    colors: {
      //Backgrounds
      background: '#121212',
      surface: '#1E1E1E',
      
      //Typography
      textPrimary: '#FFFFFF',
      textSecondary: '#A0A0A0',
      textUnavailable: '#5A5A5A',
      //should not be swapped if I add light mode
      textGrades: '#121212',
      
      //Grade Indicators
      ...(isColorblind ? colorblindGradeColors : standardGradeColors),
      
      //UI Elements
      border: '#2C2C2E',
      accent: '#0A84FF',
      buttonPrimary: '#FFFFFF',
      buttonSecondary: '#606060'
    },

    fonts: {
      //really just a test of the accessibility settings, change to diff fonts later.
      title: isAccessible ? 'PlusJakartaSans_700Bold' : 'PlusJakartaSans_800ExtraBold',
      heading: 'PlusJakartaSans_700Bold',
      body: 'PlusJakartaSans_400Regular',
      gradeDisplay: 'Inter_800ExtraBold', 
    }
  }), [isAccessible, isColorblind]);

  return theme;
};