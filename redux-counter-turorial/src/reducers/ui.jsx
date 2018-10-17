import * as types from '../actions/ActionTypes';

const initialState = {
  color: [0, 0, 0],
};

export default function ui(state = initialState, action) {
  if (action.type === types.CHANGE_COLOR) {
    return {
      color: action.color,
    };
  }
  if (action.type === types.INITIALIZE) {
    return {
      color: initialState.color,
    };
  }
  return state;
}
