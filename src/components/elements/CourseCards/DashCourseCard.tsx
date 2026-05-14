import React from 'react';
import { StyleSheet, Text, Dimensions, Pressable } from 'react-native';
import { useTheme } from '../../../styles/theme';
import { useGradeColor, getLetterGrade } from '../../../utils/gradeUtils';
import BaseCourseCard from './BaseCourseCard';
import { Course } from '../../../types';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 50) / 2;

interface DashCourseCardProps {
  course: Course;
  selectedTerm: string;
  size?: number;
  onPress: () => void;
}

export default function DashCourseCard({ course, selectedTerm, onPress, size = CARD_SIZE }: DashCourseCardProps) {

  const theme = useTheme();
  const termGrade = course.officialGrades[selectedTerm];

  const grade = termGrade?.numeric !== undefined ? termGrade.numeric : undefined;
  const letterGrade = termGrade?.letter || getLetterGrade(grade);
  const backgroundColor = useGradeColor(grade);
  const styles = createStyles(theme);

  return (
    <Pressable onPress={onPress}>
      <BaseCourseCard
        title={course.title || "-"}
        gradeDisplay={letterGrade || "-"}
        offset={15}
        backgroundColor={backgroundColor}
        style={{ width: size, height: size }}
        topContent={
          <>
            <Text style={styles.subText}>
              {course.teacher ? course.teacher.substring(course.teacher.indexOf(' ') + 1) : "-"}
            </Text>
            <Text style={styles.subText}>
              {course.period ? `Period ${course.period}` : "-"}
            </Text>
          </>
        }
        bottomContent={
          <Text style={styles.percentageText}>
            {grade !== undefined ? `${grade}%` : "-%"}
          </Text>
        }
      />
    </Pressable>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  percentageText: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textGrades,
    opacity: 0.9,
  },
  subText: {
    color: theme.colors.textGrades,
    fontSize: 11,
    fontFamily: theme.fonts.heading,
    opacity: 0.8,
  },
});