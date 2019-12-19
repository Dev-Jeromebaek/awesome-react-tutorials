import { TodosState, TodosAction } from "./types";
import { createReducer } from "typesafe-actions";
import { ADD_TODO, TOGGLE_TODO, REMOVE_TODO } from "./actions";

// 초깃값 설정
const initialState: TodosState = [
  { id: 1, text: '타입스크립트 배우기', done: true },
  { id: 2, text: '타입스크립트와 리더스 함께 사용해보기', done: true },
  { id: 3, text: '투두리스트 만들기', done: false }
];

// function todos(state: TodosState = initialState, action: TodosAction): TodosState {
//   switch (action.type) {
//     case ADD_TODO:
//       const nextId = Math.max(...state.map(todo => todo.id)) + 1;
//       return state.concat({
//         id: nextId,
//         text: action.payload,
//         done: false
//       });
//     case TOGGLE_TODO:
//       return state.map(todo =>
//         todo.id === action.payload ? { ...todo, done: !todo.done } : todo
//       );
//     case REMOVE_TODO:
//       return state.filter(todo => todo.id !== action.payload);
//     default:
//       return state;
//   }
// }
const todos = createReducer<TodosState, TodosAction>(initialState, {
  // action 객체를 구조 분해(Object Destructuring) 함으로써 payload의 이름을 원하는 이름으로 바꿔줄 수 있다.
  [ADD_TODO]: (state, { payload: text }) =>
    state.concat({
      id: Math.max(...state.map(todo => todo.id)) + 1,
      text,
      done: false
    }),
  [TOGGLE_TODO]: (state, { payload: id }) =>
    state.map(todo => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
  [REMOVE_TODO]: (state, { payload: id }) =>
    state.filter(todo => todo.id !== id)
});


export default todos;