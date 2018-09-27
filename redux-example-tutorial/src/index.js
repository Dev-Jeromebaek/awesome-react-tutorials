import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import { createStore } from 'redux';
// import reducers from './reducers/index.js';
// index라는 파일을 불러오는 것이기 때문에 뒤에 index.js 를 적어주지 않아도 됨.
import reducers from './reducers';

import { Provider } from 'react-redux';

const store = createStore(reducers);

/*
import * as actions from './actions';
// 테스트용
console.log(store.getState());
// subscribe : store 가 변경될때 실행됨.
const unsubscribe = store.subscribe(() => console.log(store.getState()));
store.dispatch(actions.increment());
store.dispatch(actions.increment());
store.dispatch(actions.decrement());
store.dispatch(actions.setColor([200, 200, 200]));

unsubscribe();

store.dispatch(actions.setColor([210, 210, 210]));
*/
const rootElement = document.getElementById('root');
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement,
);
