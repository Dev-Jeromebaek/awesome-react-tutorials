import React, { Component } from 'react';

import './assets/stylesheets/css/style.css';

import TestProps from './components/01_basic/TestProps';
import TestState from './components/01_basic/TestState';
import TestLifeCycle from './components/02_lifeCycle/TestLifeCycle';
import ParentEvent from './components/03_formState/ParentEvent';
import InfoFrame from './components/04_array/InfoFrame';
import RefTestComponent from './components/05_refs/RefTestComponent';

class App extends Component {
  render() {
    const title = 'React Tutorials';
    let testText = 'test props...';
    let func_1 = () => {
      console.log('this is validation test function!');
    };
    return (
      <div>
        <h1 className="title">{title}</h1>
        <hr />
        <br />
        <h2>01.Props and State Management</h2>
        <h3>- Props와 State 개념 익히기</h3>
        <TestProps valid={func_1} />
        <TestState />
        <hr />
        <br />
        <h2>02.React LifeCycle</h2>
        <h3>- LifeCycle Api 사용법 숙지</h3>
        <TestLifeCycle />
        <hr />
        <br />
        <h2>03.React Input State Management</h2>
        <h3>- form 과 input 상태 관리하기</h3>
        <ParentEvent />
        <hr />
        <br />
        <h2>04.Array Management</h2>
        <h3>- 배열 데이터 렌더링 및 관리</h3>
        <InfoFrame />
        <hr />
        <br />
        <h2>05.Refs</h2>
        <h3>- Refs 와 DOM 엘리먼트</h3>
        <RefTestComponent />
        <hr />
        <br />
      </div>
    );
  }
}

export default App;
