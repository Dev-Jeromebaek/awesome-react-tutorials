import React, { Component } from 'react';

class TestComponent extends Component {
  state = {
    value: 0,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('--static getDrivedStateFromProps');
    if (prevState.value !== nextProps.value) {
      return {
        value: nextProps.value,
      };
    }
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('--shouldComponentUpdate');
    if (nextProps.value % 2 === 0) return false;
    return true;
  }

  render() {
    return (
      <div>
        <p>props: {this.props.value}</p>
        <p>state: {this.state.value}</p>
      </div>
    );
  }
}

export default TestComponent;
