# Reaect SSR

### 3. redux-saga를 사용한 서버 사이드 렌더링

- redux-saga를 사용하는 경우 서버 사이드 렌더링을 어떻게 해야 하는지 알아보자.

1. `redux-saga` 코드 준비하기

   `$ yarn add react-saga`

2) `redux-saga`를 사용하여 특정 사용자의 정보를 가져오기

   ```javascript
   // src/modules/users.js

   import axios from 'axios';
   import { call, put, takeEvery } from 'redux-saga';

   const GET_USERS_PENDING = 'users/GET_USERS_PENDING';
   const GET_USERS_SUCCESS = 'users/GET_USERS_SUCCESS';
   const GET_USERS_FAILURE = 'userx/GET_USERS_FAILURE';
   // ----- 추가 -----
   const GET_USER = 'users/GET_USER';
   const GET_USER_SUCCESS = 'users/GET_USER_SUCCESS';
   const GET_USER_FAILURE = 'users/GET_USER_FAILURE';

   const getUsersPending = () => ({ type: GET_USERS_PENDING });
   const getUsersSuccess = payload => ({ type: GET_USERS_SUCCESS, payload });
   const getUsersFailure = payload => ({
     type: GET_USERS_FAILURE,
     error: true,
     payload,
   });
   // ----- 추가 -----
   export const getUser = id => ({ type: GET_USER, payload: id });
   const getUserSuccess = data => ({ type: GET_USER_SUCCESS, payload: data });
   const getUserFailure = error => ({
     type: GET_USER_FAILURE,
     payload: error,
     error: true,
   });

   export const getUsers = () => async dispatch => {
     (...)
   };
   // ----- 추가 -----
   const getUserById = id => axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
   // ----- 추가 -----
   function* getUserSaga(action) {
     try {
       const response = yield call(getUserById, action.payload);
       yield put(getUserSuccess(response.data));
     } catch (e) {
       yield put(getUserFailure(e));
     }
   }
   // ----- 추가 -----
   export function* usersSaga() {
     yield takeEvery(GET_USER, getUserSaga);
   }

   const initialState = {
     (...)
   };

   function users(state = initialState, action) {
     switch (action.type) {
       (...)
       // ----- 추가 -----
       case GET_USER:
         return {
           ...state,
           loading: { ...state.loading, user: true },
           error: { ...state.error, user: null },
         };
       case GET_USER_SUCCESS:
         return {
           ...state,
           loading: { ...state.loading, user: false },
           user: action.payload,
         };
       case GET_USER_FAILURE:
         return {
           ...state,
           loading: { ...state.loading, user: false },
           error: { ...state.error, user: action.payload },
         };
       default:
         return state;
     }
   }

   export default users;

   ```

3. 루트 사가 생성

   ```javascript
   // src/modules/index.js

   import { combineReducers } from 'redux';
   import users, { usersSaga } from './users';
   import { all } from 'redux-saga/effects';

   export function* rootSaga() {
     yield all([usersSaga()]);
   }

   const rootReducer = combineReducers({ users });
   export default rootReducer;
   ```

4) 리덕스 스토어에 redux-saga 적용하기

   ```javascript
   // src/index.js

   import React from 'react';
   import ReactDOM from 'react-dom';
   import './index.css';
   import App from './App';
   import * as serviceWorker from './serviceWorker';
   import { BrowserRouter } from 'react-router-dom';
   import { createStore, applyMiddleware } from 'redux';
   import { Provider } from 'react-redux';
   import thunk from 'redux-thunk';
   // ----- 추가 -----
   import createSagaMiddleware from 'redux-saga';
   import rootReducer, { rootSaga } from './modules';
   // ----- 추가 -----
   const sagaMiddleware = createSagaMiddleware();
   // ----- 추가 -----
   const store = createStore(
     rootReducer,
     window.__PRELOADED_STATE__, // 이 값을 초기 상태로 사용함F
     applyMiddleware(thunk, sagaMiddleware),
   );
   // ----- 추가 -----
   sagaMiddleware.run(rootSaga);

   ReactDOM.render(
     <Provider store={store}>
       <BrowserRouter>
         <App />
       </BrowserRouter>
     </Provider>,
     document.getElementById('root'),
   );

   // If you want your app to work offline and load faster, you can change
   // unregister() to register() below. Note this comes with some pitfalls.
   // Learn more about service workers: https://bit.ly/CRA-PWA
   serviceWorker.unregister();
   ```

5. User, UserContainer 컴포넌트 만들기

   - 특정 사용자의 정보를 보여 줄 User 컴포넌트 만들기

   ```react
   // src.components/User.js

   import React from 'react';

   const User = ({ user }) => {
     const { email, name, username } = user;
     return (
       <div>
         <h1>
           {username} ({name})
         </h1>
         <p>
           <b>e-mail:</b> {email}
         </p>
       </div>
     );
   };

   export default User;
   ```

