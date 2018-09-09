import React, { Component } from 'react';
import InputForm from './InputForm';

class ParentEvent extends Component {
  handleCreate = data => {
    console.log(data);
  };
  render() {
    return (
      <div>
        <InputForm onCreate={this.handleCreate} />
      </div>
    );
  }
}

export default ParentEvent;
