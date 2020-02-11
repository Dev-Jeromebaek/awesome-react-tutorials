# Reaect SSR

### 2. 데이터 로딩

1. redux-thunk 코드 준비하기

   `$ yarn add redux react-redux redux-thunk axios`

2) module 생성 (src/modules/users.js)

   ```javascript
   import axios from 'axios';

   const GET_USERS_PENDING = 'users/GET_USERS_PENDING';
   const GET_USERS_SUCCESS = 'users/GET_USERS_SUCCESS';
   const GET_USERS_FAILURE = 'userx/GET_USERS_FAILURE';

   const getUsersPending = () => ({ type: GET_USERS_PENDING });
   const getUsersSuccess = payload => ({ type: GET_USERS_SUCCESS, payload });
   const getUsersFailure = payload => ({
     type: GET_USERS_FAILURE,
     error: true,
     payload,
   });

   export const getUsers = () => async dispatch => {
     try {
       dispatch(getUsersPending());
       const response = await axios.get('https://jsonplaceholder.typicode.com/users');
       dispatch(getUsersSuccess(response));
     } catch (e) {
       dispatch(getUsersFailure(e));
       throw e;
     }
   };

   const initialState = {
     users: null,
     user: null,
     loading: {
       users: false,
       user: false,
     },
     error: {
       users: null,
       user: null,
     },
   };

   function users(state = initialState, action) {
     switch (action.type) {
       case GET_USERS_PENDING:
         return { ...state, loading: { ...state.loading, users: true } };
       case GET_USERS_SUCCESS:
         return {
           ...state,
           loading: { ...state.loading, users: false },
           users: action.payload.data,
         };
       case GET_USERS_FAILURE:
         return {
           ...state,
           loading: { ...state.loading, users: false },
           error: { ...state.error, users: action.payload },
         };
       default:
         return state;
     }
   }

   export default users;
   ```

3. 루트 리듀서 작성 (src/modules/index.js)

   ```javascript
   // src/modules/index.js

   import { combineReducers } from 'redux';
   import users from './users';

   const rootReducer = combineReducers({ users });
   export default rootReducer;
   ```

4) 작성된 루트 리듀서를 Provider 컴포넌트를 사용하여 프로젝트에 리덕스 적용 (src/index.js)

   ```react
   // src/index.js

   import React from 'react';
   import ReactDOM from 'react-dom';
   import './index.css';
   import App from './App';
   import * as serviceWorker from './serviceWorker';
   import { BrowserRouter } from 'react-router-dom';
   // ----- 추가 -----
   import { createStore, applyMiddleware } from 'redux';
   import { Provider } from 'react-redux';
   import thunk from 'redux-thunk';
   import rootReducer from './modules';

   const store = createStore(rootReducer, applyMiddleware(thunk));

   ReactDOM.render(
     <Provider store={store}>
       <BrowserRouter>
         <App />
       </BrowserRouter>
     </Provider>,
     document.getElementById('root'),
   );
   // ----- 추가(end) -----

   // If you want your app to work offline and load faster, you can change
   // unregister() to register() below. Note this comes with some pitfalls.
   // Learn more about service workers: https://bit.ly/CRA-PWA
   serviceWorker.unregister();

   ```

5. Users, UsersContainer 컴포넌트 만들기

   ```react
   // src/components/Users.js

   import React from 'react';
   import { Link } from 'react-router-dom';

   const Users = ({ users }) => {
     if (!users) return null; // users가 유효하지 않다면 아무것도 보여주지 않음
     return (
       <div>
         <ul>
           {users.map(user => (
             <li key={user.id}>
               <Link to={`/users/${user.id}`}>{user.username}</Link>
             </li>
           ))}
         </ul>
       </div>
     );
   };

   export default Users;
   ```

```react
// src/containers/UsersContainer.js

import React, { useEffect } from 'react';
import Users from '../components/Users';
import { connect } from 'react-redux';
import { getUsers } from '../modules/users';

const UsersContainer = ({ users, getUsers }) => {
  // 컴포넌트가 마운트되고 나서 호출
  useEffect(() => {
    if (users) return; // users가 이미 유효하다면 요청하지 않음
    getUsers();
  }, [getUsers, users]);
  return <Users users={users} />;
};

export default connect(
  state => ({
    users: state.users.users,
  }),
  {
    getUsers,
  },
)(UsersContainer);
```

6. 페이지 및 라우트 설정

   ```react
   // src/pages/UsersPage.js

   import React from 'react';
   import UsersContainer from '../containers/UsersContainer';

   const UsersPage = () => {
     return <UsersContainer />;
   };

   export default UsersPage;
   ```

