import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  number: PropTypes.number,
  color: PropTypes.arrayOf(PropTypes.number),
};

const defaultProps = {
  number: -10,
  color: [10, 10, 10],
};

function Value({ number, color }) {
  const title = 'React Redux Counter Project';
  const style = {
    // 여기서 ES6 template literal 문법을 사용
    color: `rgb(${color[0]},${color[1]},${color[2]}`,
  };
  return (
    <div>
      <h1 style={style}>{title}</h1>
      <h1 style={style}>{number}</h1>
    </div>
  );
}

Value.propTypes = propTypes;
Value.defaultProps = defaultProps;

export default Value;
