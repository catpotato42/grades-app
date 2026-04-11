import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../styles/theme';
import { AcademicData, Course, PastCourse } from '../../types';
import { SmoothSwitch } from '../elements/CustomSwitch';
import CourseItem from '../elements/CourseItem';

interface GPAViewProps {
  data: AcademicData;
}

type GPAType = 'Weighted' | 'Unweighted';

export default function GPAView({ data }: GPAViewProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [gpaType, setGpaType] = useState<GPAType>('Weighted');

  //track inclusion of each course by ID
  const [includedCourses, setIncludedCourses] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    data.courses.forEach(c => initialState[c.id] = true);
    data.pastCourses?.forEach(c => initialState[c.id] = true);
    return initialState;
  });

  //true even if only one past course is included.
  const isPastCoursesIncluded = data.pastCourses 
    ? data.pastCourses.some(c => includedCourses[c.id]) 
    : false;

  const handleTogglePastCourses = (val: boolean) => {
    setIncludedCourses(prev => {
      const next = { ...prev };
      data.pastCourses?.forEach(c => next[c.id] = val);
      return next;
    });
  };

  const handleToggleCourse = (id: string) => {
    setIncludedCourses(prev => ({ ...prev, [id]: !prev[id] }));
  };

  //numeric to letter if no letter given
  const convertNumericToLetter = (num?: number) => {
    if (num === undefined) return 'F';
    if (num >= 93) return 'A';
    if (num >= 90) return 'A-';
    if (num >= 87) return 'B+';
    if (num >= 83) return 'B';
    if (num >= 80) return 'B-';
    if (num >= 77) return 'C+';
    if (num >= 73) return 'C';
    if (num >= 70) return 'C-';
    if (num >= 67) return 'D+';
    if (num >= 60) return 'D';
    return 'F';
  };

  // GPA Calculation Logic
  const calculatedGPA = useMemo(() => {
    let totalQualityPoints = 0;
    let totalCredits = 0;

    const calculatePoints = (title: string, letter?: string, numeric?: number, credits: number = 1.0) => {
      //standard score calc
      let basePoint = 0.0;
      const gradeStr = letter || convertNumericToLetter(numeric);
      
      if (!gradeStr || gradeStr === 'N/A') return;

      if (gradeStr.startsWith('A')) basePoint = gradeStr.includes('-') ? 3.7 : 4.0;
      else if (gradeStr.startsWith('B')) basePoint = gradeStr.includes('+') ? 3.3 : gradeStr.includes('-') ? 2.7 : 3.0;
      else if (gradeStr.startsWith('C')) basePoint = gradeStr.includes('+') ? 2.3 : gradeStr.includes('-') ? 1.7 : 2.0;
      else if (gradeStr.startsWith('D')) basePoint = gradeStr.includes('+') ? 1.3 : 1.0;
      else if (gradeStr.startsWith('F')) basePoint = 0.0;
      else return;

      //add weight to AP/Honors courses
      let weightBonus = 0;
      if (gpaType === 'Weighted') {
        const upperTitle = title.toUpperCase();
        if (upperTitle.includes('AP ') || upperTitle.includes('IB ')) weightBonus = 1.0;
        else if (upperTitle.includes('HONORS') || upperTitle.includes('HON ')) weightBonus = 0.5;
      }

      totalQualityPoints += ((basePoint + weightBonus) * credits);
      totalCredits += credits;
    };

    //calculate gpa for all current courses
    data.courses.forEach(course => {
      if (!includedCourses[course.id]) return;
      //get grade for current term, first term if missing (SUBOPTIMAL, TODO: IMPROVE)
      const gradeObj = course.officialGrades[data.currentTerm] || Object.values(course.officialGrades)[0];
      if (gradeObj && (gradeObj.letter || gradeObj.numeric)) {
        calculatePoints(course.title, gradeObj.letter, gradeObj.numeric, 1.0); //assume 1 credit for current course
      }
    });

    //past course calcs
    data.pastCourses?.forEach(course => {
      if (!includedCourses[course.id]) return;
      if (course.letter || course.numeric) {
        calculatePoints(course.title, course.letter, course.numeric, course.credits);
      }
    });

    return totalCredits > 0 ? (totalQualityPoints / totalCredits) : 0.0;
  }, [data, includedCourses, gpaType]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {(['Weighted', 'Unweighted'] as GPAType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, gpaType === tab ? styles.tabButtonActive : styles.tabButtonInactive]}
              onPress={() => setGpaType(tab)}
            >
              <Text style={[styles.tabText, gpaType === tab && styles.tabTextActive]}>
                {tab} GPA
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.gpaDisplayContainer}>
        <Text style={styles.gpaNumber}>{calculatedGPA.toFixed(3)}</Text>
      </View>

      <ScrollView style={styles.listContainer}>
        <Text style={styles.sectionHeader}>Current Courses</Text>
        <View style={styles.itemsWrapper}>
          {data.courses.map((course) => (
            <CourseItem 
              key={course.id}
              course={course}
              isIncluded={!!includedCourses[course.id]}
              onToggle={() => handleToggleCourse(course.id)}
              theme={theme}
            />
          ))}
        </View>

        {data.pastCourses && data.pastCourses.length > 0 && (
          <>
            <View style={styles.pastCoursesHeader}>
              <Text style={styles.sectionHeader}>Past Courses</Text>
              <View style={styles.switchWrapper}>
                <Text style={styles.includeText}>Include</Text>
                <SmoothSwitch 
                  value={isPastCoursesIncluded} 
                  onValueChange={handleTogglePastCourses} 
                  theme={theme} 
                />
              </View>
            </View>
            
            <View style={styles.itemsWrapper}>
              {data.pastCourses.map((pastCourse) => (
                <CourseItem 
                  key={pastCourse.id}
                  course={pastCourse} //CourseItem handles both pastcourse and current course types? TODO
                  isIncluded={!!includedCourses[pastCourse.id]}
                  onToggle={() => handleToggleCourse(pastCourse.id)}
                  theme={theme}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || theme.colors.textSecondary,
    marginTop: 10,
    marginBottom: 15,
  },
  tabScroll: {
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginRight: 10,
    borderBottomWidth: 3,
    marginBottom: -1,
  },
  tabButtonInactive: {
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: theme.colors.textPrimary,
  },
  tabText: {
    fontSize: 15,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: theme.colors.textPrimary,
  },
  
  gpaDisplayContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  gpaNumber: {
    fontSize: 72,
    fontFamily: theme.fonts.title,
    color: theme.colors.textPrimary,
  },
  listContainer: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  pastCoursesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  includeText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginRight: 8,
  },
  itemsWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  }
});