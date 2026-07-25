import { Id } from '@/convex/_generated/dataModel';
import { CheckCircle2, Circle, Edit2, Trash2 } from 'lucide-react-native';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { TodoItemData } from '../types/todo';

interface TodoItemProps {
  item: TodoItemData;
  onToggle: (id: Id<'todos'>) => void;
  onEdit: (id: Id<'todos'>, text: string) => void;
  onDelete: (id: Id<'todos'>) => void;
}

export const TodoItem: React.FC<TodoItemProps> = memo(({
  item,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.todoCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => onToggle(item._id)}
        style={styles.checkTouch}
        activeOpacity={0.7}
      >
        {item.isCompleted ? (
          <CheckCircle2 size={24} color={colors.success} />
        ) : (
          <Circle size={24} color={colors.textSecondary} />
        )}
      </TouchableOpacity>

      <Text
        style={[
          styles.todoText,
          { color: item.isCompleted ? colors.textSecondary : colors.text },
          item.isCompleted && styles.completedText,
        ]}
        numberOfLines={3}
      >
        {item.text}
      </Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={() => onEdit(item._id, item.text)}
          style={styles.actionBtn}
          activeOpacity={0.7}
        >
          <Edit2 size={18} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete(item._id)}
          style={styles.actionBtn}
          activeOpacity={0.7}
        >
          <Trash2 size={18} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

TodoItem.displayName = 'TodoItem';

const styles = StyleSheet.create({
  todoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  checkTouch: {
    marginRight: 12,
  },
  todoText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  actionBtn: {
    padding: 6,
  },
});