```react
// src/App.js

import React from 'react';
import { Route } from 'react-router-dom';
import Menu from './components/Menu';
import RedPage from './pages/RedPage';
import BluePage from './pages/BluePage';
// ----- 추가 -----
import UsersPage from './pages/UsersPage';

function App() {
  return (
    <div>
      <Menu />
      <hr />
      <Route path='/red' component={RedPage} />
      <Route path='/blue' component={BluePage} />
      {/* ----- 추가 ----- */}
      <Route path='/users' component={UsersPage} />
    </div>
  );
}

export default App;
```

7. 메뉴 추가

   ```react
   // src/components/Menu.js

   import React from 'react';
   import { Link } from 'react-router-dom';

   const Menu = () => {
     return (
       <ul>
         <li>
           <Link to='/red'>Red</Link>
         </li>
         <li>
           <Link to='/blue'>Blue</Link>
         </li>
         {/* ----- 추가 ----- */}
         <li>
           <Link to='/users'>Users</Link>
         </li>
       </ul>
     );
   };

   export default Menu;
   ```

8) PreloadContext 만들기

   - 서버 사이드 렌더링을 할 때는 `useEffect`나 `componentDidMount`에서 설정한 작업이 호출되지 않는다.
   - 즉, 렌더링하기 전에 API를 요청한 뒤 스토어에 데이터를 담아야 함.
   - 서버 환경에서 이런 작업을 하려면 클래스형 컴포넌트가 지니고 있는 `constructor` 메서드를 사용하거나 `render` 함수 자체에서 처리해야 함. 그리고 요청이 끝날 때 까지 대기했다가 다시 렌더링 해줘야 함.
   - 이 작업을 `PreloadContext`라는 것을 만들고 이를 사용하는 `Preloader` 컴포넌트를 만들어 처리할 예정

```javascript
// src/lib/PreloadContext.js

import { createContext, useContext } from 'react';

// 클라이언트 환경: null
// 서버 환경: { done: false, promises: [] }
const PreloadContext = createContext(null);
export default PreloadContext;

// resolve는 함수 타입임.
export const Preloader = ({ resolve }) => {
  const preloadContext = useContext(PreloadContext);
  if (!preloadContext) return null; // context 값이 유효하지 않다면 아무것도 하지 않음
  if (preloadContext.done) return null; // 이미 작업이 끝났다면 아무것도 하지 않음

  // promise 배열에 프로미스 등록
  // 설령 resolve 함수가 프로미스를 반환하지 않더라도, 프로미스 취급을 하기 위해
  // Promise.resolve 함수 사용
  preloadContext.promises.push(Promise.resolve(resolve()));
  return null;
};
```

- `PreloadContext`는 서버 사이드 렌더링을 하는 과정에서 처리해야 할 작업들을 실행하고, 만약 기다려야 하는 프로미스가 있다면 프로미스를 수집함.
- 모든 프로미스를 수집한 뒤, 수집된 프로미스들이 끝날 때 까지 기다렸다가 그 다음에 다시 렌더링하면 데이터가 채워진 상태로 컴포넌트들이 나타나게 됨.
- `Preloader` 컴포넌트는 `resolve`라는 함수를 `props`로 받아 오며, 컴포넌트가 렌더링될 때 서버 환경에서만 `resolve` 함수를 호출해준다.

9. PreloadContext 사용하기

   ```react
   // src/containers/UserContainer.js

   import React from 'react';
   import Users from '../components/Users';
   import { connect } from 'react-redux';
   import { getUsers } from '../modules/users';
   import { Preloader } from '../lib/PreloadContext';

   const { useEffect } = React;

   const UsersContainer = ({ users, getUsers }) => {
     // 컴포넌트가 마운트되고 나서 호출
     useEffect(() => {
       if (users) return; // users가 이미 유효하다면 요청하지 않음
       getUsers();
     }, [getUsers, users]);
     return (
       <>
         <Users users={users} />
         <Preloader resolve={getUsers} />
       </>
     );
   };

   export default connect(
     state => ({
       users: state.users.users,
     }),
     {
       getUsers,
     },
   )(UsersContainer);
   ```

10) 서버에서 리덕스 설정

    ```javascript
    // src/index.server.js

    import React from 'react';
    import ReactDOMServer from 'react-dom/server';
    import express from 'express';
    import { StaticRouter } from 'react-router-dom';
    import App from './App';
    import path from 'path';
    import fs from 'fs';
    // ----- 추가 -----
    import { createStore, applyMiddleware } from 'redux';
    import { Provider } from 'react-redux';
    import thunk from 'redux-thunk';
    import rootReducer from './modules';

    (...)
    // 서버 사이드 렌더링을 처리할 핸들러 함수
    const serverRender = (req, res, next) => {
      // 이 함수는 404가 떠야 하는 상황에 404를 띄우지 않고 서버 사이드 렌더링을 해줌.

      const context = {};
      // ----- 추가 -----
      const store = createStore(rootReducer, applyMiddleware(thunk));
      const jsx = (
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            <App />
          </StaticRouter>
        </Provider>
      );
      const root = ReactDOMServer.renderToString(jsx); // 렌더링을 하고
      res.send(createPage(root)); // 클라이언트에게 결과물을 응답함.
    };

    (...)
    ```

    - 주의할 점은 서버가 실행될 때 스토어를 한 번만 만드는 것이 아니라, 요청이 들어올 때마다 새로운 스토어를 만든다는 것.

    - 그래서 이후에 스크립트를 통해

