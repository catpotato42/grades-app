import React from 'react';
import { StyleSheet, Text, View, Dimensions, Platform } from 'react-native';
import { useTheme } from '../../../styles/theme';
import { useGradeColor, getLetterGrade } from '../../../utils/gradeUtils';
import BaseCourseCard from './BaseCourseCard';
import { Course } from '../../../types';

const { width } = Dimensions.get('window');
const CARD_SIZE = width / 2;

interface ClassCourseCardProps {
  course: Course;
  selectedTerm: string;
  size?: number;
  fontSizeMult?: number;
}

export default function ClassCourseCard({ course, selectedTerm, size=CARD_SIZE, fontSizeMult=1 }: ClassCourseCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  //dynamically get grade, advantage of composition
  const termGrade = course.officialGrades[selectedTerm];
  const grade = termGrade?.numeric !== undefined ? termGrade.numeric : undefined;
  const letterGrade = getLetterGrade(grade);
  const backgroundColor = useGradeColor(grade);

  return (
    <BaseCourseCard
      title={course.title || "—"}
      gradeDisplay={letterGrade || "—"}
      backgroundColor={backgroundColor}
      style={{ width: size, height: size }}
      offset={18}
      topContent={
        <>
          <Text style={[styles.subText, {fontSize:15*fontSizeMult}]}>{course.teacher ?? "—"}</Text>
          <Text style={[styles.subText, {fontSize:15*fontSizeMult}]}>{course.period ? `Period ${course.period}` : "—"}</Text>
        </>
      }
      bottomContent={
        <Text style={[styles.percentageText, {fontSize:20*fontSizeMult}]}>{grade !== undefined ? `${grade}%` : "—%"}</Text>
      }
      fontSizeMult={fontSizeMult}
      bDisplayTitle={false}
    />
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  percentageText: {
    fontFamily: theme.fonts.heading,
    color: theme.colors.textGrades,
    opacity: 0.9,
  },
  subText: {
    color: theme.colors.textGrades,
    fontFamily: theme.fonts.heading,
    opacity: 0.8,
  },
});