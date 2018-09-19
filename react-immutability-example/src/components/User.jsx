import React, { Component } from 'react';

class User extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.user !== nextProps.user;
  }

  render() {
    // 방법 1.
    const { username } = this.props.user.toJS();
    // 방법 2.
    // const username = this.props.user.get('username');
    console.log(username + '가 렌더링 되고있음!!');

    return <div>{username}</div>;
  }
}

export default User;
