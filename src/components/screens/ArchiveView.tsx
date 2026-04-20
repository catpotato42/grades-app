import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../styles/theme';
import { AcademicData, Course } from '../../types';
import ArchiveCourseItem from '../elements/ListItems/ArchiveCourseItem';
import ArchiveCourseCard from '../elements/CourseCards/ArchiveCourseCard';
import ArchiveAssignmentItem from '../elements/ListItems/ArchiveAssignmentItem';

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
    const termAssignments = selectedCourse.assignments.filter(
      a => a.termId === selectedTermId
    );
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
            <ArchiveCourseCard
              course= {selectedCourse}
              selectedTerm={selectedTermId}
              fontSizeMult={1.5}
              size={ width / 1.5 }
            />
          </View>
          <ScrollView style={styles.assignmentsContainer} contentContainerStyle={styles.assignmentsScroll}>
            <Text style={styles.absencesText}>
              Overall Absences: {selectedCourse.absences ?? 'Unknown'}
            </Text>
            <Text style={[styles.absencesText, { marginTop: 15, marginBottom: 15 }]}>
              Assignments:
            </Text>
            {termAssignments.length === 0 && (
              <Text style={[styles.absencesText, { marginTop: 0 }]}>-</Text>
            )}

            {termAssignments.map(assignment => (
              <ArchiveAssignmentItem 
                key={assignment.id} 
                assignment={assignment} 
              />
            ))}
          </ScrollView>
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
  absencesText: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    textAlign: 'center',
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
  alertText: { 
    color: theme.colors.gradeRed, 
    fontSize: 12, 
    marginTop: -10,
    marginLeft: 5,
    fontFamily: theme.fonts.heading,
    zIndex: 0,
  },
  arrowText: {
    fontSize: 24,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.heading,
    marginHorizontal: 5,
  },
  assignmentsContainer: {
    flex: 1,
    width: '100%',
  },
  assignmentsScroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
  cardWrapper: {
    transform: [{ scale: 0.85 }],
    marginHorizontal: -15,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  courseTitle: {
    fontSize: 32,
    fontFamily: theme.fonts.title,
    color: theme.colors.textPrimary,
  },
  dualCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleContainer: {
    top: '10%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  titleText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.title,
    fontSize: 30,
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
});