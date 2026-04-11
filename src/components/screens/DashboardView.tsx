import React, { useState, useSyncExternalStore } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../styles/theme';
import { AppSettings } from '../../config/settings';
import DashCourseCard from '../elements/DashCourseCard';
import { AcademicData, Course } from '../../types';
import ClassView from './ClassView';

interface DashboardProps {
  data: AcademicData;
}

export default function DashboardView({ data }: DashboardProps) {
  if (!data) return null;
  //destructure wrapper (weird syntax imo)
  const { courses, terms, currentTerm } = data;
  const initialTermId = typeof currentTerm === 'string' ? currentTerm : (currentTerm as any).id;
  const [selectedTerm, setSelectedTerm] = useState(initialTermId);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const theme = useTheme();
  const styles = createStyles(theme);
  const settings = useSyncExternalStore(AppSettings.subscribe, AppSettings.getSnapshot);

  const filteredCourses = courses.filter(course => {
    //course.officialGrades is a set, so if we have term data for this term
    //and we have a letter or numeric value for that grade, we "have data" for that course.
    const termData = course.officialGrades[selectedTerm];
    const hasData = termData && (termData.numeric !== undefined || termData.letter !== undefined);
    
    if (!hasData && !settings.colorblindMode) return false;
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, display: selectedCourse ? 'none' : 'flex' }}>
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
            {terms.map((termDef) => {
              const isSelected = selectedTerm === termDef.id;
              const isAvailable = courses.some(c => c.officialGrades[termDef.id]);

              return (
                <TouchableOpacity
                  key={termDef.id}
                  style={[styles.tabButton, isSelected ? styles.tabButtonActive : styles.tabButtonInactive]}
                  onPress={() => isAvailable && setSelectedTerm(termDef.id)}
                  disabled={!isAvailable}
                >
                  <Text style={[
                    styles.tabText,
                    isSelected && styles.tabTextActive,
                    !isAvailable && styles.tabTextUnavailable
                  ]}>
                    {termDef.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.scrollContainer}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => {
            //use official grade, offset is only calculated inside ClassView
            const termGrade = item.officialGrades?.[selectedTerm]; 

            return (
              <DashCourseCard 
                courseName={item.title}
                grade={termGrade?.numeric}
                letterGrade={termGrade?.letter}
                period={item.period?.toString()}
                teacher={item.teacher}
                onPress={() => setSelectedCourse(item)}
              />
            );
          }}
        />
      </View>

      {selectedCourse && (
        <View style={StyleSheet.absoluteFill}>
          <ClassView 
            course={selectedCourse} 
            selectedTerm={selectedTerm}
            terms={terms}
            onBack={() => setSelectedCourse(null)} 
          />
        </View>
      )}

    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabContainer: {
    //continuous thin line across the screen
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.textSecondary, 
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
    //thick line is always there but transparent unless active
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
    //by default light gray
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  tabTextActive: {
    //white
    color: theme.colors.textPrimary,
  },
  tabTextUnavailable: {
    //darker gray
    color: theme.colors.textUnavailable, 
  },

  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  }
});