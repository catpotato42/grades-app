import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../styles/theme';

export const CARD_PADDING = 16;

interface BaseCourseCardProps {
  title: string;
  gradeDisplay: string; // The "Letter" or central focus
  backgroundColor: string;
  style: { width: number; height: number; [key: string]: any }; // Force size requirement
  children?: React.ReactNode; // For the "everything else is free" part
}

export default function BaseCourseCard({ 
  title, 
  gradeDisplay, 
  backgroundColor, 
  style, 
  children 
}: BaseCourseCardProps) {
  const theme = useTheme();
  const s = createStyles(theme);

  return (
    <View style={[s.cardBase, { backgroundColor }, style]}>
      {/* top left */}
      <View>
        <Text style={s.courseTitle} numberOfLines={1}>
          {title.toUpperCase() || "—"}
        </Text>
        {/* other things go here */}
        {children}
      </View>

      {/* center grade */}
      <View style={s.centerContainer}>
        <Text style={s.letterGradeText}>{gradeDisplay}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  cardBase: {
    borderRadius: 22,
    padding: CARD_PADDING,
    justifyContent: 'space-between',
  },
  courseTitle: {
    color: theme.colors.background,
    fontSize: 14,
    fontFamily: theme.fonts.title,
    letterSpacing: 0.5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterGradeText: {
    fontSize: 55,
    fontFamily: theme.fonts.gradeDisplay,
    color: theme.colors.background,
    letterSpacing: -2,
  },
});