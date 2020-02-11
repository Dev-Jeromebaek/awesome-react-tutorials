# Reaect SSR

### 1. 기본 서버사이드 렌더링

1. 프로젝트 생성 npx create-react-app (프로젝트명)

2) react-router-dom 설정
   `$ yarn add react-router-dom`

3. 기본 메뉴와 경로 파일 생성 및 연결

   ```bash
   src/
     components/
       Blue.js
       Menu.js
       Red.js
     pages/
       BluePage.js
       RedPage.js
     App.js
     index.js
     (...)
   ```

```react
// src/components/Blue.js

import React from 'react';
import './Blue.css';

const Blue = () => {
  return <div className='Blue'>Blue</div>;
};

export default Blue;
```

```react
// src/components/Red.js

import React from 'react';
import './Red.css';

const Red = () => {
  return <div className='Red'>Red</div>;
};

export default Red;
```

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
    </ul>
  );
};

export default Menu;
```

```react
// src/pages/BluePage.js

import React from 'react';
import Blue from '../components/Blue';

const BluePage = () => {
  return <Blue />;
};

export default BluePage;
```

```react
// src/pages/RedPage.js

import React from 'react';
import Red from '../components/Red';

const RedPage = () => {
  return <Red />;
};

export default RedPage;
```

```react
// src/App.js

import React from 'react';
import { Route } from 'react-router-dom';
import Menu from './components/Menu';
import RedPage from './pages/RedPage';
import BluePage from './pages/BluePage';

function App() {
  return (
    <div>
      <Menu />
      <hr />
      <Route path='/red' component={RedPage} />
      <Route path='/blue' component={BluePage} />
    </div>
  );
}

export default App;
```

```react
// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```

4. webpack eject

5) src/index.server.js 파일생성

   ```react
   // index.server.js

   import React from 'react';
   import ReactDOMServer from 'react-dom/server';

   const html = ReactDOMServer.renderToString(
     <div>Hello Server Side Rendering!</div>
   );

   console.log(html);
   ```

6. 서버 관련설정을 추가 (config/path.js)

   - 작성한 index.server.js파일을 웹팩으로 불러와서 빌드하려면 서버 전용 환경 설정을 만들어주어야 함.
     먼저 config/path.js 파일에서 서버 관련설정을 추가

```javascript
// config/path.js
(...)
module.exports = {
  (...)
  // ----- 추가 사항 -----
  ssrIndexJs: resolveApp('src/index.server.js'), // 서버 사이드 렌더링 엔트리
  ssrBuild: resolveApp('dist') // 웹팩 처리 후 저장 경로
};
```

7. 웹팩 환경 설정 파일 작성 (config/webpack.config.server.js)

   ```javascript
   // config/webpack.config.server.js

   const paths = require('./paths');

   module.exports = {
     mode: 'production', // 프로덕션 모드로 설정하여 최적호 옵션들을 활성화
     entry: paths.ssrIndexJs, // 엔트리 경로
     target: 'node', // node 환경에서 실행될 것이라는 점을 명시
     output: {
       path: paths.ssrBuild, // 빌드 경로
       filename: 'server.js', // 파일 이름
       chunkFilename: 'js/[name].chunk.js', // 청크 파일 이름
       publicPath: paths.servedPath, // 정적 파일이 제공될 경로
     },
   };
   ```

