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

    const lowerSearch = searchText.trim().toLowerCase();
    const searchMatchedTodos: TodoItemData[] = [];
    let completed = 0;

    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i];

      //if filter is null or undefined, return all todos, and if any, filter by search text and return search result
      const matchesSearch =
        !lowerSearch || todo.text.toLowerCase().includes(lowerSearch);

      if (matchesSearch) {
        searchMatchedTodos.push(todo);
        if (todo.isCompleted) {
          completed++;
        }
      }
    }

    const total = searchMatchedTodos.length;
    const active = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const filteredTodos = searchMatchedTodos.filter((todo) => {
      if (filter === 'active') return !todo.isCompleted;
      if (filter === 'completed') return todo.isCompleted;
      return true;
    });

    return {
      filteredTodos,
      stats: { total, completed, active, percent },
    };
  }, [todos, searchText, filter]);
}
