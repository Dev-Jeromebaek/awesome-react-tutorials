// const CHANGE_COLOR = 'counter/CHANGE_COLOR';
// const INCREMENT = 'counter/INCREMENT';
// const DECREMENT = 'counter/DECREMENT';

// ------------------------------------
// Constants
// ------------------------------------
export const CHANGE_COLOR = 'counter/CHANGE_COLOR';
export const INCREMENT = 'counter/INCREMENT';
export const DECREMENT = 'counter/DECREMENT';

// ------------------------------------
// Actions
// ------------------------------------
export const changeColor = (color) => ({ type: CHANGE_COLOR, color });
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
}

export default function counter(state = initialState, action) {
  switch (action.type) {
    case CHANGE_COLOR:
      return {
        ...state,
        color: action.color,
      };
    case INCREMENT:
      return {
        ...state,
        number: state.number + 1,
      };
    case DECREMENT:
      return {
        ...state,
        number: state.number -1,
      };
    default:
      return state;
  }
}
