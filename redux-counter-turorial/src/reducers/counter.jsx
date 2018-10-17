import * as types from '../actions/ActionTypes';

const initialState = {
  number: 0,
  testObject: {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
  },
};

export default function counter(state = initialState, action) {
  /* ... */

  switch (action.type) {
    case types.INCREMENT:
      return {
        ...state,
        number: state.number + 1,
        testObject: { ...state.testObject, c: 0 },
      };
    case types.DECREMENT:
      return { ...state, number: state.number - 1 };
    case types.INITIALIZE:
      return { ...state, number: initialState.number };
    default:
      return state;
  }
}
