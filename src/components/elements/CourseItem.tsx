import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Course, PastCourse } from '../../types';

interface CourseItemProps {
  course: Course | PastCourse;
  isIncluded: boolean;
  onToggle: () => void;
  theme: any;
}

export default function CourseItem({ course, isIncluded, onToggle, theme }: CourseItemProps) {
  const styles = createStyles(theme);

  const isPastCourse = 'credits' in course;
  
  let gradeDisplay = 'N/A';

  if (isPastCourse) {
    const pc = course as PastCourse;
    gradeDisplay = pc.letter || pc.numeric?.toString() || 'N/A';
  } else {
    const cc = course as Course;
    const firstGradeObj = Object.values(cc.officialGrades).find(g => g.letter || g.numeric);
    if (firstGradeObj) {
      gradeDisplay = firstGradeObj.letter || firstGradeObj.numeric?.toString() || 'N/A';
    }
  }

  let gradeColor = theme.colors.textSecondary;
  if (gradeDisplay.startsWith('A') || parseFloat(gradeDisplay) >= 90) gradeColor = theme.colors.gradeGreen;
  else if (gradeDisplay.startsWith('B') || parseFloat(gradeDisplay) >= 80) gradeColor = theme.colors.gradeBlue;
  else if (gradeDisplay.startsWith('C') || parseFloat(gradeDisplay) >= 70) gradeColor = theme.colors.gradeYellow;
  else if (gradeDisplay.startsWith('D') || parseFloat(gradeDisplay) >= 60) gradeColor = theme.colors.gradeOrange;
  else if (gradeDisplay.startsWith('F') || parseFloat(gradeDisplay) < 60) gradeColor = theme.colors.gradeRed;

  return (
    <TouchableOpacity 
      style={[styles.container, {backgroundColor: isIncluded ? gradeColor : theme.colors.gradeGrey }, !isIncluded && styles.excludedContainer]} 
      onPress={onToggle}
      activeOpacity={0.7}
    >

      <View style={styles.infoContainer}>
        <Text style={[styles.titleText, { color: theme.colors.gradeText }]} numberOfLines={1}>{course.title}</Text>
      </View>

      <View style={styles.gradeContainer}>
        <Text style={[styles.gradeText, { color: theme.colors.gradeText }]}>
          {gradeDisplay}
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
  excludedContainer: {
    opacity: 0.5,
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
  gradeContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  gradeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});