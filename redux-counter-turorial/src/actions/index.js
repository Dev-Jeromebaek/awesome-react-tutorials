// 액션 생성자

// 파일 이름이 index인 이유는
// action 폴더만 불러왔을 때 자동으로 index로 접근하게끔 설정되어 있다.

// default 가 아닌 const 와 같이 다른 방법으로 export 시키면,
// 불러올 때, 비구조화 할당 문법을 사용하거나 * 를 사용하여 import 시켜줘야 한다.
// 방법 1.
// 예시) import { INCREMENT, DECREMENT, ... } from './ActionTypes';
// 방법 2.
// 예시) import * as types from './ActionTypes';

import * as types from './ActionTypes';

export function increment() {
  return {
    type: types.INCREMENT,
  };
}

export function decrement() {
  return {
    type: types.DECREMENT,
  };
}

export function initialize() {
  return {
    type: types.INITIALIZE,
    number: 0,
  };
}

export function changeColor(color) {
  return {
    type: types.CHANGE_COLOR,
    color: color,
  };
}
