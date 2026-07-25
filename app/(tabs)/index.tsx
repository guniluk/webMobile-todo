import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  EditTodoModal,
  EmptyState,
  FilterSection,
  Header,
  StatsCard,
  TodoInput,
  TodoItem,
} from '../../components';
import { useFilteredTodos } from '../../hooks/useFilteredTodos';
import { useTheme } from '../../hooks/useTheme';
import { FilterType, TodoItemData } from '../../types/todo';

export default function HomeScreen() {
  const { colors } = useTheme();

  // Convex Queries & Mutations
  const todos = useQuery(api.todos.getTodos) as TodoItemData[] | undefined;
  const addTodo = useMutation(api.todos.addTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const updateTodo = useMutation(api.todos.updateTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  // Local States
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingTodo, setEditingTodo] = useState<{ id: Id<'todos'>; text: string } | null>(null);
  const [editText, setEditText] = useState('');

  // Single pass Filter & Stats Hook
  const { filteredTodos, stats } = useFilteredTodos(todos, searchText, filter);

  // Handlers
  const handleAddTodo = useCallback(async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await addTodo({ text: trimmed });
      setInputText('');
      Keyboard.dismiss();
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  }, [inputText, addTodo]);

  const handleToggle = useCallback(async (id: Id<'todos'>) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await toggleTodo({ id });
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  }, [toggleTodo]);

  const handleDelete = useCallback((id: Id<'todos'>) => {
    Alert.alert('삭제 확인', '이 할 일을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await deleteTodo({ id });
          } catch (error) {
            console.error('Failed to delete todo:', error);
          }
        },
      },
    ]);
  }, [deleteTodo]);

  const openEditModal = useCallback((id: Id<'todos'>, currentText: string) => {
    Haptics.selectionAsync();
    setEditingTodo({ id, text: currentText });
    setEditText(currentText);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingTodo) return;
    const trimmed = editText.trim();
    if (!trimmed) return;

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await updateTodo({ id: editingTodo.id, text: trimmed });
      setEditingTodo(null);
      setEditText('');
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  }, [editingTodo, editText, updateTodo]);

  const renderTodoItem = useCallback(
    ({ item }: { item: TodoItemData }) => (
      <TodoItem
        item={item}
        onToggle={handleToggle}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />
    ),
    [handleToggle, openEditModal, handleDelete]
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header />

      <View style={styles.mainContent}>
        <StatsCard stats={stats} />

        <TodoInput
          inputText={inputText}
          setInputText={setInputText}
          onAddTodo={handleAddTodo}
        />

        <FilterSection
          searchText={searchText}
          setSearchText={setSearchText}
          filter={filter}
          setFilter={setFilter}
          stats={stats}
        />

        {todos === undefined ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              목록을 불러오는 중...
            </Text>
          </View>
        ) : filteredTodos.length === 0 ? (
          <EmptyState searchText={searchText} filter={filter} />
        ) : (
          <FlatList
            data={filteredTodos}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listPadding}
            renderItem={renderTodoItem}
          />
        )}
      </View>

      <EditTodoModal
        visible={!!editingTodo}
        editText={editText}
        setEditText={setEditText}
        onSave={handleSaveEdit}
        onClose={() => setEditingTodo(null)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listPadding: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 12,
  },
});
