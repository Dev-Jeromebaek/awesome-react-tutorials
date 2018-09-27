import * as types from '../actions/actionTypes';

const initialState = {
  number: 0,
  trash: 'trash',
  trashObject: {
    t: 0,
    r: 1,
    a: 2,
    s: 3,
    h: 4,
  },
};

// export default function counter(state, action) {
//   if (typeof state === 'undefined') {
//     return initialState;
//   }
// }
export default function counter(state = initialState, action) {
  switch (action.type) {
    case types.INCREMENT:
      return {
        ...state,
        number: state.number + 1,
        trashObject: { ...state.trashObject, a: 0 },
      };
    case types.DECREMENT:
      return { ...state, number: state.number - 1 };
    default:
      return state;
  }
}
