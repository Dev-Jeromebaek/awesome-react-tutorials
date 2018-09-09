import React, { Component } from 'react';

const Problematic = () => {
  throw new Error('에러 발생.');
  return <div />;
};

class TestDidCatch extends Component {
  state = {
    number: 0,
    error: false,
  };

  componentDidCatch(error, info) {
    this.setState({
      error: true,
    });
  }

  handleIncrease = () => {
    const { number } = this.state;
    this.setState({
      number: number + 1,
    });
  };

  handleDecrease = () => {
    this.setState(({ number }) => ({
      number: number - 1,
    }));
  };

  render() {
    if (this.state.error) return <h1>에러발생</h1>;
    return (
      <div>
        <h4>componentDidCatch Example</h4>
        <div>값: {this.state.number}</div>
        {this.state.number === 4 && <Problematic />}
        <button onClick={this.handleIncrease}>+</button>
        <button onClick={this.handleDecrease}>-</button>
      </div>
    );
  }
}

export default TestDidCatch;
