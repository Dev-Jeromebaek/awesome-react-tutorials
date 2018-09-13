import React, { Component } from 'react';
import UserList from './UserList';
import { Map, List } from 'immutable';

class App extends Component {
  id = 3;
  state = {
    data: Map({
      input: '',
      users: List([
        Map({
          id: 1,
          username: 'jeromebaek',
        }),
        Map({
          id: 2,
          username: 'seubgyeob',
        }),
      ]),
    }),
  };

  onChange = e => {
    const { value } = e.target;
    const { data } = this.state;
    this.setState({
      data: data.set('input', value),
    });
  };

  onButtonClick = e => {
    const { data } = this.state;

    this.setState({
      data: data.set('input', '').update('users', users =>
        users.push(
          Map({
            id: this.id++,
            username: data.get('input'),
          }),
        ),
      ),
    });
  };

  render() {
    const { onChange, onButtonClick } = this;
    const { data } = this.state;
    const input = data.get('input');
    const users = data.get('users');

    return (
      <div>
        <div>
          <input onChange={onChange} value={input} />
          <button onClick={onButtonClick}>추가</button>
        </div>
        <h1>사용자 목록</h1>
        <div>
          <UserList users={users} />
        </div>
      </div>
    );
  }
}

export default App;
