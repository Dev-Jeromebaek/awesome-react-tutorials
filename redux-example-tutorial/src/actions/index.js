// import { INCREMENT, DECREMENT, SET_COLOR } from './actionTypes';
import * as types from './actionTypes';

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

export function setColor(color) {
  return {
    type: types.SET_COLOR,
    color,
  };
}
