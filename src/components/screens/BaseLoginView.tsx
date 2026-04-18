import React from 'react';
import { 
  StyleSheet, Text, TextInput, View, TouchableOpacity, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
  Keyboard, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../styles/theme';

interface BaseLoginViewProps {
  title: string;
  usernameLabel?: string; //"Username", "Email", "Student ID", etc.
  usernameValue: string;
  onUsernameChange: (val: string) => void;
  passwordValue: string;
  onPasswordChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
  children?: React.ReactNode; //new fields
}

export default function BaseLoginView({
  title,
  usernameLabel = "Username",
  usernameValue,
  onUsernameChange,
  passwordValue,
  onPasswordChange,
  onSubmit,
  isLoading,
  error,
  children
}: BaseLoginViewProps) {
  const theme = useTheme();
  const s = createStyles(theme);

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={s.flex}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={s.content}>
            <Text style={s.title}>{title}</Text>
            
            {error && <Text style={s.errorText}>{error}</Text>}

            {/* extra fields like state and district */}
            {children}

            <TextInput
              style={s.input}
              placeholder={usernameLabel}
              placeholderTextColor={theme.colors.textSecondary}
              value={usernameValue}
              onChangeText={onUsernameChange}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance={theme.dark ? 'dark' : 'light'}
            />

            <TextInput
              style={s.input}
              placeholder="Password"
              placeholderTextColor={theme.colors.textSecondary}
              value={passwordValue}
              onChangeText={onPasswordChange}
              secureTextEntry={true}
              keyboardAppearance={theme.dark ? 'dark' : 'light'}
            />

            <TouchableOpacity 
              activeOpacity={0.7}
              style={[s.button, isLoading && s.buttonDisabled]} 
              onPress={onSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.colors.background} />
              ) : (
                <Text style={s.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  button: {
    backgroundColor: theme.colors.buttonPrimary,
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontFamily: theme.fonts.heading,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40
  },
  errorText: {
    color: theme.colors.gradeRed,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: theme.fonts.heading,
  },
  flex: {
    flex: 1
  },
  input: {
    height: 50, borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: 25, fontSize: 16,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.fonts.title,
    marginBottom: 40,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
});