import React, { Component } from 'react';

import TestComponent from './TestComponent';
import TestGetSnapshotBeforeUpdate from './TestGetSnapshotBeforeUpdate';
import TestDidCatch from './TestDidCatch';

class TestLifeCycle extends Component {
  state = {
    counter: 1,
  };
  constructor(props) {
    super(props);

    console.log('--constructor');
    this.divRef = React.createRef();
  }

  componentDidMount() {
    console.log('--componentDidMount');
    console.log(this.divRef);
    this.divRef.current.click();
  }

  handleClick = () => {
    this.setState({
      counter: this.state.counter + 1,
    });
  };

  render() {
    return (
      <div>
        <h3>test lifecycle</h3>
        <button ref={this.divRef} onClick={() => console.log('--divRef Click')}>
          test ref Click
        </button>
        <TestComponent value={this.state.counter} />
        <button onClick={this.handleClick}>Plus Counter</button>
        <hr />
        <TestGetSnapshotBeforeUpdate />
        <br />
        <hr />
        <TestDidCatch />
      </div>
    );
  }
}

export default TestLifeCycle;
