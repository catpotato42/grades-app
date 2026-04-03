import { AppSettings } from '../config/settings';

const standardGradeColors = {
  //Grade Indicators
  gradeGreen: '#34C759', //A
  gradeBlue: '#007AFF', //B
  gradeYellow: '#FFCC00', //C
  gradeOrange: '#FF9500', //D
  gradeRed: '#FF3B30', //E
}

const colorblindGradeColors = {
  gradeGreen: '#009E73',  //A - Turquoise
  gradeBlue: '#0072B2',   //B - Darker Blue
  gradeYellow: '#FFCC00',  //C
  gradeOrange: '#D55E00',  //D - Orange-Red
  gradeRed: '#CC79A7',    //E - Pinkish
};

export const getTheme = () => {
  const isAccessible = AppSettings.accessibleFonts;
  const isColorblind = AppSettings.colorblindMode;

  return { 
    colors: {
      //Backgrounds
      background: '#121212',
      surface: '#1E1E1E',
      
      //Typography
      textPrimary: '#FFFFFF',
      textSecondary: '#A0A0A0',
      textUnavailable: '#5A5A5A',
      
      //Grade Indicators
      ...(isColorblind ? colorblindGradeColors : standardGradeColors),
      
      //UI Elements
      border: '#2C2C2E',
      accent: '#0A84FF',
      buttonPrimary: '#FFFFFF',
      buttonSecondary: '#606060'
    },

    fonts: {
      title: 'PlusJakartaSans_800ExtraBold',
      heading: 'PlusJakartaSans_700Bold',
      body: 'PlusJakartaSans_400Regular',
      gradeDisplay: 'Inter_900ExtraBold',
    }
  }
};

export const Theme = getTheme();