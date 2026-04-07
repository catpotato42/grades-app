import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { Assignment } from '../../types';

interface AssignmentEditorProps {
  assignment: Assignment;
  theme: any;
  onBack: () => void;
  onUpdateField: (field: 'score' | 'totalPoints', val?: number) => void;
}

export default function AssignmentEditor({ assignment, theme, onBack, onUpdateField }: AssignmentEditorProps) {
  const styles = createStyles(theme);

  const handleTextChange = (text: string) => {
    if (text === '') return onUpdateField('score', undefined);
    const num = parseFloat(text);
    if (!isNaN(num)) onUpdateField('score', num);
  };

  const handleMaxPointsChange = (text: string) => {
    if (text === '') return onUpdateField('totalPoints', undefined);
    const num = parseFloat(text);
    if (!isNaN(num)) onUpdateField('totalPoints', num);
  };

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.background }]}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Save & Return</Text>
      </Pressable>
      
      <View style={styles.editorContent}>
        <Text style={styles.editorTitle} numberOfLines={2}>{assignment.title}</Text>
        
        <View style={styles.editRow}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={Math.max(assignment.totalPoints || 100, assignment.score || 0, 1)}
            value={assignment.score ?? 0}
            onSlidingComplete={(val) => onUpdateField('score', Math.round(val * 10) / 10)}
            minimumTrackTintColor={theme.colors.textPrimary}
            maximumTrackTintColor={theme.colors.surface}
            thumbTintColor={theme.colors.textPrimary}
          />

          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.inputText} keyboardType="numeric"
              value={assignment.score !== undefined ? String(assignment.score) : ""}
              onChangeText={handleTextChange} placeholder="0" placeholderTextColor={theme.colors.textSecondary}
            />
            <Text style={styles.slashText}>/</Text>
            <TextInput 
              style={[styles.inputText, { color: theme.colors.textSecondary }]} keyboardType="numeric"
              value={assignment.totalPoints !== undefined ? String(assignment.totalPoints) : ""}
              onChangeText={handleMaxPointsChange} placeholder="0" placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  backButton: { 
    position: 'absolute',
    top: 60,
    left: 17,
    padding: 10,
    zIndex: 10
  },
  backText: { 
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.heading,
    fontSize: 16
  },
  editorContent: { 
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  editorTitle: { 
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    textAlign: 'center',
    marginBottom: 40
  },
  editRow: { 
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  slider: { 
    flex: 1,
    height: 40,
    marginRight: 20
  },
  inputContainer: { 
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  inputText: { 
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontFamily: theme.fonts.heading,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.textSecondary,
    minWidth: 45,
    textAlign: 'center',
    paddingBottom: 2
  },
  slashText: { 
    color: theme.colors.textSecondary,
    fontSize: 24,
    fontFamily: theme.fonts.heading,
    marginHorizontal: 8,
    paddingBottom: 2
  },
});