8) 로더 설정 (config/webpack.config.server.js)

   ```javascript
   // config/webpack.config.server.js

   const paths = require('./paths');
   const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent'); // CSS Module의 고유 className을 만들 때 필요한 옵션

   const cssRegex = /\.css$/;
   const cssModuleRegex = /\.module\.css$/;
   const sassRegex = /\.(scss|sass)$/;
   const sassModuleRegex = /\.module\.(scss|sass)$/;

   module.exports = {
     mode: 'production', // 프로덕션 모드로 설정하여 최적호 옵션들을 활성화
     entry: paths.ssrIndexJs, // 엔트리 경로
     target: 'node', // node 환경에서 실행될 것이라는 점을 명시
     output: {
       path: paths.ssrBuild, // 빌드 경로
       filename: 'server.js', // 파일 이름
       chunkFilename: 'js/[name].chunk.js', // 청크 파일 이름
       publicPath: paths.servedPath, // 정적 파일이 제공될 경로
     },
     module: {
       rules: [
         {
           oneOf: [
             // 자바스크립트를 위한 처리
             // 기존 webpack.config.js를 참고하여 작성
             {
               test: /\.(js|mjs|jsx|ts|tsx)$/,
               include: paths.appSrc,
               loader: require.resolve('babel-loader'),
               options: {
                 customize: require.resolve('babel-preset-react-app/webpack-overrides'),
                 plugins: [
                   [
                     require.resolve('babel-plugin-named-asset-import'),
                     {
                       loaderMap: {
                         svg: {
                           ReactComponent: '@svgr/webpack?-svgo![path]',
                         },
                       },
                     },
                   ],
                 ],
               },
             },
             // CSS를 위한 처리
             {
               test: cssRegex,
               exclude: cssModuleRegex,
               // onlyLocals: true 옵션을 설정해야 실제 CSS 파일을 생성하지 않는다.
               loader: require.resolve('css-loader'),
               options: {
                 onlyLocals: true,
               },
             },
             // CSS Module을 위한 처리
             {
               test: cssModuleRegex,
               loader: require.resolve('css-loader'),
               options: {
                 modules: true,
                 onlyLocals: true,
                 getLocalIdent: getCSSModuleLocalIdent,
               },
             },
             // Sass를 위한 처리
             {
               test: sassRegex,
               exclude: sassModuleRegex,
               use: [
                 {
                   loader: require.resolve('css-loader'),
                   options: {
                     onlyLocals: true,
                   },
                 },
                 require.resolve('sass-loader'),
               ],
             },
             // Sass + CSS Module을 위한 처리
             {
               test: sassRegex,
               exclude: sassModuleRegex,
               use: [
                 {
                   loader: require.resolve('css-loader'),
                   options: {
                     modules: true,
                     onlyLocals: true,
                     getLocalIdent: getCSSModuleLocalIdent,
                   },
                 },
                 require.resolve('sass-loader'),
               ],
             },
             // url-loader를 위한 설정
             {
               test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
               loader: require.resolve('url-loader'),
               options: {
                 emitFile: false, // 파일을 따로 저장하지 않는 옵션
                 limit: 10000, // 원래는 9.76KB가 넘어가면 파일로 저장하는데
                 // emitFile 값이 false일 때는 경로만 준비하고 파일은 저장히지 않는다.
                 name: 'static/media/[name].[hash:8].[ext]',
               },
             },
             // 위에서 설정도니 확장자를 제외한 파일들은
             // file-loader를 사용
             {
               loader: require.resolve('file-loader'),
               exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
               options: {
                 emitFile: false, // 파일을 따로 저장하지 않는 옵션
                 name: 'static/media/[name].[hash:8].[ext]',
               },
             },
           ],
         },
       ],
     },
   };
   ```

9. node_modules 내부의 라이브러리를 불러올 수 있게 설정 (config/webpack.config.server.js)

   ```javascript
   const paths = require('./paths');
   const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent'); // CSS Module의 고유 className을 만들 때 필요한 옵션

   const cssRegex = /\.css$/;
   const cssModuleRegex = /\.module\.css$/;
   const sassRegex = /\.(scss|sass)$/;
   const sassModuleRegex = /\.module\.(scss|sass)$/;

   module.exports = {
     mode: 'production', // 프로덕션 모드로 설정하여 최적호 옵션들을 활성화
     entry: paths.ssrIndexJs, // 엔트리 경로
     target: 'node', // node 환경에서 실행될 것이라는 점을 명시
     output: {
       path: paths.ssrBuild, // 빌드 경로
       filename: 'server.js', // 파일 이름
       chunkFilename: 'js/[name].chunk.js', // 청크 파일 이름
       publicPath: paths.servedPath, // 정적 파일이 제공될 경로
     },
     module: {
       rules: [
         {
           oneOf: [
             (...)
           ],
         },
       ],
     },
     resolve: {
       modules: ['node_modules'], // node_modules 내부의 라이브러리를 불러올 수 있게 설정
       // 이렇게 했을 때 react, react-dom/server 같은 라이브러리를
       // import 구문으로 불러오면 node_modules에서 찾아 사용함.
       // 라이브러리를 불러오면 빌드할 때 결과물 파일 안에 해당 라이브러리 관련 코드가 함께 번들링 됨.
     },
   };

   ```

   - 이렇게 했을 때 react, react-dom/server 같은 라이브러리를
     import 구문으로 불러오면 node_modules에서 찾아 사용함.
   - 라이브러리를 불러오면 빌드할 때 결과물 파일 안에 해당 라이브러리 관련 코드가 함께 번들링 됨.
   - 브라우저에서 사용할 때는 결과물 파일에 리액트 라이브러리와 우리의 애플리케이션에 관한 코드가 공존해야 하는데,
     서버에서는 굳이 결과물 파일 안에 리액트 라이브러리가 들어 있지 않아도 된다.
   - 즉 node_modules를 통해 바로 불러와서 사용할 수 있기 때문.
   - 따라서 서버를 위해 번들링할 때는 node_modules에서 불러오는 것을 제외하고 번들링하는 것이 좋다.
   - 이를 위해 webpack-node-externals라는 라이브러리를 사용해야 함.

