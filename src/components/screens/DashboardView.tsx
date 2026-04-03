import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../styles/theme';
import { AppSettings } from '../../config/settings';
import CourseCard, { cardPadding } from '../elements/CourseCard';
import { SkywardData, Course } from '../../types';

interface DashboardProps {
  data: SkywardData;
}

export default function DashboardView({ data }: DashboardProps) {
  if (!data) return null;
  //destructure wrapper (weird syntax imo)
  const { courses, availableTerms, currentTerm } = data;
  const [selectedTerm, setSelectedTerm] = useState(currentTerm);

  const filteredCourses = courses.filter(course => {
    //course.grades is a set, so if we have term data for this term
    //and we have both a letter and a numeric value for that grade, we "have data" for that course.
    const termData = course.grades[selectedTerm];
    const hasData = termData && (termData.numeric !== undefined || termData.letter !== undefined);
    
    if (!hasData && !AppSettings.showClassesWithNoData) return false;
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {availableTerms.map((term) => {
            const isSelected = selectedTerm === term;
            const isAvailable = courses.some(c => c.grades[term]);

            return (
              <TouchableOpacity
                key={term}
                style={[styles.tabButton, isSelected ? styles.tabButtonActive : styles.tabButtonInactive]}
                onPress={() => isAvailable && setSelectedTerm(term)}
                disabled={!isAvailable}
              >
                <Text style={[
                  styles.tabText,
                  isSelected && styles.tabTextActive,
                  !isAvailable && styles.tabTextUnavailable
                ]}>
                  {term}
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
          const termGrade = item.grades?.[selectedTerm]; 

          return (
            <CourseCard 
              courseName={item.title} 
              grade={termGrade?.numeric} 
              letterGrade={termGrade?.letter}
              period={item.period?.toString()}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  tabContainer: {
    //continuous thin line across the screen
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.textSecondary, 
    marginTop: 10,
    marginBottom: 15,
  },
  tabScroll: {
    paddingHorizontal: cardPadding,
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
    borderBottomColor: Theme.colors.textPrimary,
  },
  tabText: {
    fontSize: 15,
    fontFamily: Theme.fonts.heading,
    //by default light gray
    color: Theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  tabTextActive: {
    //white
    color: Theme.colors.textPrimary,
  },
  tabTextUnavailable: {
    //darker gray
    color: Theme.colors.textUnavailable, 
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