import React, { Component, Fragment } from 'react';

class InfoManagement extends Component {
  state = {
    editing: false,
    name: '',
    age: '',
  };

  handleToggleEdit = () => {
    const { info, onUpdate } = this.props;
    // true -> false
    // onUpdate
    if (this.state.editing) {
      onUpdate(info.id, { name: this.state.name, age: this.state.age });
      // false -> true
      // state 에 info 값을 넣어줌.
    } else {
      this.setState({
        name: info.name,
        age: info.age,
      });
    }
    this.setState({
      editing: !this.state.editing,
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleRemove = () => {
    const { info, onRemove } = this.props;
    onRemove(info.id);
  };

  shouldComponentUpdate(nextProps, nextState) {
    // 수정 상태가 아니고, info 값이 같다면 리렌더링 안함
    if (
      !this.state.editing &&
      !nextState.editing &&
      nextProps.info === this.props.info
    ) {
      return false;
    }
    // 나머지 경우엔 리렌더링함
    return true;
  }

  render() {
    console.log('render InfoManagement ' + this.props.info.id);
    const { name, age } = this.props.info;
    const { editing } = this.state;

    const style = {
      border: '1px solid black',
      padding: '8px',
      margin: '8px',
    };

    return (
      <Fragment>
        <div style={style}>
          {editing ? (
            <Fragment>
              <div>
                <input
                  onChange={this.handleChange}
                  name="name"
                  value={this.state.name}
                />
              </div>
              <div>
                <input
                  onChange={this.handleChange}
                  name="age"
                  value={this.state.age}
                />
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div>
                <b>{name}</b>
              </div>
              <div>{age}</div>
            </Fragment>
          )}
          <button onClick={this.handleToggleEdit}>
            {editing ? '적용' : '수정'}
          </button>
          <button onClick={this.handleRemove}>삭제</button>
        </div>
      </Fragment>
    );
  }
}

export default InfoManagement;
