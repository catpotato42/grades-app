import React, { useState } from 'react';
import { Pressable, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../styles/theme'; // Adjust path if needed

interface RefreshButtonProps {
  onRefresh: () => Promise<void>;
}

export default function RefreshButton({ onRefresh }: RefreshButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const handlePress = async () => {
    setIsLoading(true);
    try {
      await onRefresh();
    } catch (error) {
      console.warn("Connection rejected/failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Pressable onPress={handlePress} disabled={isLoading} style={styles.button}>
      {isLoading ? (
        <ActivityIndicator color={theme.colors.textPrimary} />
      ) : (
        <Image 
          source={require('../../../assets/icons/refresh.png')} 
          style={[styles.icon, { tintColor: theme.colors.textPrimary }]} 
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  }
});