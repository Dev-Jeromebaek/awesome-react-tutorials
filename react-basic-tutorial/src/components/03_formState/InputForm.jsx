import React, { Component } from 'react';

class InputForm extends Component {
  state = {
    name: '',
    age: '',
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      // [e.target.name]: 설정한 태그의 name값을 event 객체를 통해 가져와서 사용함.
    });
  };

  handleSubmit = e => {
    // 페이지 리로딩 방지
    e.preventDefault();
    // 상태값을 onCreate 를 통하여 부모에게 전달
    this.props.onCreate(this.state);
    // 상태 초기화
    this.setState({
      name: '',
      age: '',
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          name="name"
          placeholder="이름"
          onChange={this.handleChange}
          value={this.state.name}
        />
        {this.state.name}
        <br />
        <input
          name="age"
          placeholder="나이"
          onChange={this.handleChange}
          value={this.state.age}
        />
        {this.state.age}
        <br />
        <button type="submit">등록</button>
      </form>
    );
  }
}

export default InputForm;
