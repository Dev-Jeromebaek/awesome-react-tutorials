import React from 'react';

const RefProps = props => {
  return (
    <div>
      RefProps
      <input ref={props.inputRef} />
    </div>
  );
};

export default RefProps;
