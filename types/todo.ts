import { Id } from '@/convex/_generated/dataModel';

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoItemData {
  _id: Id<'todos'>;
  text: string;
  isCompleted: boolean;
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  percent: number;
}
