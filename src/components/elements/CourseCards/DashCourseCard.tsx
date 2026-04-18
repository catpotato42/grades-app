import React from 'react';
import { StyleSheet, Text, Dimensions, Pressable } from 'react-native';
import { useTheme } from '../../../styles/theme';
import { useGradeColor, getLetterGrade } from '../../../utils/gradeUtils';
import BaseCourseCard from './BaseCourseCard';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 50) / 2;

interface DashCourseCardProps {
  courseName?: string;
  grade?: number;
  letterGrade?: string;
  period?: string;
  teacher?: string;
  size?: number;
  onPress: () => void;
}

export default function DashCourseCard({courseName, grade, letterGrade, period, teacher, onPress, size=CARD_SIZE}: DashCourseCardProps) {
  const theme = useTheme();
  const backgroundColor = useGradeColor(grade);
  const styles = createStyles(theme);

  return (
    <Pressable onPress={onPress}>
      <BaseCourseCard
        title={courseName || "—"}
        gradeDisplay={letterGrade || getLetterGrade(grade)}
        offset={15}
        backgroundColor={backgroundColor}
        style={{ width: size, height: size }}
        topContent={
          <>
            <Text style={styles.subText}>
              {teacher ? teacher.substring(teacher.indexOf(' ') + 1) : "—"}
            </Text>
            <Text style={styles.subText}>
              {period ? `Period ${period}` : "—"}
            </Text>
          </>
        }
        bottomContent={
          <Text style={styles.percentageText}>
            {grade !== undefined ? `${grade}%` : "—%"}
          </Text>
        }
      >
      </BaseCourseCard>
    </Pressable>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  subText: {
    color: theme.colors.textGrades,
    fontSize: 11,
    fontFamily: theme.fonts.heading,
    opacity: 0.8,
  },
  percentageText: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textGrades,
    opacity: 0.9,
  },
});