```react
// src/containers/UserContainer.js

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import User from '../components/User';
import { Preloader } from '../lib/PreloadContext';
import { getUser } from '../modules/users';

const { useEffect } = React;

const UserContainer = ({ id }) => {
  const user = useSelector(state => state.users.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.id === parseInt(id, 10)) return; // 사용자가 존재하고, id가 일치한다면 요청하지 않음
    dispatch(getUser(id));
  }, [dispatch, id, user]); // id가 바뀔 때 새로운 요청해야 함

  // 컨테이너 유효성 검사 후 return null을 해야 하는 경우에
  // null 대신 Preloader 반환
  if (!user) {
    return <Preloader resolve={() => dispatch(getUser(id))} />;
  }
  return <User user={user} />;
};

export default UserContainer;
```

- 컨테이너에서 유효성 검사를 할 때 아직 정보가 없는 경우 user 값이 null을 가리키므로
  User 컴포넌트가 렌더링되지 않도록 컨테이너 컴포넌트에서 null을 반환해 줘야 함.
- 하지만 서버 사이드 렌더링을 할 때는 null이 아닌 Preloader 컴포넌트를 렌더링하여 반환해줌.
- 이렇게 하면 서버 사이드 렌더링을 하는 과정에서 데이터가 없을 경우 GET_USER 액션을 발생시킴.
- 추가로 중복 요청을 방지하는 과정에서 user 값이 존재하는지 확인하고, id가 일치하는지도 확인했음.
- id 값은 추후 URL 파라미터를 통해 받아 오기 때문에 문자열로 이루어져 있음.
- 반면 user 객체 안에 들어 있는 id는 숫자 형태이기 때문에 이 두 값을 비교할 때는 props로 받아 온 id 값을 parseInt를 사용하여 숫자로 변환해 준 다음에 비교해야 함.

6. 페이지 및 라우트 설정

   ```react
   // src/pages/UsersPage.js

   import React from 'react';
   import UsersContainer from '../containers/UsersContainer';
   import UserContainer from '../containers/UserContainer';
   import { Route } from 'react-router-dom';

   const UsersPage = () => {
     return (
       <>
         <UsersContainer />
         <Route path='/users/:id' render={({ match }) => <UserContainer id={match.params.id} />} />
       </>
     );
   };

   export default UsersPage;
   ```

   - Route에 component 대신 render를 설정해 줌으로써 UserContainer를 렌더링할 때 URL 파라미터 id를 props로 바로 집어넣어 줄 수 있음.

7) 테스트
   `$ yarn build`

   `$ yarn build:server`

   `$ yarn start:server`

서버 브라우저에서 `/users` 페이지에 있는 `사용자 링크`를 클릭하거나, `/users/1` 경로에 직접 접근해보기

![image-20200211165421736](/Users/chocompany/Library/Application Support/typora-user-images/image-20200211165421736.png)

8. redux-saga를 위한 서버 사이드 렌더링 작업

   - redux-thunk를 사용하면 Preloader를 통해 호출한 함수들이 Promise를 반환하지만, redux-saga를 사용하면 Promise를 반환하지 않기 때문에 추가 작업이 필요함.

   - 우선 서버 사이드 렌더링을 위한 엔트리 파일에 redux-saga 미들웨어 적용

```javascript
// src/index.server.js

(...)
import thunk from 'redux-thunk';
// ----- 추가 -----
import createSagaMiddleware from 'redux-saga';
import rootReducer, { rootSaga } from './modules';
import PreloadContext from './lib/PreloadContext';

(...)

// 서버 사이드 렌더링을 처리할 핸들러 함수
const serverRender = async (req, res, next) => {
  // 이 함수는 404가 떠야 하는 상황에 404를 띄우지 않고 서버 사이드 렌더링을 해줌.

  const context = {};
  // ----- 추가 -----
  const sagaMiddleware = createSagaMiddleware();
  // ----- 추가 -----
  const store = createStore(rootReducer, applyMiddleware(thunk, sagaMiddleware));
  // ----- 추가 -----
  sagaMiddleware.run(rootSaga);

  const preloadContext = {
    done: false,
    promises: [],
  };

  (...)
```

- 여기까진 스토어 생성 및 미들웨어 설정 부분이 브라우저용 엔트리 index.js에서 해준 것과 똑같음.
- 단, redux-sga를 사용하는 환경에서 서버 사이드 렌더링을 제대로 처리하기 위해선 추가 작업 필요

