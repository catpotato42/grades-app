import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Assignment } from '../../../types';
import BaseAssignmentItem from './BaseAssignmentItem';

interface AssignmentItemProps {
  assignment: Assignment;
  originalAssignment?: Assignment;
  isIgnored: boolean;
  barColor: string;
  theme: any;
  onToggleIgnore: (id: string) => void;
  onSelect: (assignment: Assignment) => void;
}

export default function AssignmentItem({ assignment, originalAssignment, isIgnored, barColor, theme, onToggleIgnore, onSelect }: AssignmentItemProps) {
    const earned = assignment.score;
    const possible = assignment.totalPoints;
    const percentage = (earned !== undefined && possible !== undefined && possible > 0) 
    ? Math.round((earned / possible) * 100) 
    : null;

    const origEarned = originalAssignment?.score;
    const origPossible = originalAssignment?.totalPoints;
    const origPercentage = (origEarned !== undefined && origPossible !== undefined && origPossible > 0) 
    ? Math.round((origEarned / origPossible) * 100) 
    : null;

    const isEdited = origPercentage !== null && origPercentage !== percentage;

    const styles = createStyles(theme);

    return (
      <BaseAssignmentItem 
        barColor={barColor}
        opacity={isIgnored ? 0.6 : 1}
        onPress={() => onSelect(assignment)}
        leftContent={
          <TouchableOpacity onPress={() => onToggleIgnore(assignment.id)} style={styles.checkBox}>
            {!isIgnored && <Text style={styles.checkText}>✓</Text>}
          </TouchableOpacity>
        }
        centerContent={
          <Text style={styles.assignmentTitle} numberOfLines={1}>{assignment.title}</Text>
        }
        rightContent={
          <Text style={styles.assignmentScore}>
            {isEdited ? `${origPercentage}% → ` : ''}
            {percentage !== null ? `${percentage}%` : '-%'}
          </Text>
        }
      />
    );
}

const createStyles = (theme: any) => StyleSheet.create({
  assignmentRow: { 
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  assignmentScore: { 
    color: theme.colors.textGrades, 
    fontFamily: theme.fonts.heading, 
    fontSize: 16 
  },
  assignmentTitle: { 
    color: theme.colors.textGrades, 
    fontFamily: theme.fonts.heading, 
    fontSize: 15, 
    flex: 1 
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.textSecondary,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { 
    color: theme.colors.textPrimary, 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
});