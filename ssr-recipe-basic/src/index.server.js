/**
 * 서버에서 리액트 컴포넌트를 렌더링할 때는 ReactDOMServer의 renderToString이라는 함수를 사용한다.
 * 이 함수에 JSX를 넣어서 호출하면 렌더링 결과를 문자열로 반환함.
 */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import path from 'path';
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
  res.send(createPage(root)); // 클라이언트에게 결과물을 응답함.
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

/**
 * StaticRouter는 주로 서버 사이드 렌더링 용도로 사용되는 라우터로 props로 넣어주는 location 값에 따라 라우팅해줌.
 * 지금은 req.url이라는 값을 넣어주었는데, 여기서 req 객체는 요청에 대한 정보를 지니고 있음.
 * context라는 props도 넣어주었는데, 이 값을 사용하여 나중에 렌더링한 컴포넌트에 따라 HTTP 상태 코드를 설정해 줄 수 있음.
 */

const html = ReactDOMServer.renderToString(<div>Hello Server Side Rendering!</div>);

console.log(html);
