import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../styles/theme';
import { BottomTabBar, BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';

export const CARD_PADDING = 16;

interface BaseCourseCardProps {
  title: string;
  gradeDisplay: string; //letter not percent
  offset: number;
  backgroundColor: string;
  style: { width: number; height: number; [key: string]: any }; //size must be specified
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
}

export default function BaseCourseCard({ 
  title, 
  gradeDisplay,
  offset = 10,
  backgroundColor, 
  style, 
  topContent,
  bottomContent 
}: BaseCourseCardProps) {
  const theme = useTheme();
  const s = createStyles(theme);

  return (
    <View style={[s.cardBase, { backgroundColor }, style]}>

      <View style={[s.centerContainer, {marginTop: offset}]}>
        <Text style={s.letterGradeText}>{gradeDisplay}</Text>
      </View>

      {/* top left */}
      <View>
        <Text style={s.courseTitle} numberOfLines={1}>
          {title.toUpperCase() || "—"}
        </Text>
        {/* other things go here */}
        {topContent}
      </View>

      <View style={s.bottomContainer}>
        {bottomContent}
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  bottomContainer: {
    alignItems: 'center'
  },
  cardBase: {
    borderRadius: 22,
    padding: CARD_PADDING,
    justifyContent: 'space-between',
    position: 'relative',
  },
  centerContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseTitle: {
    color: theme.colors.textGrades,
    fontSize: 14,
    fontFamily: theme.fonts.title,
    letterSpacing: 0.5,
  },
  letterGradeText: {
    fontSize: 55,
    fontFamily: theme.fonts.gradeDisplay,
    color: theme.colors.textGrades,
    letterSpacing: -2,
  },
});