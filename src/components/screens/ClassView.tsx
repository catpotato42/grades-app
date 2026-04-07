import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, Pressable, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Course, Assignment } from '../../types';
import { useTheme } from '../../styles/theme';
import ClassCourseCard from '../elements/ClassCourseCard';
import DashCourseCard from '../elements/DashCourseCard';
import { calculateCourseGrade } from '../../utils/courseGradeCalc';
import AssignmentItem from '../elements/AssignmentItem';
import AssignmentEditor from '../elements/AssignmentEditor';

const { width } = Dimensions.get('window');
const DUAL_VIEW_CARD_SIZE = width / 2;

interface ClassViewProps {
  course: Course;
  selectedTerm: string;
  onBack: () => void;
}

export default function ClassView({ course, selectedTerm, onBack }: ClassViewProps) {
  const theme = useTheme();
  //copy of Course data so we can edit in real time
  const [baseCourse, setBaseCourse] = useState<Course>(course); //baseline INCLUDING OFFSET
  const [localCourse, setLocalCourse] = useState<Course>(course); //mutable version
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const styles = createStyles(theme);
  const [hasDiscrepancy, setHasDiscrepancy] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [ignoredIds, setIgnoredIds] = useState<Set<string>>(new Set());

  //logic to calculate discrepancy between calculated grade and official grade
  useEffect(() => {
    const official = course.officialGrades[selectedTerm]?.numeric;
    const initialCalc = calculateCourseGrade(course.assignments, course.categoryWeights);
    const currentDisplayGrade = initialCalc !== null ? Math.round(initialCalc) : null;
    
    if (official !== undefined && currentDisplayGrade != official) {
      setHasDiscrepancy(true);
      const validAssigns = course.assignments.filter(a => a.score !== undefined && a.totalPoints !== undefined);
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
        id: 'sys-offset', title: 'Offset Assignment', category: targetCategory,
        score: parseFloat(targetScore.toFixed(2)), totalPoints: targetTotalPoints, isMock: true
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
      isMock: true
    };
    //next assignments go at the bottom
    setLocalCourse(prev => ({ ...prev, assignments: [...prev.assignments, newAssign] }));
  };

  //text input. It would be great if someone refactored this file into more files... oh...
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

  //typing
  const handleTextChange = (text: string) => {
    if (text === '') {
      updateAssignmentField('score', 0);
      return;
    }
    const num = parseFloat(text);
    if (!isNaN(num)) updateAssignmentField('score', num);
  };

  // NEW: Re-uses the generic function for typing the Max Points
  const handleMaxPointsChange = (text: string) => {
    if (text === '') {
      updateAssignmentField('totalPoints', undefined);
      return;
    }
    const num = parseFloat(text);
    if (!isNaN(num)) updateAssignmentField('totalPoints', num);
  };

  const handleSliderChange = (val: number) => {
    updateAssignmentField('score', Math.round(val * 10) / 10);
  };

  //live rendering, edits show up immediately
  const liveGradeCalc = calculateCourseGrade(localCourse.assignments, localCourse.categoryWeights, ignoredIds);
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
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <View style={[styles.backButton, {top: 80, left: 0}]}>
            {hasDiscrepancy && (
                <Text style={styles.alertText}> Calculated grade based on assignments differs from official, so offset assignment was created to resolve discrepancy. Report this bug 
                with a screenshot and your grade platform (e.g. Skyward, Powerschool, etc.) at simon.a.harrington@gmail.com</Text>
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

        <ScrollView 
          style={styles.assignmentsContainer}
          contentContainerStyle={styles.assignmentsScroll}
          showsVerticalScrollIndicator={false}
        >
          {localCourse.assignments?.map((assignment) => {
            const earned = assignment.score;
            const possible = assignment.totalPoints;
            const isIgnored = ignoredIds.has(assignment.id);
            
            const percentage = (earned !== undefined && possible !== undefined && possible > 0) 
              ? Math.round((earned / possible) * 100) 
              : null;

            const barColor = isIgnored ? theme.colors.gradeGrey : getThemeGradeColor(percentage);

            return (
              <View key={assignment.id} style={styles.assignmentRow}>

                {/* Toggle Ignore */}
                <TouchableOpacity onPress={() => toggleIgnore(assignment.id)} style={styles.checkBox}>
                  {!isIgnored && <Text style={styles.checkText}>✓</Text>}
                </TouchableOpacity>

                {/* Assignment Bar */}
                <TouchableOpacity 
                  //if it's ignored turns it a slightly darker grey to differentiate
                  style={[styles.assignmentBar, { backgroundColor: barColor, opacity: isIgnored ? 0.6 : 1 }]}
                  onPress={() => setSelectedAssignment(assignment)}
                >
                  <Text style={[styles.assignmentTitle]} numberOfLines={1}>
                    {assignment.title}
                  </Text>
                  <Text style={[styles.assignmentScore]}>
                    {percentage !== null ? `${percentage}%` : '-%'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}

          <TouchableOpacity style={styles.addButton} onPress={handleAddAssignment}>
             <Text style={styles.addButtonText}>+ Add Assignment</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>

      {selectedAssignment && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.background }]}>
          <Pressable onPress={() => setSelectedAssignment(null)} style={styles.backButton}>
            <Text style={styles.backText}>← Back to {course.title}</Text>
          </Pressable>
          
          <View style={styles.editorContent}>
             <Text style={styles.editorTitle} numberOfLines={2}>
               {selectedAssignment.title}
             </Text>
             
             {/* Slider & Inputs */}
             <View style={styles.editRow}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  //max is either max points or where input is currently set.
                  maximumValue={Math.max(selectedAssignment.totalPoints || 100, selectedAssignment.score || 0, 1)}
                  value={selectedAssignment.score ?? 0}
                  onSlidingComplete={handleSliderChange}
                  minimumTrackTintColor={theme.colors.textPrimary}
                  maximumTrackTintColor={theme.colors.surface}
                  thumbTintColor={theme.colors.textPrimary}
                />

                <View style={styles.inputContainer}>
                  <TextInput 
                    style={styles.inputText}
                    keyboardType="numeric"
                    value={selectedAssignment.score !== undefined ? String(selectedAssignment.score) : ""}
                    onChangeText={handleTextChange}
                    placeholder="0"
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                  
                  <Text style={styles.slashText}>/</Text>
                  
                  <TextInput 
                    style={[styles.inputText, { color: theme.colors.textSecondary }]}
                    keyboardType="numeric"
                    value={selectedAssignment.totalPoints !== undefined ? String(selectedAssignment.totalPoints) : ""}
                    onChangeText={handleMaxPointsChange}
                    placeholder="0"
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
             </View>
          </View>
        </View>
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
    padding: 10,
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
    marginTop: 8, 
    fontFamily: theme.fonts.heading,
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
  checkBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.colors.textSecondary,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
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
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.colors.surface,
    borderStyle: 'dashed',
    marginTop: 10,
  },
  addButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.heading,
    fontSize: 16,
  },
  assignmentTitle: {
    color: theme.colors.textGrades,
    fontFamily: theme.fonts.heading,
    fontSize: 15,
    flex: 1,
    paddingRight: 10,
  },
  assignmentScore: {
    color: theme.colors.textGrades,
    fontFamily: theme.fonts.heading,
    fontSize: 16,
  },
  editorContent: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  editorTitle: { 
    color: theme.colors.textPrimary, 
    fontSize: 20, 
    fontFamily: theme.fonts.heading 
  },
  editorSub: { 
    color: theme.colors.textSecondary, 
    marginTop: 10 
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  slider: {
    flex: 1,
    height: 40,
    marginRight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputText: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontFamily: theme.fonts.heading,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.textSecondary,
    minWidth: 45,
    textAlign: 'center',
    paddingBottom: 2,
  },
  slashText: {
    color: theme.colors.textSecondary,
    fontSize: 24,
    fontFamily: theme.fonts.heading,
    marginHorizontal: 8,
    paddingBottom: 2,
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
});