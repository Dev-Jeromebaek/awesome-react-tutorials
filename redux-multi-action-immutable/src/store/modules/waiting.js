import { createAction, handleActions } from 'redux-actions';
import { List, Map } from 'immutable'; // **** Immutable 의  List 와 Map 불러오기

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
const initialState = Map({
  input: '',
  list: List([
    Map({
      id: 0,
      name: '홍길동',
      entered: true
    }),
    Map({
      id: 1,
      name: '콩쥐',
      entered: false
    }),
    Map({
      id: 2,
      name: '팥쥐',
      entered: false
    })
  ])
});

// **** handleActions 로 리듀서 함수 작성
// **** 내부 업데이트 로직 모두 Immutable 내장함수로 변경
export default handleActions(
  {
    [CHANGE_INPUT]: (state, action) => state.set('input', action.payload),
    [CREATE]: (state, action) =>
      // list 값을 조회한다음에
      state.update('list', list =>
        // list 에 새로운 Map 을 추가
        list.push(
          Map({
            id: action.payload.id,
            name: action.payload.text,
            entered: false
          })
        )
      ),
    [ENTER]: (state, action) => {
      // 인덱스를 찾고
      const index = state
        .get('list')
        .findIndex(item => item.get('id') === action.payload);
      // 특정 인덱스의 entered 필드 값을 반전
      return state.updateIn(['list', index, 'entered'], entered => !entered);
    },
    [LEAVE]: (state, action) => {
      // 인덱스를 찾고
      const index = state
        .get('list')
        .findIndex(item => item.get('id') === action.payload);
      return state.deleteIn(['list'], index); // 특정 인덱스 제거
    }
  },
  initialState
);
