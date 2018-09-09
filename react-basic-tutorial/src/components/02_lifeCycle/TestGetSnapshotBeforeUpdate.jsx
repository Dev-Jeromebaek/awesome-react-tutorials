import React, { Component } from 'react';

import '../../assets/stylesheets/css/ScrollBox.css';

class TestGetSnapshotBeforeUpdate extends Component {
  id = 2;

  state = {
    array: [1],
  };

  handleInsert = () => {
    this.setState({
      array: [this.id++, ...this.state.array],
    });
  };

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('--getSnapshotBeforeUpdate');
    // DOM 업데이트가 일어나기 직전의 시점입니다.
    // 새 데이터가 상단에 추가되어도 스크롤바를 유지해보겠습니다.
    // scrollHeight 는 전 후를 비교해서 스크롤 위치를 설정하기 위함이고,
    // scrollTop 은, 이 기능이 크롬에 이미 구현이 되어있는데,
    // 이미 구현이 되어있다면 처리하지 않도록 하기 위함이다.
    if (prevState.array !== this.state.array) {
      const { scrollTop, scrollHeight } = this.list;

      // 여기서 반환 하는 값은 componentDidMount 에서 snapshot 값으로 받아올 수 있습니다.
      return {
        scrollTop,
        scrollHeight,
      };
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('--componentDidUpdate');
    // console.log(this.list.scrollHeight);
    // console.log(snapshot.scrollHeight);
    if (snapshot) {
      const { scrollTop } = this.list;
      if (scrollTop !== snapshot.scrollTop) return; // 기능이 이미 구현되어있다면 처리하지 않습니다.
      const diff = this.list.scrollHeight - snapshot.scrollHeight;
      this.list.scrollTop += diff;
    }
  }

  render() {
    const rows = this.state.array.map(number => (
      <div className="row" key={number}>
        {number}
      </div>
    ));

    return (
      <div>
        <div
          ref={ref => {
            this.list = ref;
          }}
          className="list"
        >
          {rows}
        </div>
        <button onClick={this.handleInsert}>Add List</button>
      </div>
    );
  }
}

export default TestGetSnapshotBeforeUpdate;
