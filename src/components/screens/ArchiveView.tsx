import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../styles/theme';
import { AcademicData, Course } from '../../types';
import ArchiveCourseItem from '../elements/ListItems/ArchiveCourseItem';
import DashCourseCard from '../elements/CourseCards/DashCourseCard';

const { width } = Dimensions.get('window');

interface ArchiveViewProps {
  data: AcademicData;
}

export default function ArchiveView({ data }: ArchiveViewProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);

  const currentYearTermIds = data.terms.map(t => t.id);
  const archivedCourses = data.courses.filter(c => 
    !currentYearTermIds.some(id => c.officialGrades[id])
  );
  const majorTerms = [...data.terms]
    .filter(t => !t.subTermIds || t.subTermIds.length === 0)
    .reverse();
  const archivedCoursesByTerm = archivedCourses.reduce((acc, course) => {
    const termName = course.termTitle || "Other Terms";
    if (!acc[termName]) acc[termName] = [];
    acc[termName].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  if (selectedCourse && selectedTermId) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Pressable onPress={() => setSelectedCourse(null)} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText} numberOfLines={1}>{selectedCourse.title}</Text>
        </View>
        <View style={styles.cardContainer}>
          <View style={styles.cardWrapper}>
            <DashCourseCard 
              courseName={selectedCourse.title}
              grade={selectedCourse.officialGrades[selectedTermId]?.numeric}
              letterGrade={selectedCourse.officialGrades[selectedTermId]?.letter}
              period={selectedCourse.period?.toString()}
              teacher={selectedCourse.teacher}
              onPress={() => {}}
              size={width / 2}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.screenTitleContainer}>
        <Text style={styles.screenTitleText}>Archive</Text>
      </View>
      
      <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
        {/* Current Courses */}
        {majorTerms.map(term => {
          const termCourses = data.courses.filter(course => {
            const gradeData = course.officialGrades[term.id];
            return gradeData && (gradeData.numeric !== undefined || gradeData.letter !== undefined);
          });

          if (termCourses.length === 0) return null;

          return (
            <View key={term.id} style={styles.section}>
              <Text style={styles.sectionHeader}>{term.title}</Text>
              {termCourses.map(course => (
                <ArchiveCourseItem
                  key={`${term.id}-${course.id}`}
                  course={course}
                  termId={term.id}
                  onPress={() => {
                    setSelectedCourse(course);
                    setSelectedTermId(term.id);
                  }}
                />
              ))}
            </View>
          );
        })}

        {/* Past Courses */}
        {Object.entries(archivedCoursesByTerm).map(([termName, courses]) => (
          <View key={termName} style={styles.section}>
            <Text style={styles.sectionHeader}>{termName}</Text>
            {courses.map(course => (
              <ArchiveCourseItem
                key={`archived-${course.id}`}
                course={course}
                termId="FINAL"
                onPress={() => {
                  setSelectedCourse(course);
                  setSelectedTermId("FINAL");
                }}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 17,
    padding: 20,
    zIndex: 10,
  },
  backText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.heading,
    fontSize: 16,
  },
  cardContainer: {
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  alertText: { 
    color: theme.colors.gradeRed, 
    fontSize: 12, 
    marginTop: -10,
    marginLeft: 5,
    fontFamily: theme.fonts.heading,
    zIndex: 0,
  },
  assignmentsContainer: {
    position: 'absolute',
    top: '55%',
    left: 0,
    right: 0,
    bottom: 0,
  },
  assignmentsScroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  assignmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    marginTop: 10,
  },
  addButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.heading,
    fontSize: 16,
  },
  dualCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardWrapper: {
    transform: [{ scale: 0.85 }],
    marginHorizontal: -15,
  },
  arrowText: {
    fontSize: 24,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.heading,
    marginHorizontal: 5,
  },
  titleText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.title,
    fontSize: 30,
  },
  titleContainer: {
    top: '10%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  courseTitle: {
    fontSize: 32,
    fontFamily: theme.fonts.title,
    color: theme.colors.textPrimary,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 15,
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: theme.fonts?.heading,
    color: theme.colors.textPrimary,
    marginBottom: 10,
    marginTop: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  screenTitleContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    zIndex: 1,
  },
  screenTitleText: {
    fontSize: 32,
    fontFamily: theme.fonts.title,
    color: theme.colors.textPrimary,
  },
});