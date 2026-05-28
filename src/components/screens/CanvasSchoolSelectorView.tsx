import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../styles/theme';

interface School {
  name: string;
  domain: string;
}

interface CanvasSchoolSelectorProps {
  onSelectSchool: (domain: string) => void;
  onCancel: () => void;
}

export default function CanvasSchoolSelectorView({ onSelectSchool, onCancel }: CanvasSchoolSelectorProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<School[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    
    if (text.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://canvas.instructure.com/api/v1/accounts/search?name=${encodeURIComponent(text)}`
      );
      if (response.ok) {
        const data = await response.json();
        const schools = data.map((s: any) => ({
          name: s.name,
          domain: s.domain
        }));
        setSearchResults(schools);
      }
    } catch (error) {
      console.error("Failed to fetch schools:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Find Your School</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for your university or school..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
        />
        {isSearching && (
          <ActivityIndicator 
            style={styles.spinner} 
            color={theme.colors.buttonPrimary} 
          />
        )}
      </View>

      <FlatList
        data={searchResults}
        keyExtractor={(item, index) => `${item.domain}-${index}`}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.schoolItem} 
            onPress={() => onSelectSchool(item.domain)}
          >
            <Text style={styles.schoolName}>{item.name}</Text>
            <Text style={styles.schoolDomain}>{item.domain}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          searchQuery.length >= 3 && !isSearching ? (
            <Text style={styles.emptyText}>No schools found. Try a different search term.</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  cancelButton: {
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textSecondary,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.body,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  placeholder: {
    width: 40, //balances back button so title stays centered
  },
  schoolDomain: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  schoolItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  schoolName: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontFamily: theme.fonts.body,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  spinner: {
    position: 'absolute',
    right: 35,
    top: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.title,
    color: theme.colors.textPrimary,
  },
});