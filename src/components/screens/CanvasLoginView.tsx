import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import * as SecureStore from 'expo-secure-store';
import { CanvasProvider } from '../../services/canvasProvider';
import { useTheme } from '../../styles/theme';
import Constants from 'expo-constants';

interface CanvasLoginProps {
  domain: string;
  onLoginSuccess: (data: any) => void;
  onCancel: () => void;
}

//stored in .env, only placeholder values for now
const CANVAS_CLIENT_ID = process.env.EXPO_PUBLIC_CANVAS_CLIENT_ID; 
const REDIRECT_URI = process.env.EXPO_PUBLIC_CANVAS_REDIRECT_URI;
const BACKEND_URL = process.env.EXPO_PUBLIC_PROXY_URL;

const SCOPES = encodeURIComponent("url:GET|/api/v1/courses url:GET|/api/v1/courses/:course_id/assignments");

export default function CanvasLoginView({ domain, onLoginSuccess, onCancel }: CanvasLoginProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processOAuthToken = async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      //validate the captured token
      const isValid = await CanvasProvider.login({ domain, token });
      if (!isValid) throw new Error("Authentication failed. Invalid token returned.");

      await SecureStore.setItemAsync('ACTIVE_PLATFORM', 'CANVAS');
      await SecureStore.setItemAsync('CANVAS_DOMAIN', domain);
      await SecureStore.setItemAsync('CANVAS_TOKEN', token);

      const fetchedData = await CanvasProvider.fetchData();
      onLoginSuccess(fetchedData);
    } catch (err: any) {
      setError(err.message || "Failed to connect to Canvas after authorization.");
    } finally {
      setLoading(false);
    }
  };

  const exchangeCodeForToken = async (code: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, domain }),
      });

      if (!response.ok) throw new Error("Failed to authenticate with backend.");

      const data = await response.json();
      
      await processOAuthToken(data.access_token); 
      
    } catch (err: any) {
      setError(err.message || "Failed to exchange code.");
      setLoading(false);
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;

    if (url.startsWith(REDIRECT_URI)) {
      // We look for ?code= instead of access_token=
      const codeMatch = url.match(/code=([^&]+)/);
      if (codeMatch && codeMatch[1]) {
        // Send the code to your backend!
        exchangeCodeForToken(codeMatch[1]);
      } else {
        setError("Authorization failed. No code received.");
      }
    }
  };

  const authUrl = `https://${domain}/login/oauth2/auth?client_id=${CANVAS_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`;
  
  if (loading) {
    return (
      <View style={[styles.webviewContainer, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.buttonPrimary} />
        <Text style={styles.statusText}>Connecting to {domain}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.webviewContainer, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onCancel}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.webviewContainer}>
      <View style={styles.cancelHeader}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel Login</Text>
        </TouchableOpacity>
      </View>
      <WebView 
        source={{ uri: authUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => (
           <ActivityIndicator style={styles.loader} size="large" color={theme.colors.buttonPrimary} />
        )}
        incognito={true} 
      />
    </View>
  );
}

//implement the theme-based stylesheet generator
const createStyles = (theme: any) => StyleSheet.create({
  cancelHeader: {
    padding: 16,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cancelText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontFamily: theme.fonts?.heading, 
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: theme.colors.gradeRed,
    fontSize: 16,
    fontFamily: theme.fonts?.heading,
    textAlign: 'center',
    marginBottom: 20,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -18,
    marginTop: -18,
  },
  retryButton: {
    backgroundColor: theme.colors.buttonPrimary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: theme.colors.background,
    fontFamily: theme.fonts?.heading,
    fontSize: 16,
  },
  statusText: {
    marginTop: 20,
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontFamily: theme.fonts?.body,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});