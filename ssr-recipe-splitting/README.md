# Reaect SSR

### 5. Code-Splitting

- 리액트에서 공식적으로 제공하는 코드 스플리팅 기능인 `Suspense`와 `lazy`는 서버 사이드 렌더링을 아직 지원하지 않음.
  (대안으로 `Loadable Components`를 사용할 것을 권장)

1. `Loadable Components`의존 주입

   `$ yarn add @loadable/component @loadable/server @loadable/webpack-plugin @loadable/babel-plugin`

2) 라우트 컴포넌트 스플리팅

   ```react
   // src/App.js

   import React from 'react';
   import { Route } from 'react-router-dom';
   import Menu from './components/Menu';
   import loadable from '@loadable/component';

   // import RedPage from './pages/RedPage';
   // import BluePage from './pages/BluePage';
   // import UsersPage from './pages/UsersPage';
   const RedPage = loadable(() => import('./pages/RedPage'));
   const BluePage = loadable(() => import('./pages/BluePage'));
   const UsersPage = loadable(() => import('./pages/UsersPage'));

   function App() {
     return (
       <div>
         <Menu />
         <hr />
         <Route path='/red' component={RedPage} />
         <Route path='/blue' component={BluePage} />
         <Route path='/users' component={UsersPage} />
       </div>
     );
   }

   export default App;
   ```

3. `Network` `solw3G` 변경 후 테스트

   `$ yarn build`

   `$ yarn build:server`

   `$ yarn start:server`

- 개발자 도구 `network` 탭에서 `online`을`slow3G`로 변경

- 깜박임현상 확인 후 다시 online으로 변경

4. `webpack`, `babel` 플러그인 적용

   - `Loadable Components`에서 제공하는 `webpack`과 `babel` 플러그인을 적용하면 깜박임 현상을 해결할 수 있음

   - `babel` 플러그인 적용

     ```json
     // src/package.json
     (...)
     "babel": {
       "presets": [
         "react-app"
       ],
       "plugins": [
         "@loadable/babel-plugin"
       ]
     }
     ```

- `webpack` 플러그인 적용

  ```javascript
  // src/config/webpack.config.js

  const LoadablePlugin = require('@loadable/webpack-plugin');
  (...)
  plugins: [
    new LoadablePlugin(),
    (...)
  ]
  ```

* 수정사항 저장 후 `yarn build` 명령어를 한번 더 실행.

* 그 다음, `build` 디렉터리에 `loadable-stats.json` 파일이 생성 되었는지 확인.

  ```json
  // src/build/loadable-stats.json

  {
    "errors": [],
    "warnings": [],
    "version": "4.41.5",
    "hash": "2531689a8cdf4a6ba5bb",
    "publicPath": "/",
    (...)
  }
  ```

  - 이 파일은 각 컴포넌트의 코드가 어떤 청크(chunk)파일에 들어가 있는지에 대한 정보를 가짐.

  - 서버 사이드 렌더링을 할 때 이 파일을 참고하여 어떤 컴포넌트가 렌더링 되었는지에 따라 어떤 파일들을 사전에 불러와야 할지 설정할 수 있음.

5. 필요한 청크 파일 경로 추출

   - 서버 사이드 렌더링 후 브라우저에서 어떤 파일을 사전에 불러와야 할지 알아내고 해당 파일들의 경로를 추출하기 위해
     `Loadable Components`에서 제공하는 `ChunkExtractor`와 `ChunkExtractorManager`를 사용함.

```javascript
// src/index.server.js

(...)
// ----- 추가 -----
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
// ----- 추가 -----
const statsFile = path.resolve('./build/loadable-stats.json');

// ----- 추가 -----
function createPage(root, tags) {
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
    ${tags.styles}
    ${tags.links}
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root">
      ${root}
    </div>
    ${tags.scripts}
  </body>
  </html>
  `;
}

const app = express();

