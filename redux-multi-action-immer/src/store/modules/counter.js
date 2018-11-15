import produce from 'immer'; // **** immer 불러오기

// ------------------------------------
// Constants
// ------------------------------------
const CHANGE_COLOR = 'counter/CHANGE_COLOR';
const INCREMENT = 'counter/INCREMENT';
const DECREMENT = 'counter/DECREMENT';

// ------------------------------------
// Actions
// ------------------------------------
export const changeColor = color => ({ type: CHANGE_COLOR, color });
export const increment = () => ({ type: INCREMENT });
export const decrement = () => ({ type: DECREMENT });

// ------------------------------------
// Specialized Action Creator
// ------------------------------------
// export const updateLocation = ({ dispatch }) => {
//   return (nextLocation) => dispatch(locationChange(nextLocation));
// };

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  color: 'red',
  number: 0,
};

// **** 내부 업데이트 로직 모두 수정
export default function counter(state = initialState, action) {
  switch (action.type) {
    case CHANGE_COLOR:
      return produce(state, draft => {
        draft.color = action.color;
      })
    case INCREMENT:
      return produce(state, draft => {
        draft.number++;
      });
    case DECREMENT:
      return produce(state, draft => {
        draft.number--;
      })
    default:
      return state;
  }
}
