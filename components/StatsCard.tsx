import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { TodoStats } from '../types/todo';

interface StatsCardProps {
  stats: TodoStats;
}

export const StatsCard: React.FC<StatsCardProps> = memo(({ stats }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.statsHeader}>
        <View>
          <Text style={[styles.statsTitle, { color: colors.text }]}>진행 상황</Text>
          <Text style={[styles.statsSubtitle, { color: colors.textSecondary }]}>
            {stats.completed} / {stats.total} 완료 ({stats.percent}%)
          </Text>
        </View>
      </View>

      <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressBarFill,
            { backgroundColor: colors.primary, width: `${stats.percent}%` },
          ]}
        />
      </View>
    </View>
  );
});

StatsCard.displayName = 'StatsCard';

const styles = StyleSheet.create({
  statsCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  statsSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
