import React from 'react';
import { StyleSheet, Text, View, Dimensions, Platform } from 'react-native';
import { useTheme } from '../../styles/theme';
import { useGradeColor } from '../../utils/gradeUtils';
import BaseCourseCard from './BaseCourseCard';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 50) / 2;

interface CourseCardProps {
  courseName?: string;
  grade?: number;
  letterGrade?: string;
  period?: string;
  teacher?: string;
}

export default function CourseCard({courseName, grade, letterGrade, period, teacher}: CourseCardProps) {
  //loads theme on every call of function so settings can update w/out restart
  const theme = useTheme();
  const backgroundColor = useGradeColor(grade);
  const styles = createStyles(theme);

  return (
    <BaseCourseCard
      title={courseName || "—"}
      gradeDisplay={letterGrade || "—"}
      backgroundColor={backgroundColor}
      style={{ width: CARD_SIZE, height: CARD_SIZE }}
    >
      {/* Top: Course Name, Period, Teacher */}
      <View>
        <Text style={styles.subText}>
          {period ? `Period ${period}` : "—"}
        </Text>
        <Text style={styles.subText}>
          {teacher ? teacher.substring(teacher.indexOf(' ') + 1) : "—"}
        </Text>
      </View>
      
      {/* Bottom: Small Percentage */}
      <View style={styles.bottomContainer}>
        <Text style={styles.percentageText}>
          {grade !== undefined ? `${grade}%` : "—%"}
        </Text>
      </View>
    </BaseCourseCard>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  subText: {
    color: theme.colors.background,
    fontSize: 11,
    fontFamily: theme.fonts.heading,
    opacity: 0.8,
  },
  bottomContainer: {
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.background,
    opacity: 0.9,
  },
});