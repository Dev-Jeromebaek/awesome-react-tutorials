import React, { Component } from 'react';

class Literal extends Component {
  render() {
    let name = 'jbee';
    let num = 27;
    function greet (text, ...value) {
      console.log(text);
      console.log(value);
      // console.log(typeof value);
    }
    greet `hi, ${name}! Have a nice day! ${num} is your number`;

    return (
      <div>
        <p>testPage</p>
      </div>
    );
  }
}

export default Literal;