10) webpack-node-externals 설치 및 설정 (config/webpack.config.server.js)

    `$ yarn add webpack-node-externals`


    ```javascript
    // config/webpack.config.server.js

    const nodeExternals = require('webpack-node-externals');
    (...)

    module.exports = {
      (...)
      resolve: {
        modules: ['node_modules'],
      },
      externals: [nodeExternals()],
    }
    ```

11. 환경변수 주입 (config/webpack.config.server.js)

    ```javascript
    // config/webpack.config.server.js

    const nodeExternals = require('webpack-node-externals');
    const paths = require('./paths');
    const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent'); // CSS Module의 고유 className을 만들 때 필요한 옵션
    const webpack = require('webpack');
    const getClientEnvironment = require('./env');

    const cssRegex = /\.css$/;
    const cssModuleRegex = /\.module\.css$/;
    const sassRegex = /\.(scss|sass)$/;
    const sassModuleRegex = /\.module\.(scss|sass)$/;

    const publicUrl = paths.servedPath.slice(0, -1);
    const env = getClientEnvironment(publicUrl);

    module.exports = {
      (...)
      resolve: {
        modules: ['node_modules'],
      },
      externals: [nodeExternals()],
      plugins: [
        new webpack.DefinePlugin(env.stringified), // 환경변수를 주입
      ],
    }
    ```

    - 환경변수를 주입하면, 프로젝트 내에서 process.env.NODE_ENV 값을 참조하여 현재 개발 환경인지 아닌지를 알 수 있다.

12) 빌드 스크립트 작성 (scripts/build.server.js)

    ```javascript
    // scripts/build.server.js

    process.env.BABEL_ENV = 'production';
    process.env.NODE_ENV = 'production';

    process.on('unhandledRejection', err => {
      throw err;
    });

    require('../config/env');
    const fs = require('fs-extra');
    const webpack = require('webpack');
    const config = configFactory('../config/webpack.config.server');
    const paths = require('../config/paths');

    function build() {
      console.log('Creating server build...');
      fs.emptyDirSync(paths.ssrBuild);
      let compiler = webpack(config);
      return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(stats.toString());
        });
      });
    }

    build();
    ```

13. 작성한 빌드 스크립트 테스트

    `$ node scripts/build.server.js`


    ```bash
    // 실행 결과

    Creating server build...
    Hash: 22655892f169f7505bb7
    Version: webpack 4.41.5
    Time: 775ms
    Built at: 2020-02-11 12:09:00
        Asset      Size  Chunks             Chunk Names
    server.js  1.15 KiB       0  [emitted]  main
    Entrypoint main = server.js
    [0] external "react" 42 bytes {0} [built]
    [1] external "react-dom/server" 42 bytes {0} [built]
    [2] ./src/index.server.js 427 bytes {0} [built]
    ```

14. 작성된 결과물이 잘 작동하는지 확인

    `$ node dist/server.js`


    ```bash
    // 실행 결과

    <div data-reactroot="">Hello Server Side Rendering!</div>
    ```

