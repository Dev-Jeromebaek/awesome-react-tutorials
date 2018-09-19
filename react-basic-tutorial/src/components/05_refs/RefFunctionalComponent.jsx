import React from 'react';

const RefFunctionalComponent = props => {
  let functionalTextInput = React.createRef();
  function handleClick() {
    functionalTextInput.current.focus();
  }
  return (
    <div>
      RefFunctionalComponent
      <br />
      <input type="text" ref={functionalTextInput} />{' '}
      <button onClick={handleClick}>Focus the text input</button>
    </div>
  );
};

export default RefFunctionalComponent;
