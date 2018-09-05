import React, { Component } from 'react';

class TestState extends Component {
  state = {
    number: 0,
  };

  // handleIncrease = () => {
  //   this.setState({
  //     number: this.state.number + 1,
  //   });
  // };
  handleIncrease = () => {
    const { number } = this.state;
    this.setState({
      number: number + 1,
    });
  };

  // handleDecrease = () => {
  //   this.setState({
  //     number: this.state.number - 1,
  //   });
  // };
  handleDecrease = () => {
    this.setState(({ number }) => ({
      number: number - 1,
    }));
  };

  render() {
    return (
      <div>
        <h4>State Example</h4>
        <div>값: {this.state.number}</div>
        <button onClick={this.handleIncrease}>+</button>
        <button onClick={this.handleDecrease}>-</button>
      </div>
    );
  }
}

export default TestState;
