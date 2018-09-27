import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Value extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.number}</h1>
      </div>
    );
  }
}

Value.defaultProps = {
  number: -1,
};

Value.propTypes = {
  number: PropTypes.number,
};

export default Value;