15. package.json에 스크립트 추가 주입

    ```json
    // package.json

    "scripts": {
      "start": "node scripts/start.js",
      "build": "node scripts/build.js",
      "test": "node scripts/test.js",
      "start:server": "node dist/server.js",
      "build:server": "node scripts/build.server.js"
    },
    ```

16) 서버 코드 작성

    - 서버 사이드 렌더링을 처리할 서버를 작성.

    - Express라는 Node.js 웹 프레임워크를 사용하여 웹 서버를 만듦.

    - 이 과정에서 꼭 Express가 아니어도 상관없으며 Koa, Hapi 또는 connect 라이브러리를 사용하면 구현할 수 있음.

    - Express를 사용한 이유는 해당 프레임워크가 사용률이 가장 높고, 추후 정적 파일들을 호스팅할 때도 쉽게 구현할 수 있기 때문

17. express 설치

    `$ yarn add express`

18) 서버 코드 작성 (index.server.js)

    ```javascript
    // index.server.js

    import React from 'react';
    import ReactDOMServer from 'react-dom/server';
    import express from 'express';
    import { StaticRouter } from 'react-router-dom';
    import App from './App';

    const app = express();

    // 서버 사이드 렌더링을 처리할 핸들러 함수
    const serverRender = (req, res, next) => {
      // 이 함수는 404가 떠야 하는 상황에 404를 띄우지 않고 서버 사이드 렌더링을 해줌.

      const context = {};
      const jsx = (
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      );
      const root = ReactDOMServer.renderToString(jsx); // 렌더링을 하고
      res.send(root); // 클라이언트에게 결과물을 응답함.
    };

    app.use(serverRender);

    // 5000 포트로 서버를 가동함.
    app.listen(5000, () => {
      console.log('Running on http://localhost:5000');
    });
    ```

    - StaticRouter는 주로 서버 사이드 렌더링 용도로 사용되는 라우터로 props로 넣어주는 location 값에 따라 라우팅해줌.

    - 지금은 req.url이라는 값을 넣어주었는데, 여기서 req 객체는 요청에 대한 정보를 지니고 있음.

    - context라는 props도 넣어주었는데, 이 값을 사용하여 나중에 렌더링한 컴포넌트에 따라 HTTP 상태 코드를 설정해 줄 수 있음.

19. 빌드 및 실행 테스트

    `$ yarn build:server`

    `$ yarn start:server`

20) 정적 파일 제공하기 (index.server.js)

    - express에 내장되어 있는 static 미들웨어를 사용하여 서버를 통해 build에 있는 JS, CSS 정적 파일들에 접근할 수 있도록 해줌.


    ```javascript
    // index.server.js

    import React from 'react';
    import ReactDOMServer from 'react-dom/server';
    import express from 'express';
    import { StaticRouter } from 'react-router-dom';
    import App from './App';
    // ----- 추가 -----
    import path from 'path';
    // ----- 추가(end) -----
    const app = express();

    // 서버 사이드 렌더링을 처리할 핸들러 함수
    const serverRender = (req, res, next) => {
      // 이 함수는 404가 떠야 하는 상황에 404를 띄우지 않고 서버 사이드 렌더링을 해줌.

      const context = {};
      const jsx = (
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      );
      const root = ReactDOMServer.renderToString(jsx); // 렌더링을 하고
      res.send(root); // 클라이언트에게 결과물을 응답함.
    };

    // ----- 추가 -----
    const serve = express.static(path.resolve('./build'), {
      index: false // "/" 경로에서 index.html을 보여 주지 않도록 설정
    })

    app.use(serve); // 순서가 중요함. serverRender 전에 위치해야 한다.
    // ----- 추가(end) -----
    app.use(serverRender);

    // 5000 포트로 서버를 가동함.
    app.listen(5000, () => {
      console.log('Running on http://localhost:5000');
    });

    const html = ReactDOMServer.renderToString(<div>Hello Server Side Rendering!</div>);

    console.log(html);
    ```

