import React from 'react';
import PropTypes from 'prop-types';

function createWarning(funcName) {
  return () => console.warn(`${funcName} is not defined in Control.jsx`);
}

const propTypes = {
  onPlus: PropTypes.func,
  onSubtract: PropTypes.func,
  onInitialize: PropTypes.func,
  onChangeColor: PropTypes.func,
};

const defaultProps = {
  onPlus: createWarning('onPlus'),
  onSubtract: createWarning('onSuntract'),
  onInitialize: createWarning('onInitialize'),
  onChangeColor: createWarning('onChangeColor'),
};

function Control({
  onPlus, onSubtract, onInitialize, onChangeColor,
}) {
  return (
    <div>
      <button type="button" onClick={onPlus}>
                +
      </button>
      <button type="button" onClick={onSubtract}>
                -
      </button>
      <button type="button" onClick={onChangeColor}>
                색상변경
      </button>
      <button type="button" onClick={onInitialize}>
                초기화
      </button>
    </div>
  );
}

Control.propTypes = propTypes;
Control.defaultProps = defaultProps;

export default Control;
