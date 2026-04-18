import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Course } from '../../../types';
import { useTheme } from '../../../styles/theme';

interface BaseCourseItemProps {
  course: Course;
  currentTerm?: string;
  onPress?: () => void;
  backgroundColorOverride?: string;
  containerStyle?: ViewStyle | ViewStyle[];
}

export default function BaseCourseItem({ course, currentTerm, onPress, backgroundColorOverride, containerStyle }: BaseCourseItemProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const convertNumericToLetter = (num?: number) => {
    if (num === undefined) return 'N/A';
    if (num >= 93) return 'A';
    if (num >= 90) return 'A-';
    if (num >= 87) return 'B+';
    if (num >= 83) return 'B';
    if (num >= 80) return 'B-';
    if (num >= 77) return 'C+';
    if (num >= 73) return 'C';
    if (num >= 70) return 'C-';
    if (num >= 67) return 'D+';
    if (num >= 60) return 'D';
    return 'F';
  };

  //default
  let gradeObj = course.finalGrade; 
  
  //current term classes
  if (!gradeObj && currentTerm) {
    gradeObj = course.officialGrades[currentTerm];
  }
  
  //fallback for calc
  if (!gradeObj || (gradeObj.letter === undefined && gradeObj.numeric === undefined)) {
    const allGrades = Object.values(course.officialGrades).filter(g => g.letter !== undefined || g.numeric !== undefined);
    gradeObj = allGrades[allGrades.length - 1];
  }

  const gradeLetter = gradeObj?.letter || convertNumericToLetter(gradeObj?.numeric);

  let gradeColor = theme.colors.gradeGrey;
  if (gradeLetter.startsWith('A') || parseFloat(gradeLetter) >= 90) gradeColor = theme.colors.gradeGreen;
  else if (gradeLetter.startsWith('B') || parseFloat(gradeLetter) >= 80) gradeColor = theme.colors.gradeBlue;
  else if (gradeLetter.startsWith('C') || parseFloat(gradeLetter) >= 70) gradeColor = theme.colors.gradeYellow;
  else if (gradeLetter.startsWith('D') || parseFloat(gradeLetter) >= 60) gradeColor = theme.colors.gradeOrange;
  else if (gradeLetter.startsWith('F') || parseFloat(gradeLetter) < 60) gradeColor = theme.colors.gradeRed;

  const finalBackgroundColor = backgroundColorOverride || gradeColor;

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: finalBackgroundColor }, containerStyle]} 
      onPress={onPress}
      activeOpacity={.7}
    >
      <View style={styles.infoContainer}>
        <Text style={[styles.titleText, { color: theme.colors.textGrades }]} numberOfLines={1}>
          {course.title}
        </Text>
      </View>

      <View style={styles.gradeContainer}>
        <Text style={[styles.gradeText, { color: theme.colors.textGrades }]}>
          {gradeLetter}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  gradeContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  gradeText: {
    fontSize: 18,
    fontFamily: theme.fonts?.title,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
    fontFamily: theme.fonts?.heading,
    marginBottom: 4,
  },
});