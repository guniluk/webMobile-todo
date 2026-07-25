import { ListTodo, Moon, Sun } from 'lucide-react-native';
import React, { memo } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = memo(({ title = 'My Todos' }) => {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
      <View style={styles.headerLeft}>
        <ListTodo size={28} color={colors.primary} style={styles.headerIcon} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
      </View>

      <TouchableOpacity
        onPress={toggleTheme}
        style={[styles.iconButton, { backgroundColor: colors.background }]}
        activeOpacity={0.7}
        accessibilityLabel="Toggle Theme"
      >
        {isDark ? (
          <Sun color={colors.warning} size={20} />
        ) : (
          <Moon color={colors.text} size={20} />
        )}
      </TouchableOpacity>
    </View>
  );
});

Header.displayName = 'Header';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 54 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
