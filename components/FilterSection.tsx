import * as Haptics from 'expo-haptics';
import { Search, X } from 'lucide-react-native';
import React, { memo } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { FilterType, TodoStats } from '../types/todo';

interface FilterSectionProps {
  searchText: string;
  setSearchText: (text: string) => void;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  stats: TodoStats;
}

const TABS: { type: FilterType; label: string }[] = [
  { type: 'all', label: '전체' },
  { type: 'active', label: '진행 중' },
  { type: 'completed', label: '완료됨' },
];

export const FilterSection: React.FC<FilterSectionProps> = memo(({
  searchText,
  setSearchText,
  filter,
  setFilter,
  stats,
}) => {
  const { colors } = useTheme();

  const getTabCount = (type: FilterType) => {
    if (type === 'active') return stats.active;
    if (type === 'completed') return stats.completed;
    return stats.total;
  };

  return (
    <View style={styles.filterSection}>
      {/* Search Box */}
      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Search size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="검색어 입력..."
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText ? (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map(({ type, label }) => {
          const isActive = filter === type;
          const count = getTabCount(type);

          return (
            <TouchableOpacity
              key={type}
              onPress={() => {
                Haptics.selectionAsync();
                setFilter(type);
              }}
              style={[
                styles.tabItem,
                isActive
                  ? { backgroundColor: colors.primary }
                  : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                {label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

FilterSection.displayName = 'FilterSection';

const styles = StyleSheet.create({
  filterSection: {
    marginBottom: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
