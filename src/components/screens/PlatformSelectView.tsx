import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../styles/theme';

export type PlatformId = 'skyward' | 'canvas' | 'powerschool';

interface PlatformSelectProps {
  onSelectPlatform: (platform: PlatformId) => void;
}

export default function PlatformSelectView({ onSelectPlatform }: PlatformSelectProps) {
  const theme = useTheme();
  const s = createStyles(theme);

  const platforms = [
    { id: 'skyward' as PlatformId, name: 'Skyward', available: true },
    { id: 'canvas' as PlatformId, name: 'Canvas', available: false },
    { id: 'powerschool' as PlatformId, name: 'PowerSchool', available: false },
  ];

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <Text style={s.headerTitle}>Select Your System</Text>
        <Text style={s.subHeader}>Choose your school's grading platform to continue.</Text>

        <ScrollView style={s.listContainer}>
          {platforms.map((platform) => (
            <TouchableOpacity
              key={platform.id}
              style={[s.button, !platform.available && s.buttonDisabled]}
              onPress={() => platform.available && onSelectPlatform(platform.id)}
              disabled={!platform.available}
              activeOpacity={0.7}
            >
              <Text style={[s.buttonText, !platform.available && s.buttonTextDisabled]}>
                {platform.name}
              </Text>
              {!platform.available && <Text style={s.comingSoon}>Coming Soon</Text>}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: theme.fonts.title,
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginBottom: 40,
  },
  listContainer: {
    flex: 1,
  },
  button: {
    backgroundColor: theme.colors.surface,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  buttonTextDisabled: {
    color: theme.colors.textUnavailable,
  },
  comingSoon: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
});