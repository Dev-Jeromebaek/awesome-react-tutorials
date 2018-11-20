import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

const FOCUS_INPUT = 'ui/write/FOCUS_INPUT';
const BLUR_INPUT = 'ui/write/BLUR_INPUT';
const CHANGE_INPUT = 'ui/write/CHANGE_INPUT';
const RESET_INPUT = 'ui/write/RESET_INPUT';

const OPEN_VIEWER = 'ui/memo/OPEN_VIEWER';
const CLOSE_VIEWER = 'ui/memo/CLOSE_VIEWER';
const CHANGE_VIEWER_INPUT = 'ui/memo/CHANGE_VIEWER_INPUT';

export const focusInput = createAction(FOCUS_INPUT);
export const blurInput = createAction(BLUR_INPUT);
export const changeInput = createAction(CHANGE_INPUT); // { name, value }
export const resetInput = createAction(RESET_INPUT);

export const openViewer = createAction(OPEN_VIEWER); // memo
export const closeViewer = createAction(CLOSE_VIEWER);
export const changeViewerInput = createAction(CHANGE_VIEWER_INPUT); // { name, value }

const initialState = Map({
  write: Map({
    focused: false,
    title: '',
    body: '',
  }),
  memo: Map({
    open: false,
    info: Map({
      id: null,
      title: null,
      body: null,
    }),
  }),
});

export default handleActions(
  {
    // --------------- MEMO WRITE
    [FOCUS_INPUT]: state => state.setIn(['write', 'focused'], true),
    [BLUR_INPUT]: state => state.setIn(['write', 'focused'], false),
    [CHANGE_INPUT]: (state, action) => {
      const { name, value } = action.payload;
      return state.setIn(['write', name], value);
    },
    [RESET_INPUT]: state => state.set('write', initialState.get('write')),
    // --------------- MEMO VIEWER
    [OPEN_VIEWER]: (state, action) =>
      state
        .setIn(['memo', 'open'], true)
        .setIn(['memo', 'info'], action.payload),
    [CLOSE_VIEWER]: (state, action) => state.setIn(['memo', 'open'], false),
    [CHANGE_VIEWER_INPUT]: (state, action) => {
      const { name, value } = action.payload;
      return state.setIn(['memo', 'info', name], value);
    },
  },
  initialState,
);
