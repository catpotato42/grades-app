import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkywardDataBridge } from '../../services/skywardDataBridge';
import { Theme } from '../../styles/theme';

export default function LoginView({ onLoginSuccess }: { onLoginSuccess: (data: any) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const fetchedData = await SkywardDataBridge.login(username, password);
      onLoginSuccess(fetchedData); //trigger next screen with data
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <Text style={styles.title}>Skyward Login</Text>
            
            {error && <Text style={styles.errorText}>{error}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={Theme.colors.textSecondary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Theme.colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />

            <TouchableOpacity 
              activeOpacity={0.7}
              style={[styles.button, loading && styles.buttonPressed]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Theme.colors.textPrimary} />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: Theme.fonts.title,
    marginBottom: 40,
    color: Theme.colors.textPrimary,
    textAlign: 'center',
  },
  errorText: {
    color: Theme.colors.gradeRed,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: Theme.fonts.body,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    marginBottom: 25,
    fontSize: 16,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.textPrimary,
  },
  button: {
    backgroundColor: Theme.colors.buttonPrimary,
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonPressed: {
    backgroundColor: Theme.colors.buttonSecondary,
  },
  buttonText: {
    color: Theme.colors.background,
    fontSize: 16,
    fontFamily: Theme.fonts.heading,
  },
});