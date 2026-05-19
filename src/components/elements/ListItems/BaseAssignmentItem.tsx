import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../styles/theme';

interface BaseAssignmentItemProps {
  leftContent?: ReactNode;
  centerContent: ReactNode;
  rightContent?: ReactNode;
  barColor: string;
  opacity?: number;
  onPress?: () => void;
}

export default function BaseAssignmentItem({ 
  leftContent, 
  centerContent, 
  rightContent, 
  barColor, 
  opacity = 1, 
  onPress 
}: BaseAssignmentItemProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  // If there's an onPress, make the bar touchable. Otherwise, static View.
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <View style={styles.assignmentRow}>
      {leftContent}
      {/* @ts-ignore */}
      <Wrapper 
        style={[styles.assignmentBar, { backgroundColor: barColor, opacity }]}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        <View style={styles.centerContainer}>
          {centerContent}
        </View>
        <View style={styles.rightContainer}>
          {rightContent}
        </View>
      </Wrapper>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  rightContainer: {
    marginLeft: 10,
    alignItems: 'flex-end',
  }
});