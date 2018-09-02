import React, { Component } from 'react';

import './assets/stylesheets/css/style.css';

import TestProps from './components/01_basic/TestProps';
import TestState from './components/01_basic/TestState';
import TestLifeCycle from './components/02_lifeCycle/TestLifeCycle';

class App extends Component {
  render() {
    const title = 'TODO List';
    let testText = 'test props...';
    let func_1 = () => {
      console.log('this is validation test function!');
    };
    return (
      <div>
        <div className="title">{title}</div>
        <TestProps valid={func_1} />
        <TestState />
        <TestLifeCycle />
      </div>
    );
  }
}

export default App;
