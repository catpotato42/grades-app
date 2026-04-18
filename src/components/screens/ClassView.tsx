import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, Pressable, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Course, Assignment, Term } from '../../types';
import { useTheme } from '../../styles/theme';
import ClassCourseCard from '../elements/CourseCards/ClassCourseCard';
import DashCourseCard from '../elements/CourseCards/DashCourseCard';
import { calculateCourseGrade } from '../../utils/courseGradeCalc';
import AssignmentItem from '../elements/ListItems/AssignmentItem';
import AssignmentEditor from '../elements/AssignmentEditor';

const { width } = Dimensions.get('window');
const DUAL_VIEW_CARD_SIZE = width / 2;

interface ClassViewProps {
  course: Course;
  selectedTerm: string;
  terms: Term[];
  onBack: () => void;
}

export default function ClassView({ course, selectedTerm, terms, onBack }: ClassViewProps) {
  const theme = useTheme();
  //copy of Course data so we can edit in real time
  const [baseCourse, setBaseCourse] = useState<Course>(course); //baseline INCLUDING OFFSET
  const [localCourse, setLocalCourse] = useState<Course>(course); //mutable version
  const currentTermDef = terms.find((t: any) => (typeof t === 'string' ? t : t.id) === selectedTerm) as any;
  const activeTermIds = currentTermDef?.subTermIds || [selectedTerm];
  const isRelevantAssignment = (a: Assignment) => !a.termId || activeTermIds.includes(a.termId);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const styles = createStyles(theme);
  const [hasDiscrepancy, setHasDiscrepancy] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [ignoredIds, setIgnoredIds] = useState<Set<string>>(new Set());

  //logic to calculate discrepancy between calculated grade and official grade
  useEffect(() => {
    const official = course.officialGrades[selectedTerm]?.numeric;
    const termSpecificAssignments = course.assignments.filter(isRelevantAssignment);
    const initialCalc = calculateCourseGrade(termSpecificAssignments, course.categoryWeights);
    const currentDisplayGrade = initialCalc !== null ? Math.round(initialCalc) : null;
    
    if (official !== undefined && currentDisplayGrade != official) {
      setHasDiscrepancy(true);
      const validAssigns = termSpecificAssignments.filter(a => a.score !== undefined && a.totalPoints !== undefined);
      let targetScore = 0;
      let targetCategory = 'Calibration';
      let targetTotalPoints = 0;

      //if no assignments
      if (initialCalc === null) { 
        targetScore = official;
        targetTotalPoints = 100;
        if (course.categoryWeights && course.categoryWeights.length > 0) {
          targetCategory = course.categoryWeights[0].name;
        }
      } else if (course.categoryWeights && course.categoryWeights.length > 0) {
        //if it's a weights system, calculate points this way
        const firstCat = course.categoryWeights.find(cw => validAssigns.some(a => a.category === cw.name));
        if (firstCat) {
          targetCategory = firstCat.name;
          const catPossible = validAssigns.filter(a => a.category === firstCat.name).reduce((acc, a) => acc + (a.totalPoints! * (a.weight || 1)), 0);
          const weightRatio = firstCat.weight / course.categoryWeights.reduce((acc, cw) => acc + (validAssigns.some(a => a.category === cw.name) ? cw.weight : 0), 0);
          targetScore = (((official - initialCalc) / 100) / weightRatio) * catPossible;
        }
      } else {
        //if it's a total points system, calculate this way.
        const possible = validAssigns.reduce((acc, a) => acc + (a.totalPoints! * (a.weight || 1)), 0);
        const earned = validAssigns.reduce((acc, a) => acc + (a.score! * (a.weight || 1)), 0);
        targetScore = (official / 100) * possible - earned;
      }

      const offsetAssignment: Assignment = {
        id: 'sys-offset', 
        title: 'Offset Assignment', 
        termId: activeTermIds[activeTermIds.length - 1], //if an aggregator term uses last subterm
        category: targetCategory,
        score: parseFloat(targetScore.toFixed(2)), 
        totalPoints: targetTotalPoints, 
        isMock: true
      };

      setLocalCourse(prev => ({ ...prev, assignments: [...prev.assignments, offsetAssignment] }));
    }
  }, [course, selectedTerm]);

  //need a helper because you can't call hooks inside loops, conditions, etc.
  const getThemeGradeColor = (num: number | null) => {
    if (num === undefined || num === null) return theme.colors.gradeGrey;
    if (num >= 90) return theme.colors.gradeGreen;
    if (num >= 80) return theme.colors.gradeBlue;
    if (num >= 70) return theme.colors.gradeYellow;
    if (num >= 60) return theme.colors.gradeOrange;
    return theme.colors.gradeRed;
  };

  const toggleIgnore = (id: string) => {
    setIsEdited(true);
    setIgnoredIds(prev => {
      const newIgnore = new Set(prev);
      if (newIgnore.has(id)) newIgnore.delete(id);
      else newIgnore.add(id);
      return newIgnore;
    });
  };

  const handleAddAssignment = () => {
    setIsEdited(true);
    const newAssign: Assignment = {
      id: 'mock-' + Date.now(),
      title: 'New Assignment',
      category: localCourse.categoryWeights?.[0]?.name || 'Uncategorized',
      score: 100,
      totalPoints: 100,
      isMock: true,
      termId: activeTermIds[activeTermIds.length - 1]
    };
    //next assignments go at the bottom
    setLocalCourse(prev => ({ ...prev, assignments: [...prev.assignments, newAssign] }));
  };

  //text input.
  const updateAssignmentField = (field: 'score' | 'totalPoints', newVal?: number) => {
    setIsEdited(true);
    setLocalCourse(prev => ({
      ...prev,
      assignments: prev.assignments.map(a => 
        a.id === selectedAssignment?.id ? { ...a, [field]: newVal } : a
      )
    }));
    setSelectedAssignment(prev => prev ? { ...prev, [field]: newVal } : prev);
  };

  const displayAssignments = localCourse.assignments.filter(isRelevantAssignment);
  //live rendering, edits show up immediately
  const liveGradeCalc = calculateCourseGrade(displayAssignments, localCourse.categoryWeights, ignoredIds);

  const renderCourse: Course = {
    ...localCourse,
    officialGrades: {
      ...localCourse.officialGrades,
      [selectedTerm]: {
        numeric: liveGradeCalc !== null ? Math.round(liveGradeCalc) : undefined,
        letter: liveGradeCalc !== null ? localCourse.officialGrades[selectedTerm]?.letter : undefined 
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, display: selectedAssignment ? 'none' : 'flex' }}>
        <Pressable 
          onPress={onBack} 
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <View 
          style={styles.titleContainer}
          pointerEvents="box-none"
        >
            {hasDiscrepancy ? (
              <Text style={styles.alertText}>Calculated grade based on assignments differs from official, so offset assignment was created to resolve discrepancy. Report this bug 
              with a screenshot and your grade platform (e.g. Skyward, Powerschool, etc.) at simon.a.harrington@gmail.com</Text>
            ) : (
              <Text style={styles.titleText}>Class View</Text>
            )}
        </View>

        <View style={styles.cardContainer}>
          {isEdited ? (
            <View style={styles.dualCardRow}>
              {/* dashboard, scaled to fit */}
              <View style={styles.cardWrapper}>
                <DashCourseCard 
                  courseName={baseCourse.title}
                  grade={baseCourse.officialGrades[selectedTerm]?.numeric}
                  letterGrade={baseCourse.officialGrades[selectedTerm]?.letter}
                  period={baseCourse.period?.toString()}
                  teacher={baseCourse.teacher}
                  onPress={() => {}}
                  size={DUAL_VIEW_CARD_SIZE}
                />
              </View>
              
              <Text style={styles.arrowText}>→</Text>
              
              {/* scaled down */}
              <View style={styles.cardWrapper}>
                <ClassCourseCard course={renderCourse} selectedTerm={selectedTerm} size={DUAL_VIEW_CARD_SIZE} />
              </View>
            </View>
          ) : (
            //default before edits
            <ClassCourseCard course={renderCourse} selectedTerm={selectedTerm} />
          )}
        </View>

        <ScrollView style={styles.assignmentsContainer} contentContainerStyle={styles.assignmentsScroll} showsVerticalScrollIndicator={false}>
          {displayAssignments.map((assignment) => {
            const isIgnored = ignoredIds.has(assignment.id);
            const percentage = (assignment.score !== undefined && assignment.totalPoints !== undefined && assignment.totalPoints > 0) 
              ? Math.round((assignment.score / assignment.totalPoints) * 100) : null;
            
            const isOffset = assignment.id === 'sys-offset';
            const barColor = (isIgnored || isOffset) ? theme.colors.gradeGrey : getThemeGradeColor(percentage);
            const origAssign = baseCourse.assignments.find(a => a.id === assignment.id);

            return (
              <AssignmentItem 
                key={assignment.id}
                assignment={assignment}
                originalAssignment={origAssign}
                isIgnored={isIgnored}
                barColor={barColor}
                theme={theme}
                onToggleIgnore={toggleIgnore}
                onSelect={setSelectedAssignment}
              />
            );
          })}
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddAssignment}>
             <Text style={styles.addButtonText}>+ Add Assignment</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {selectedAssignment && (
        <AssignmentEditor 
          assignment={selectedAssignment}
          originalAssignment={baseCourse.assignments.find(a => a.id === selectedAssignment.id)}
          theme={theme}
          onBack={() => setSelectedAssignment(null)}
          onUpdateField={updateAssignmentField}
        />
      )}
    </View>
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
    fontSize: 21,
  },
  titleContainer: {
    top: '17%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
});