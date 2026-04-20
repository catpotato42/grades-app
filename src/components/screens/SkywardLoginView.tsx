// src/components/screens/SkywardLoginView.tsx
import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../styles/theme';
import BaseLoginView from './BaseLoginView';
import { SkywardProvider } from '../../services/skywardProvider';
import * as SecureStore from 'expo-secure-store';

interface SkywardLoginProps {
  onLoginSuccess: (data: any) => void;
}

export default function SkywardLoginView({ onLoginSuccess }: SkywardLoginProps) {
  const theme = useTheme();
  const s = createStyles(theme);

  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const success = await SkywardProvider.login({ username, password });
      if (!success) throw new Error("Invalid credentials.");
      await SecureStore.setItemAsync('ACTIVE_PLATFORM', 'SKYWARD');
      const fetchedData = await SkywardProvider.fetchData();
      onLoginSuccess(fetchedData);
    } catch (err: any) {
      setError(err.message || "Failed to login to Skyward.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseLoginView
      title="Skyward Login"
      usernameLabel="Login ID"
      usernameValue={username}
      onUsernameChange={setUsername}
      passwordValue={password}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
      isLoading={loading}
      error={error}
    >
      <TextInput
        style={s.input}
        placeholder="State"
        placeholderTextColor={theme.colors.textSecondary}
        value={state}
        onChangeText={setState}
        autoCapitalize="words"
        autoCorrect={false}
        keyboardAppearance={theme.dark ? 'dark' : 'light'}
      />
      <TextInput
        style={s.input}
        placeholder="District"
        placeholderTextColor={theme.colors.textSecondary}
        value={district}
        onChangeText={setDistrict}
        autoCapitalize="words"
        autoCorrect={false}
        keyboardAppearance={theme.dark ? 'dark' : 'light'}
      />
    </BaseLoginView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  input: {
    height: 50, 
    borderBottomWidth: 1, 
    borderBottomColor: theme.colors.border,
    marginBottom: 25, 
    fontSize: 16, 
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
});