import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, removeTodo } from '../modules/todos';

export default function useTodoActions(id: number) {
  const dispatch = useDispatch();

  const onToggle = useCallback(() => dispatch(toggleTodo(id)), [dispatch, id]);
  const onRemove = useCallback(() => dispatch(removeTodo(id)), [dispatch, id]);

  return { onToggle, onRemove };
}