21. 정적파일 주입 코드 작성

    - JS와 CSS 파일을 불러오도록 html에 코드를 삽입해 주어야 함.

    - 파일 이름은 매번 빌드할 때마다 바뀌기 때문에 빌드하고 나서 만들어지는 asset-manifest.json파일을 참고하여 불러오도록 작성.


    ```json
    // 빌드 후에 생성되는 manifest.json 파일
    // build/asset-manifest.json

    {
      "files": {
        "main.css": "/static/css/main.5ecd60fb.chunk.css",
        "main.js": "/static/js/main.68c56961.chunk.js",
        "main.js.map": "/static/js/main.68c56961.chunk.js.map",
        "runtime-main.js": "/static/js/runtime-main.581cfa92.js",
        "runtime-main.js.map": "/static/js/runtime-main.581cfa92.js.map",
        "static/js/2.b0027d17.chunk.js": "/static/js/2.b0027d17.chunk.js",
        "static/js/2.b0027d17.chunk.js.map": "/static/js/2.b0027d17.chunk.js.map",
        "index.html": "/index.html",
        "precache-manifest.0d3164431d360eec7c5eb7dd650459a9.js": "/precache-manifest.0d3164431d360eec7c5eb7dd650459a9.js",
        "service-worker.js": "/service-worker.js",
        "static/css/main.5ecd60fb.chunk.css.map": "/static/css/main.5ecd60fb.chunk.css.map",
        "static/js/2.b0027d17.chunk.js.LICENSE.txt": "/static/js/2.b0027d17.chunk.js.LICENSE.txt"
      },
      "entrypoints": [
        "static/js/runtime-main.581cfa92.js",
        "static/js/2.b0027d17.chunk.js",
        "static/css/main.5ecd60fb.chunk.css",
        "static/js/main.68c56961.chunk.js"
      ]
    }
    ```

    - "main.css"
    - "main.js"
    - "runtime-main.js"
    - "static/js/2.b0027d17.chunk.js"

22. 정적파일 주입 서버 코드 작성 (index.server.js)


    ```javascript
    // index.server.js

    import React from 'react';
    import ReactDOMServer from 'react-dom/server';
    import express from 'express';
    import { StaticRouter } from 'react-router-dom';
    import App from './App';
    import path from 'path';
    // ----- 추가 -----
    import fs from 'fs';

    // asset-manifest.json에서 파일 경로들을 조회합니다.
    const manifest = JSON.parse(fs.readFileSync(path.resolve('./build/asset-manifest.json'), 'utf8'));

    const chunks = Object.keys(manifest.files)
      .filter(key => /chunk\.js$/.exec(key)) // chunk.js로 끝나는 키를 찾아서
      .map(key => `<script src="${manifest.files[key]}"></script>`) // 스크립트 태그로 변환하고
      .join(''); // 합침

    function createPage(root) {
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
        <script src="${manifest.files['runtime-main.js']}"></script>
        ${chunks}
        <script src="${manifest.files['main.js']}"></script>
      </body>
      </html>
      `;
    }
    // ----- 추가(end) -----
    const app = express();

    // 서버 사이드 렌더링을 처리할 핸들러 함수
    const serverRender = (req, res, next) => {
      // 이 함수는 404가 떠야 하는 상황에 404를 띄우지 않고 서버 사이드 렌더링을 해줌.

      const context = {};
      const jsx = (
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      );
      const root = ReactDOMServer.renderToString(jsx); // 렌더링을 하고
      // ----- 추가 -----
      res.send(createPage(root)); // 클라이언트에게 결과물을 응답함.
      // ----- 추가(end) -----
    };

    const serve = express.static(path.resolve('./build'), {
      index: false, // "/" 경로에서 index.html을 보여 주지 않도록 설정
    });

    app.use(serve); // 순서가 중요함. serverRender 전에 위치해야 한다.
    app.use(serverRender);

    // 5000 포트로 서버를 가동함.
    app.listen(5000, () => {
      console.log('Running on http://localhost:5000');
    });

    const html = ReactDOMServer.renderToString(<div>Hello Server Side Rendering!</div>);

    console.log(html);

    ```

23. 결과 테스트

    `$ yarn build`
    `$ yarn build:server`
    `$ yarn start:server`


    ![image-20200211170718628](/Users/chocompany/Library/Application Support/typora-user-images/image-20200211170718628.png)

##### 기본적인 서버 사이드 렌더링 완료.

---
