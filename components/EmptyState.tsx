import { ListTodo } from 'lucide-react-native';
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { FilterType } from '../types/todo';

interface EmptyStateProps {
  searchText: string;
  filter: FilterType;
}

const EMPTY_MESSAGES: Record<FilterType, { title: string; subtitle: string }> = {
  all: { title: '할 일이 없습니다', subtitle: '새로운 할 일을 추가해 보세요!' },
  active: { title: '진행 중인 일이 없습니다', subtitle: '새로운 할 일을 추가해 보세요!' },
  completed: { title: '완료된 일이 없습니다', subtitle: '할 일을 완료해 보세요!' },
};

export const EmptyState: React.FC<EmptyStateProps> = memo(({ searchText, filter }) => {
  const { colors } = useTheme();

  const title = searchText ? '검색 결과가 없습니다' : EMPTY_MESSAGES[filter].title;
  const subtitle = searchText ? '다른 검색어를 입력해 보세요.' : EMPTY_MESSAGES[filter].subtitle;

  return (
    <View style={styles.emptyContainer}>
      <ListTodo size={56} color={colors.border} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{subtitle}</Text>
    </View>
  );
});

EmptyState.displayName = 'EmptyState';

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
  },
});
