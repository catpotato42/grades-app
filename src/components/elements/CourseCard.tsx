import React from 'react';
import { StyleSheet, Text, View, Dimensions, Platform } from 'react-native';
import { Theme } from '../../styles/theme';
import { getGradeColor } from '../../utils/gradeUtils';

const { width } = Dimensions.get('window');
//10 px margins
const CARD_SIZE = (width - 50) / 2; 

interface CourseCardProps {
  courseName?: string;
  grade?: number;
  letterGrade?: string;
  period?: string;
  teacher?: string;
}

export default function CourseCard({ courseName, grade, letterGrade, period, teacher}: CourseCardProps) {
  const backgroundColor = getGradeColor(grade);

  return (
    <View style={[styles.card, { backgroundColor }]}>
      {/* Top: Course Name, Period, Teacher */}
      <View>
        <Text style={styles.courseTitle} numberOfLines={1}>
          {courseName || "—"}
        </Text>
        <Text style={styles.periodText}>
          {period ? `Period ${period}` : "—"}
        </Text>
        <Text style={styles.periodText}>
          {teacher ? teacher.substring(teacher.indexOf(' ') + 1) : "—"}
        </Text>
      </View>

      {/* Center: Large Letter Grade */}
      <View style={styles.centerContainer}>
        <Text style={styles.letterGradeText}>
          {letterGrade || "—"}
        </Text>
      </View>
      
      {/* Bottom: Small Percentage */}
      <View style={styles.bottomContainer}>
        <Text style={styles.percentageText}>
          {grade !== undefined ? `${grade}%` : "—%"}
        </Text>
      </View>
    </View>
  );
}

export const cardPadding = 16;

const styles = StyleSheet.create({
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 22,
    padding: cardPadding,
    justifyContent: 'space-between',
  },
  courseTitle: {
    color: Theme.colors.background,
    fontSize: 14,
    fontWeight: '800', //heavy weight
    fontFamily: Theme.fonts.title,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  periodText: {
    color: Theme.colors.background,
    fontSize: 11,
    fontFamily: Theme.fonts.heading,
    fontWeight: '600',
    opacity: 0.8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterGradeText: {
    fontSize: 55,
    fontWeight: '800',
    fontFamily: Theme.fonts.gradeDisplay,
    color: Theme.colors.background,
    letterSpacing: -2,
  },
  bottomContainer: {
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.background,
    opacity: 0.9,
  },
});