import React, { Component, Fragment } from 'react';

import AutoFocusTextInput from './AutoFocusTextInput';
import RefFunctionalComponent from './RefFunctionalComponent';
import RefProps from './RefProps';

class RefTestComponent extends Component {
  constructor(props) {
    super(props);
    this.testRef = React.createRef();
    this.functionalTextInput = React.createRef();
    this.inputElement = React.createRef();
  }
  componentDidMount() {
    console.log('ref - testRef');
    console.log(this.testRef);
    console.log('ref - functionalTextInput');
    console.log(this.functionalTextInput);
    console.log('ref - inputElement');
    console.log(this.inputElement);
  }
  render() {
    return (
      <Fragment>
        <div ref={this.testRef}>ref Test</div>
        <AutoFocusTextInput />
        <br />
        <RefFunctionalComponent ref={this.functionalTextInput} />
        <br />
        <RefProps inputRef={this.inputElement} />
      </Fragment>
    );
  }
}

export default RefTestComponent;
