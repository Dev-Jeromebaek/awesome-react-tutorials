import { createAction, handleActions } from 'redux-actions';
import produce from 'immer'; // **** Immer 불러오기

// ------------------------------------
// Constants
// ------------------------------------
const CHANGE_INPUT = 'waiting/CHANGE_INPUT'; // 인풋 값 변경
const CREATE = 'waiting/CREATE'; // 명단에 이름 추가
const ENTER = 'waiting/ENTER'; // 입장
const LEAVE = 'waiting/LEAVE'; // 나감

// ------------------------------------
// Actions
// ------------------------------------

// **** FSA 규칙을 따르는 액션 생성 함수 정의
// export const changeInput = text => ({ type: CHANGE_INPUT, payload: text });
// export const create = text => ({ type: CREATE, payload: text });
// export const enter = id => ({ type: ENTER, payload: id });
// export const leave = id => ({ type: LEAVE, payload: id });

let id = 3;
// **** createAction 으로 액션 만들기
export const changeInput = createAction(CHANGE_INPUT, text => text);
export const create = createAction(CREATE, text => ({ text, id: id++ }));
export const enter = createAction(ENTER, id => id);
export const leave = createAction(LEAVE, id => id);

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  input: '',
  list: [
    {
      id: 0,
      name: '홍길동',
      entered: true,
    },
    {
      id: 1,
      name: '콩쥐',
      entered: false,
    },
    {
      id: 2,
      name: '팥쥐',
      entered: false,
    },
  ],
};

// **** handleActions 로 리듀서 함수 작성
// **** 내부 업데이트 로직 모두 업데이트
export default handleActions(
  {
    [CHANGE_INPUT]: (state, action) => 
      produce(state, draft => {
        draft.input = action.payload;
      }),
    [CREATE]: (state, action) => 
      produce(state, draft => {
        draft.list.push({
          id: action.payload.id,
          name: action.payload.text,
          entered: false,
        });
      }),
    [ENTER]: (state, action) => 
      produce(state, draft => {
        const item = draft.list.find(item => item.id === action.payload);
        item.entered = !item.entered;
      }),
    [LEAVE]: (state, action) => 
      produce(state, draft => {
        draft.list.splice(
          draft.list.findIndex(item => item.id === action.payload),
          1
        )
      })
  },
  initialState,
);
