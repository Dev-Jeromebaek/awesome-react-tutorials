import React, { Component } from 'react';

class User extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.user !== nextProps.user;
  }

  render() {
    const { username } = this.props.user.toJS();
    console.log(username + '가 렌더링 되고있음!!');

    return <div>{username}</div>;
  }
}

export default User;
