import React, { Component } from 'react';
import PeoList from '../presentational/PeoList';

class PeoInfoFrame extends Component {
  state = {
    id: 3,
    peopleList: [
      { id: 0, name: 'jerome', age: 28 },
      { id: 1, name: 'baek', age: 26 },
      { id: 2, name: 'yeob', age: 30 }
    ]
  };

  deletePeople = id => {
    const { peopleList } = this.state;
    this.setState({
      peopleList: peopleList.filter(info => info.id !== id)
    });
  };

  render() {
    const { peopleList } = this.state;
    return <PeoList info={peopleList} onRemove={this.deletePeople} />;
  }
}

export default PeoInfoFrame;
