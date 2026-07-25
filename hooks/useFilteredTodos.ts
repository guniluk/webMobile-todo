import { useMemo } from 'react';
import { FilterType, TodoItemData, TodoStats } from '../types/todo';

export function useFilteredTodos(
  todos: TodoItemData[] | undefined,
  searchText: string,
  filter: FilterType,
) {
  return useMemo(() => {
    if (!todos) {
      return {
        filteredTodos: [] as TodoItemData[],
        stats: { total: 0, completed: 0, active: 0, percent: 0 } as TodoStats,
      };
    }

    let completed = 0;
    const lowerSearch = searchText.toLowerCase();
    const filteredTodos: TodoItemData[] = [];

    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i];
      if (todo.isCompleted) completed++;

      const matchesSearch =
        !lowerSearch || todo.text.toLowerCase().includes(lowerSearch);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !todo.isCompleted) ||
        (filter === 'completed' && todo.isCompleted);

      if (matchesSearch && matchesFilter) {
        filteredTodos.push(todo);
      }
    }

    const total = todos.length;
    const active = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      filteredTodos,
      stats: { total, completed, active, percent },
    };
  }, [todos, searchText, filter]);
}
