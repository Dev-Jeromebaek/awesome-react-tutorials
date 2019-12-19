import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

// 액션들의 타입스크립트 타입 준비
// type TodosAction =
//   | ReturnType<typeof addTodo>
//   | ReturnType<typeof toggleTodo>
//   | ReturnType<typeof removeTodo>;
export type TodosAction = ActionType<typeof actions>;

// 상태를 위한 타입 선언
export type Todo = {
  id: number;
  text: string;
  done: boolean;
};

export type TodosState = Todo[];