// 서버 사이드 렌더링을 처리할 핸들러 함수
const serverRender = async (req, res, next) => {
  (...)

  const preloadContext = {
    done: false,
    promises: [],
  };

  // ----- 추가 -----
  // 필요한 파일을 추출하기 위한 ChunkExtractor
  const extractor = new ChunkExtractor({ statsFile });
  // ----- 추가 -----
  const jsx = (
    <ChunkExtractorManager extractor={extractor}>
      <PreloadContext.Provider value={preloadContext}>
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            <App />
          </StaticRouter>
        </Provider>
      </PreloadContext.Provider>
    </ChunkExtractorManager>
  );
  (...)
  // ----- 추가 -----
  // 미리 불어와야 하는 스타일/스크립트를 추출하고
  const tags = {
    scripts: stateScript + extractor.getScriptTags(), // 스크립트 앞부분에 리덕스 상태 넣기
    links: extractor.getLinkTags(),
    styles: extractor.getStyleTags(),
  };
  // ----- 추가 -----
  res.send(createPage(root, tags)); // 클라이언트에게 결과물을 응답함.
};
(...)
```

6. `loadableReady`와 `hydrate`

   - `Loadable Components`를 사용하면 성능을 최적화하기 위해 모든 자바스크립트 파일을 동시에 받아온다.
   - 모든 스크립트가 로딩되고 나서 렌더링하도록 처리하기 위해서는 `loadableReady`라는 함수를 사용해야 함.
   - 추가로 리액트에서 `render` 함수 대신 사용할 수 있는 `hydrate` 함수가 있는데, 이 함수는 기존에 서버 사이드 렌더링 된
     결과물이 이미 있을 경우 새로 렌더링하지 않고 기존에 존재하는 UI에 이벤트만 연동하여 앱을 초기 구동할 때
     필요한 리소스를 최소화 함으로써 성능을 최적화해줌.
   - 이를 적용하기 위해 `src/index.js`를 수정.

   ```react
   // src/index.js

   (...)
   import { loadableReady } from '@loadable/component';

   const sagaMiddleware = createSagaMiddleware();

   const store = createStore(
     rootReducer,
     window.__PRELOADED_STATE__, // 이 값을 초기 상태로 사용함F
     applyMiddleware(thunk, sagaMiddleware),
   );

   sagaMiddleware.run(rootSaga);

   // 같은 내용을 쉽게 재사용할 수 있도록 렌더링할 내용을 하나의 컴포넌트로 묶음
   const Root = () => {
     return (
       <Provider store={store}>
         <BrowserRouter>
           <App />
         </BrowserRouter>
       </Provider>
     );
   };

   const root = document.getElementById('root');

   // 프로덕션 환경에서는 loadableReady와 hydrate를 사용하고
   // 개발 환경에서는 기존 방식으로 처리

   if (process.env.NODE_ENV === 'production') {
     loadableReady(() => {
       ReactDOM.hydrate(<Root />, root);
     });
   } else {
     ReactDOM.render(<Root />, root);
   }

   // If you want your app to work offline and load faster, you can change
   // unregister() to register() below. Note this comes with some pitfalls.
   // Learn more about service workers: https://bit.ly/CRA-PWA
   serviceWorker.unregister();

   ```

7) 프로젝트 빌드 후 청크 파일 주입 상태 확인

   `$ yarn build`

   `$ yarn build:server`

   `$ yarn start:server`

- http://localhost:5000/users 에 접속하여 새로고침하면
  다음 화면과 같이 렌더링 결과물에 청크 파일이 제대로 주입된 것을 확인할 수 있음.

##### 코드 스플리팅 + 서버 사이드 렌더링 완료.

---

### 6. 서버 사이드 렌더링의 환경 구축을 위한 대안

- 서버 사이드 렌더링 자체만 놓고 보면 꽤나 간단한 작업이지만 데이터 로딩, 코드 스플리팅까지 하면 참 번거로운 작업.
- 만약 이러한 설정을 하나하나 직접 하는 것이 귀찮다고 느껴진다면 다른 대안도 있음.

1. `Next.js`

   - **[Next.js](https://nextjs.org/)** 라는 리액트 프레임워크를 사용하면 이 작업을 최소한의 설정으로 간단하게 처리할 수 있음.

   - 대신 리액트 라우터와 호환되지 않음.

   - 리액트 라우터는 컴포넌트 기반으로 라우트를 설정하는 반면, Next.js는 파일 시스템에 기반하여 라우트를 설정
     즉, 파일의 경로와 파일 이름을 사용하여 라우트를 설정.

   - 코드 스플리팅, 데이터 로딩, 서버 사이드 렌더링을 가장 쉽게 적용하고 싶다면 Next.js를 추천하지만, 리액트 라우터의 라우팅 방식을 더 좋아하거나, 기존의 프로젝트에 적용해야 하거나, 혹은 작동 원리를 제대로 파악하면서 구현하고 싶다면 직접 구현하는 것이 가장 좋음.

2) `Razzle`

   - **[Razzle](https://github.com/jaredpalmer/razzle)** 또한 Next.js처럼 서버 사이드 렌더링을 쉽게 할 수 있도록 해주는 도구이며, 프로젝트 구성이 CRA와 매우 유사하다는 장점이 있음.
   - 그렇기 때문에 프로젝트의 구조를 마음대로 설정할 수 있으며, 리액트 라우터와도 잘 호환 됨.
   - 다만 2019년 4월 기준으로 Loadable Components가 기본 설정으로는 작동하지 않아 적용하기 까다로움.

---
