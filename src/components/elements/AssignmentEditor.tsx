import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { Assignment } from '../../types';

interface AssignmentEditorProps {
  assignment: Assignment;
  originalAssignment?: Assignment;
  theme: any;
  onBack: () => void;
  onUpdateField: (field: 'score' | 'totalPoints', val?: number) => void;
}

export default function AssignmentEditor({ assignment, originalAssignment, theme, onBack, onUpdateField }: AssignmentEditorProps) {
    const styles = createStyles(theme);
    const [scoreText, setScoreText] = React.useState(String(assignment.score ?? ""));

    React.useEffect(() => {
        setScoreText(String(assignment.score ?? ""));
    }, [assignment.score]);

    const handleTextChange = (text: string) => {
        setScoreText(text);
        if (text === '' || text === '.') return onUpdateField('score', undefined);
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
            <Text style={styles.backText}>← Back to Course</Text>
        </Pressable>
        
        <View style={styles.editorContent}>
            <Text style={styles.editorTitle} numberOfLines={2}>{assignment.title}</Text>
            
            <View style={styles.editRow}>
            
            <Slider
                key={assignment.id}
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
                <View>
                    {originalAssignment?.score !== undefined && originalAssignment.score !== assignment.score && (
                        <Text style={styles.originalScoreText}>
                            {originalAssignment.score}
                        </Text>
                    )}
                    <TextInput 
                    style={styles.inputText} 
                    keyboardType="decimal-pad"
                    keyboardAppearance={theme.dark ? 'dark' : 'light'}
                    value={scoreText}
                    onChangeText={handleTextChange}
                    placeholder="0"
                    placeholderTextColor={theme.colors.textSecondary}
                    />
                </View>
                
                <Text style={styles.slashText}>/</Text>
                <TextInput 
                style={[styles.inputText, { color: theme.colors.textSecondary }]} 
                keyboardType="decimal-pad"
                keyboardAppearance={theme.dark ? 'dark' : 'light'}
                value={assignment.totalPoints !== undefined ? String(assignment.totalPoints) : ""}
                onChangeText={handleMaxPointsChange}
                placeholder="0"
                placeholderTextColor={theme.colors.textSecondary}
                />
            </View>
            </View>

            {assignment.comment && (
                <View style={styles.commentContainer}>
                    <Text style={styles.commentLabel}>Comment:</Text>
                    <ScrollView style={styles.commentScroll} showsVerticalScrollIndicator={true}>
                    <Text style={styles.commentText}>{assignment.comment}</Text>
                    </ScrollView>
                </View>
            )}

            {/*
            {assignment.comment &&... 
            
            OR

            <View style={styles.commentContainer}>
                <Text style={styles.commentLabel}>Comment</Text>
                <ScrollView style={styles.commentScroll} showsVerticalScrollIndicator={true}>
                <Text style={styles.commentText}>{assignment.comment || "N/A"}</Text>
                </ScrollView>
            </View>
            */}
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
  commentContainer: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 15,
    maxHeight: 200,
    marginTop: 20,
  },
  commentLabel: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontFamily: theme.fonts.heading,
    marginBottom: 8,
  },
  commentScroll: {
    width: '100%',
  },
  commentText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontFamily: theme.fonts.body,
    lineHeight: 20,
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
    paddingBottom: 2,
  },
  originalScoreText: {
    position: 'absolute',
    top: -30,
    width: '100%',
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.heading,
    fontSize: 24,
  },
  slashText: { 
    color: theme.colors.textSecondary,
    fontSize: 24,
    fontFamily: theme.fonts.heading,
    marginHorizontal: 8,
    paddingBottom: 2
  },
});