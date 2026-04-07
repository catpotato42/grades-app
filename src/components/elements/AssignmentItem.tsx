import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Assignment } from '../../types';

interface AssignmentItemProps {
  assignment: Assignment;
  isIgnored: boolean;
  barColor: string;
  theme: any;
  onToggleIgnore: (id: string) => void;
  onSelect: (assignment: Assignment) => void;
}

export default function AssignmentItem({ assignment, isIgnored, barColor, theme, onToggleIgnore, onSelect }: AssignmentItemProps) {
  const earned = assignment.score;
  const possible = assignment.totalPoints;
  const percentage = (earned !== undefined && possible !== undefined && possible > 0) 
    ? Math.round((earned / possible) * 100) 
    : null;

  const styles = createStyles(theme);

  return (
    <View style={styles.assignmentRow}>
      <TouchableOpacity onPress={() => onToggleIgnore(assignment.id)} style={styles.checkSquare}>
        {!isIgnored && <Text style={styles.checkText}>✓</Text>}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.assignmentBar, { backgroundColor: barColor, opacity: isIgnored ? 0.6 : 1 }]}
        onPress={() => onSelect(assignment)}
      >
        <Text style={styles.assignmentTitle} numberOfLines={1}>
          {assignment.title}
        </Text>
        <Text style={styles.assignmentScore}>
          {percentage !== null ? `${percentage}%` : '-%'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  assignmentRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkSquare: {
    width: 24, height: 24, borderRadius: 4, borderWidth: 2,
    borderColor: theme.colors.textSecondary, marginRight: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  checkText: { 
    color: theme.colors.textPrimary, 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  assignmentBar: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    paddingVertical: 16, 
    paddingHorizontal: 20, 
    borderRadius: 14,
  },
  assignmentTitle: { 
    color: theme.colors.textPrimary, 
    fontFamily: theme.fonts.heading, 
    fontSize: 15, 
    flex: 1 
  },
  assignmentScore: { 
    color: theme.colors.textPrimary, 
    fontFamily: theme.fonts.heading, 
    fontSize: 16 
  },
});