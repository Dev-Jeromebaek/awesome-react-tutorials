import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Control extends Component {
  static propTypes = {
    onPlus: PropTypes.func,
    onSubtract: PropTypes.func,
    onRandomizeColor: PropTypes.func,
  };
  createWarning = funcName => {
    return console.wran(funcName + ' is not defined');
  };
  static defualtProps = {
    onPlus: () => createWarning('onPlus'),
    onSubtract: () => createWarning('onSubtract'),
    onRandomizeColor: () => createWarning('onSubtract'),
  };

  render() {
    return (
      <div>
        <button onClick={this.props.onPlus}>+</button>
        <button onClick={this.props.onSubtract}>-</button>
        <button onClick={this.props.onRandomizeColor}>Randomize Color</button>
      </div>
    );
  }
}