11. 서버에서 PreloadContext 사용하기

    - `PreloadContext`를 사용하여 프로미스들을 수집하고 기다렸다가 다시 렌더링하는 작업을 수행해보기


    ```javascript
    // src/index.server.js

    (...)
    // ----- 추가 -----
    import PreloadContext from './lib/PreloadContext';

    (...)

    // 서버 사이드 렌더링을 처리할 핸들러 함수
    const serverRender = async (req, res, next) => {
      // 이 함수는 404가 떠야 하는 상황에 404를 띄우지 않고 서버 사이드 렌더링을 해줌.

      const context = {};
      const store = createStore(rootReducer, applyMiddleware(thunk));

      // ----- 추가 -----
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
      try {
        await Promise.all(preloadContext.promises); // 모든 프로미스를 기다림.
      } catch (e) {
        return res.status(500);
      }
      preloadContext.done = true;
      const root = ReactDOMServer.renderToString(jsx); // 렌더링을 하고
      res.send(createPage(root)); // 클라이언트에게 결과물을 응답함.
    };

    (...)
    ```

    - 첫 번째 렌더링을 할 때는 `renderToString` 대신 `renderToStaticMarkup`이라는 함수를 사용했음.

      (`renderToStaticMarkup`은 리액트를 사용하여 정적인 페이지를 만들 때 사용함.)

    - 이 함수로 만든 리액트 렌더링 결과물은 클아이언트 쪽에서 HTML DOM 인터랙션을 지원하기 힘듦.

    - 지금 단계에서 `renderToString` 대신 `renderToStaticMarkup` 함수를 사용한 이뉴는 그저 `Preloader`로 넣어주었던 함수를 호출하기 위함이고, 또 이 함수의 처리 속도가 `renderToString`보다 좀 더 빠르기 때문.

12. 스크립트로 스토어 초기 상태 주입

    - 지금까지 작성한 코드는 API를 통해 받아 온 데이터를 렌더링함.
    - 하지만 렌더링하는 과정에서 만들어진 스토어의 상태를 브라우저에서 재사용하지는 못하는 상황.
    - 서버에서 만들어 준 상태를 브라우저에서 재사용하려면, 현재 스토어 상태를 문자열로 변환한 뒤 스크립트로 주입해 주어야 함.


    ```javascript
    // src/index.server.js

    (...)
    // ----- 추가 -----
    function createPage(root, staticScript) {
      return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,shrink-to-fit=no"
        />
        <meta name="theme-color" content="#000000" />
        <title>React App</title>
        <link href="${manifest.files['main.css']}" rel="stylesheet" />
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root">
          ${root}
        </div>
        ${staticScript}
        <script src="${manifest.files['runtime-main.js']}"></script>
        ${chunks}
        <script src="${manifest.files['main.js']}"></script>
      </body>
      </html>
      `;
    }

    const app = express();


    // 서버 사이드 렌더링을 처리할 핸들러 함수
    const serverRender = async (req, res, next) => {
      (...)
      const root = ReactDOMServer.renderToString(jsx); // 렌더링을 하고
      // ----- 추가 -----
      // JSON을 문자열로 변환하고 악성 스크립트가 실행되는 것을 방지하기 위해 <를 치환 처리
      // https://redux.js.org/recipes/server-rendering#security-considerations
      const stateString = JSON.stringify(store.getState()).replace(/</g, '\\u003c');
      const stateScript = `<script>__PRELOADED_STATE__ = ${stateString}</script>`; // 리덕스 초기 상태를 스크립트로 주입함.

      res.send(createPage(root, stateScript)); // 클라이언트에게 결과물을 응답함.

    (...)
    ```

13. 브라우저에서 상태를 재사용하는 방법

    - 브라우저에서 상태를 재사용할 때는 다음과 같이 스토어 생성 과정에서 `window.__PRELOADED_STATE__`를 초깃값으로 사용하면 됨.


    ```javascript
    // src/index.js

    (...)
    const store = createStore(
      rootReducer,
      window.__PRELOADED_STATE__, // 이 값을 초기 상태로 사용함
      applyMiddleware(thunk),
    );

    (...)
    ```

14. 결과 테스트

    `$ yarn build`

    `$ yarn build:server`

    `$ yarn start:server`

    - 서버 실행 후 http://localhost:5000/users 경로에 들어가서 확인


    ![image-20200211170631247](/Users/chocompany/Library/Application Support/typora-user-images/image-20200211170631247.png)

#####

---

##