9. redux-saga 서버 사이드 렌더링 추가 작업

   ```javascript
   (...)
   import { END } from 'redux-saga';

   (...)

   // 서버 사이드 렌더링을 처리할 핸들러 함수
   const serverRender = async (req, res, next) => {
     // 이 함수는 404가 떠야 하는 상황에 404를 띄우지 않고 서버 사이드 렌더링을 해줌.

     const context = {};
     const sagaMiddleware = createSagaMiddleware();

     const store = createStore(rootReducer, applyMiddleware(thunk, sagaMiddleware));
     // ----- 추가 -----
     const sagaPromise = sagaMiddleware.run(rootSaga).toPromise();

     const preloadContext = {
       done: false,
       promises: [],
     };

     const jsx = (
       <PreloadContext.Provider value={preloadContext}>
         <Provider store={store}>
           <StaticRouter location={req.url} context={context}>
             <App />
           </StaticRouter>
         </Provider>
       </PreloadContext.Provider>
     );

     ReactDOMServer.renderToStaticMarkup(jsx); // renderToStaticMarkup으로 한번 렌더링함.
     // ----- 추가 -----
     store.dispatch(END); // redux-saga의 END 액션을 발생시키면 액션을 모니터링하는 사가들이 모두 종료됨.

     try {
       // ----- 추가 -----
       await sagaPromise; // 기존에 진행 중이던 사가들이 모두 끝날 때까지 기다림.
       await Promise.all(preloadContext.promises); // 모든 프로미스를 기다림.
     } catch (e) {
       return res.status(500);
     }
     preloadContext.done = true;
     const root = ReactDOMServer.renderToString(jsx); // 렌더링을 하고
     // JSON을 문자열로 변환하고 악성 스크립트가 실행되는 것을 방지하기 위해 <를 치환 처리
     // https://redux.js.org/recipes/server-rendering#security-considerations
     const stateString = JSON.stringify(store.getState()).replace(/</g, '\\u003c');
     const stateScript = `<script>__PRELOADED_STATE__ = ${stateString}</script>`; // 리덕스 초기 상태를 스크립트로 주입함.

     res.send(createPage(root, stateScript)); // 클라이언트에게 결과물을 응답함.
   };
   (...)
   ```

   - toPromise는 sagaMiddleware.run을 톹ㅇ해 만든 Task를 Promise로 변환.
   - 별도의 작업을 하지 않으면 이 Promise는 끝나지 않는다. (직접 만든 루트 사가에서 액션을 끝없이 모니터링하기 때문.)
   - 그런데 redux-saga의 END라는 액션을 발생시키면 이 Promise를 끝낼 수 있음.
   - END 액션이 발생되면 액션 모니터링 작업이 모두 종료되고, 모니터링 되기 전에 시작된 getUserSaga와 같은 사가 함수들이 있다면 해당 함수들이 완료되고 나서 Promise가 끝나게 됨.
   - 이 Promise가 끝나는 시점에 리덕스 스토어에는 원하는 데이터가 채워짐.
   - 그 이후에 다시 렌더링하면 원하는 결과물이 나타남.

10) 결과 테스트

    `$ yarn build`

    `$ yarn build:server`

    `$ yarn start:server`


    - http://localhost:5000/users/1 페이지에서 새로고침해보기



    ![image-20200211172713992](/Users/chocompany/Library/Application Support/typora-user-images/image-20200211172713992.png)

##### saga 를 이용한 데이터 로딩 완료.

---

### 4. usePreplader Hook 만들어서 사용하기

- 지금까지 컨테이너 컴포넌트에서 Preloader 컴포넌트를 사용하여 서버 사이드 렌더링을 하기 전 데이터가 필요한 상황에 API를 요청했다.
- 이 작업을 usePreloader라는 커스텀 Hook 함수를 만들어서 이 작업을 더욱 편하게 처리해보자.

1. `usePreloader` 만들기

   ```javascript
   // src/lib/PreloadContext.js

   import { createContext, useContext } from 'react';

   // 클라이언트 환경: null
   // 서버 환경: { done: false, promises: [] }
   (...)

   // ----- 추가 -----
   // Hook 형태로 사용할 수 있는 함수
   export const usePreloader = resolve => {
     const preloadContext = useContext(PreloadContext);
     if (!preloadContext) return null;
     if (preloadContext.done) return null;
     preloadContext.promises.push(Promise.resolve(resolve()));
   };
   ```

2) `usePreloader` 훅 사용해보기

   ```react
   // src/containers/UserContainer.js

   import React, { useEffect } from 'react';
   import { useSelector, useDispatch } from 'react-redux';
   import User from '../components/User';
   // ----- 추가 -----
   import { usePreloader } from '../lib/PreloadContext';
   import { getUser } from '../modules/users';

   const UserContainer = ({ id }) => {
     const user = useSelector(state => state.users.user);
     const dispatch = useDispatch();
     // ----- 추가 -----
     usePreloader(() => dispatch(getUser(id))); // 서버 사이드 렌더링을 할 때 API 호출하기

     useEffect(() => {
       if (user && user.id === parseInt(id, 10)) return; // 사용자가 존재하고, id가 일치한다면 요청하지 않음
       dispatch(getUser(id));
     }, [dispatch, id, user]); // id가 바뀔 때 새로운 요청해야 함

     // 컨테이너 유효성 검사 후 return null을 해야 하는 경우에
     // null 대신 Preloader 반환
     // ----- 삭제 -----
     // if (!user) {
     //   return <Preloader resolve={() => dispatch(getUser(id))} />;
     // }
     // ----- 추가 -----
     if (!user) return null;
     return <User user={user} />;
   };

   export default UserContainer;

   ```

   - 함수형 컴포넌트에서는 이렇게 usePreloader 훅을 사용하면 되고,
   - 클래스형 컴포넌트를 사용할 땐 Preloader 컴포넌트를 사용하면 됨.

3. 결과 테스트

   `$ yarn build`

   `$ yarn build:server`

   `$ yarn start:server`
