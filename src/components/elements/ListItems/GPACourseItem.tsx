import React from 'react';
import { StyleSheet } from 'react-native';
import { Course } from '../../../types';
import { useTheme } from '../../../styles/theme';
import BaseCourseItem from './BaseCourseItem';

interface GPACourseItemProps {
  course: Course;
  isIncluded: boolean;
  currentTerm?: string;
  onToggle: () => void;
}

export default function GPACourseItem({ course, isIncluded, currentTerm, onToggle }: GPACourseItemProps) {
  const theme = useTheme();
  const styles = createStyles();

  return (
    <BaseCourseItem 
      course={course}
      currentTerm={currentTerm}
      onPress={onToggle}
      backgroundColorOverride={isIncluded ? undefined : theme.colors.gradeGrey}
      containerStyle={isIncluded ? undefined : styles.excludedCourse}
    />
  );
}

const createStyles = () => StyleSheet.create({
  excludedCourse: {
    opacity: .5,
  },
});