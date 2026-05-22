import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import * as SecureStore from 'expo-secure-store';
import BaseLoginView from './BaseLoginView';
import { CanvasProvider } from '../../services/canvasProvider';
import { useTheme } from '../../styles/theme';

interface CanvasLoginProps {
  onLoginSuccess: (data: any) => void;
}

// TODO replace with actual Canvas Developer Credentials
const CANVAS_CLIENT_ID = 'YOUR_CLIENT_ID'; 
const REDIRECT_URI = 'academic-sync://oauth-callback';

export default function CanvasLoginView({ onLoginSuccess }: CanvasLoginProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWebView, setShowWebView] = useState(false);

  const handleDomainSubmit = () => {
    if (!domain) {
      setError("Please provide your Canvas domain.");
      return;
    }
    //clean up domain input (remove https:// or trailing slashes)
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    setDomain(cleanDomain);
    setShowWebView(true);
  };

  const processOAuthToken = async (token: string) => {
    setShowWebView(false);
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

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;

    if (url.startsWith(REDIRECT_URI)) {
      const tokenMatch = url.match(/access_token=([^&]+)/);
      if (tokenMatch && tokenMatch[1]) {
        processOAuthToken(tokenMatch[1]);
      } else {
        setShowWebView(false);
        setError("Authorization failed. No token received.");
      }
    }
  };

  if (showWebView) {
    const authUrl = `https://${domain}/login/oauth2/auth?client_id=${CANVAS_CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}`;
    
    return (
      <View style={styles.webviewContainer}>
        <View style={styles.cancelHeader}>
          <TouchableOpacity onPress={() => setShowWebView(false)}>
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

  return (
    <BaseLoginView
      title="Canvas Login"
      usernameLabel="Canvas Domain (e.g., canvas.edu)"
      usernameValue={domain}
      onUsernameChange={setDomain}
      passwordValue=""
      onPasswordChange={() => {}}
      onSubmit={handleDomainSubmit}
      isLoading={loading}
      error={error}
    />
  );
}

//implement the theme-based stylesheet generator
const createStyles = (theme: any) => StyleSheet.create({
  webviewContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -18,
    marginTop: -18,
  },
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
  }
});