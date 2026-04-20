import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Assignment } from '../../../types';
import { useTheme } from '../../../styles/theme';
import { useGradeColor } from '../../../utils/gradeUtils';

interface ArchiveAssignmentItemProps {
  assignment: Assignment;
}

export default function ArchiveAssignmentItem({ assignment }: ArchiveAssignmentItemProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const earned = assignment.score;
  const possible = assignment.totalPoints;
  const percentage = (earned !== undefined && possible !== undefined && possible > 0) 
  ? Math.round((earned / possible) * 100) 
  : null;

  const barColor = useGradeColor(percentage);

  return (
      <View style={styles.assignmentRow}>
          <View style={[styles.assignmentBar, { backgroundColor: barColor || theme.colors.gradeGrey }]}>
              <Text style={styles.assignmentTitle} numberOfLines={1}>
                  {assignment.title}
              </Text>
              <Text style={styles.assignmentScore}>
                  {percentage !== null ? `${percentage}%` : '-%'}
              </Text>
          </View>
      </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  assignmentBar: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    paddingVertical: 16, 
    paddingHorizontal: 20, 
    borderRadius: 14,
  },
  assignmentRow: { 
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  assignmentScore: { 
    color: theme.colors.textGrades || theme.colors.textPrimary, 
    fontFamily: theme.fonts.heading, 
    fontSize: 16 
  },
  assignmentTitle: { 
    color: theme.colors.textGrades || theme.colors.textPrimary, 
    fontFamily: theme.fonts.heading, 
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  }
});