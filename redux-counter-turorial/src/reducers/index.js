// 리듀서
// 변화를 일으키는 함수
// 리듀서는 순수해야함
// 1. 비동기 작업 x
// 2. 인수 변경 x
// 3. 동일한 인수 = 동일한 결과
// 이전 상태와 액션을 받아서 다음 상태를 반환한다.
// (previousState, action) => newState
// 이전 상태를 변경하는게 아님.
// 그저 새로운 상태를 반환 하는 것!
// 기존 상태를 복사하고 변화를 준 다음 복사된 상태를 반환

import { combineReducers } from 'redux';
import counter from './counter';
import ui from './ui';

const reducers = combineReducers({
  counter,
  ui,
});

export default reducers;
