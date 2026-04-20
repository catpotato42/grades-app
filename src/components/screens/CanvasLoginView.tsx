import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../styles/theme';
import BaseLoginView from './BaseLoginView';
import { CanvasProvider } from '../../services/canvasProvider';
import * as SecureStore from 'expo-secure-store';

interface CanvasLoginProps {
  onLoginSuccess: (data: any) => void;
}

export default function CanvasLoginView({ onLoginSuccess }: CanvasLoginProps) {
  const theme = useTheme();
  const [domain, setDomain] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!domain || !token) {
      setError("Please provide your Canvas domain and API token.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const isValid = await CanvasProvider.login({ domain, token });
      if (!isValid) throw new Error("Invalid domain or API token.");

      await SecureStore.setItemAsync('ACTIVE_PLATFORM', 'CANVAS');
      await SecureStore.setItemAsync('CANVAS_DOMAIN', domain);
      await SecureStore.setItemAsync('CANVAS_TOKEN', token);

      const fetchedData = await CanvasProvider.fetchData();
      onLoginSuccess(fetchedData);
    } catch (err: any) {
      setError(err.message || "Failed to connect to Canvas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseLoginView
      title="Canvas Login"
      usernameLabel="Canvas Domain (e.g., canvas.edu)"
      usernameValue={domain}
      onUsernameChange={setDomain}
      passwordValue={token}
      onPasswordChange={setToken}
      onSubmit={handleLogin}
      isLoading={loading}
      error={error}
    >
    </BaseLoginView>
  );
}