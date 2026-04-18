import React from 'react';
import { Course } from '../../../types';
import BaseCourseItem from './BaseCourseItem';

interface ArchiveCourseItemProps {
  course: Course;
  termId: string;
  onPress: () => void;
}

export default function ArchiveCourseItem({ course, termId, onPress }: ArchiveCourseItemProps) {
  return (
    <BaseCourseItem 
      course={course}
      currentTerm={termId}
      onPress={onPress}
    />
  );
}