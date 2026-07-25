import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import * as Haptics from 'expo-haptics';
import {
  AlertTriangle,
  BarChart2,
  CheckCircle2,
  Clock,
  ListTodo,
  Moon,
  Sun,
  Trash2,
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeMode, useTheme } from '../../hooks/useTheme';

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: 'light', label: '라이트 모드', icon: Sun },
  { mode: 'dark', label: '다크 모드', icon: Moon },
];

const SettingsScreen = () => {
  const { colors, themeMode, setThemeMode } = useTheme();

  // Convex Queries & Mutations
  //! useQuery is executed right away when this screen is loaded. so you can use todos variable without loading check
  const todos = useQuery(api.todos.getTodos);

  const clearAllTodos = useMutation(api.todos.clearAllTodos);

  // Compute Stats
  const stats = useMemo(() => {
    if (!todos) return { total: 0, completed: 0, active: 0, percent: 0 };
    const total = todos.length;
    const completed = todos.filter((t) => t.isCompleted).length;
    const active = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, active, percent };
  }, [todos]);

  // Handle Clear All Todos in Danger Zone
  const handleClearAllData = () => {
    if (!todos || todos.length === 0) {
      Alert.alert('알림', '삭제할 할 일이 없습니다.');
      return;
    }

    Alert.alert(
      '⚠️ 모든 데이터 비우기',
      '정말 저장된 모든 할 일을 삭제하시겠습니까?\n이 작업은 다시 복구할 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '전체 삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              const result = await clearAllTodos({});
              Alert.alert(
                '완료',
                `${result.deletedCount}개의 할 일이 모두 삭제되었습니다.`,
              );
            } catch (error) {
              console.error('Failed to clear all todos:', error);
              Alert.alert('오류', '데이터 삭제에 실패했습니다.');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      {/* Progress Stats 블럭 (상단 위치) */}
      <View
        style={[
          styles.statsCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.statsCardHeader}>
          <BarChart2
            size={20}
            color={colors.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.statsCardTitle, { color: colors.text }]}>
            Progress Stats
          </Text>
        </View>

        {/* 3가지 핵심 지표 그리드 */}
        <View style={styles.metricsGrid}>
          {/* Total Todos */}
          <View
            style={[styles.metricBox, { backgroundColor: colors.background }]}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <ListTodo size={18} color={colors.primary} />
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {stats.total}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Total Todos
            </Text>
          </View>

          {/* Active */}
          <View
            style={[styles.metricBox, { backgroundColor: colors.background }]}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: colors.warning + '20' },
              ]}
            >
              <Clock size={18} color={colors.warning} />
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {stats.active}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Active
            </Text>
          </View>

          {/* Completed */}
          <View
            style={[styles.metricBox, { backgroundColor: colors.background }]}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: colors.success + '20' },
              ]}
            >
              <CheckCircle2 size={18} color={colors.success} />
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {stats.completed}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Completed
            </Text>
          </View>
        </View>

        {/* Progress Bar & Percent Footer */}
        <View style={styles.progressFooter}>
          <View style={styles.progressLabelRow}>
            <Text
              style={[styles.progressText, { color: colors.textSecondary }]}
            >
              Completion Rate
            </Text>
            <Text style={[styles.percentText, { color: colors.primary }]}>
              {stats.percent}%
            </Text>
          </View>
          <View
            style={[
              styles.progressBarTrack,
              { backgroundColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                { backgroundColor: colors.primary, width: `${stats.percent}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* 테마 설정 섹션 */}
      <View
        style={[
          styles.section,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Theme Settings
        </Text>
        <View style={styles.optionsContainer}>
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = themeMode === option.mode;
            return (
              <TouchableOpacity
                key={option.mode}
                style={[
                  styles.optionButton,
                  {
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected
                      ? colors.primaryLight
                      : colors.surface,
                  },
                ]}
                onPress={() => setThemeMode(option.mode)}
                activeOpacity={0.7}
              >
                <Icon
                  color={isSelected ? colors.primary : colors.textSecondary}
                  size={20}
                />
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: isSelected ? colors.primary : colors.text,
                      fontWeight: isSelected ? '600' : '400',
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Danger Zone (위험 구역) 섹션 */}
      <View
        style={[styles.dangerSection, { borderColor: colors.error + '40' }]}
      >
        <View style={styles.dangerHeader}>
          <AlertTriangle
            size={20}
            color={colors.error}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.dangerTitle, { color: colors.error }]}>
            Danger Zone
          </Text>
        </View>
        <Text
          style={[styles.dangerDescription, { color: colors.textSecondary }]}
        >
          데이터베이스에 저장된 모든 할 일 데이터를 영구적으로 삭제합니다.
        </Text>

        <TouchableOpacity
          onPress={handleClearAllData}
          style={[styles.dangerButton, { backgroundColor: colors.error }]}
          activeOpacity={0.8}
        >
          <Trash2 size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  statsCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  statsCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  progressFooter: {
    marginTop: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  percentText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  section: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
  },
  dangerSection: {
    borderRadius: 14,
    padding: 18,
    borderWidth: 1.5,
    backgroundColor: '#FF3B300B',
    marginTop: 'auto',
    marginBottom: 20,
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dangerDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
