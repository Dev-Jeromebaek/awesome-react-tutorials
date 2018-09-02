import React, { Component } from 'react';

class TestState extends Component {
  state = {
    name: 1,
    timmer: true,
    hot: '',
  };

  setTimmer = () => {
    this.setState({
      name: this.state.name + 1,
    });
  };

  optionTimmer = () => {
    this.setState({
      hot: 'jerome',
    });
    const { timmer } = this.state;
    timmer ? this.stopTimmer() : this.startTimmer();
  };

  startTimmer = () => {
    this.setState({
      timmer: true,
    });
    this.startCycleTimmer = setInterval(this.setTimmer, 1000);
  };

  stopTimmer = () => {
    clearInterval(this.startCycleTimmer);
    this.setState({
      timmer: false,
    });
  };

  componentDidMount() {
    this.startCycleTimmer = setInterval(this.setTimmer, 1000);
  }
  render() {
    return (
      <div>
        <p>test state component</p>
        <p>{this.state.name}</p>
        <p>{this.state.hot}</p>
        <button onClick={this.optionTimmer}>
          {this.state.timmer ? 'stop' : 'start'} timmer
        </button>
      </div>
    );
  }
}

export default TestState;
