import React, { Component, Fragment } from 'react';

import InfoInsert from './InfoInsert';
import InfoList from './InfoList';

class InfoFrame extends Component {
  id = 0;

  state = {
    information: [],
    keyword: '',
  };
  handleChange = e => {
    this.setState({
      keyword: e.target.value,
    });
  };

  handleCreate = data => {
    console.log(data);
    const { information } = this.state;
    // 비구조화 할당 문법 destructuring assignment
    // 배열이나 객체의 요소를 해체하여 별개의 변수로 추출할 수 있도록 하는 것입니다.
    // 변수에 값을 직접 할당하는 것이 아닌 배열이나 객체를 활용해 분해 할당하는 방법.

    this.setState({
      // information: this.state.information.concat(data),
      // 기존에 데이터만 넣던 방식을 id에 묶어서 입력하게끔 변경
      // ... 문법 spred
      // 방법 1.
      // information: this.state.information.concat({ id: this.id++, ...data }),

      // 방법 2.
      // information: this.state.information.concat({
      //   id: this.id++,
      //   name: data.name,
      //   age: data.age,
      // }),

      // 방법 3.
      information: this.state.information.concat(
        Object.assign(
          {}, // 빈 Object 공간을 만들고
          {
            id: this.id++,
          }, // 그안에 id와 data를 넣어준다.
          data,
        ),
      ),
      // 여기서 id 값은 단지 참조에 의한 값으로,
      // 리렌더링 되는 값이 아니기 때문에 궂이 setState를 통해 넣어주지 않는다.

      // push() vs concat()
      // .concat() : 기존에 있던 배열은 수정하지 않고,
      //             새로운 배열을 만든 뒤 그 배열에(data)라는 값을 넣어
      //             기존 information 배열의 자리에 넣어준다.
    });
  };

  handleRemove = id => {
    const { information } = this.state;
    this.setState({
      information: information.filter(info => info.id !== id),
    });
  };

  handleUpdate = (id, data) => {
    const { information } = this.state;
    this.setState({
      // 방법 1.
      information: information.map(info => {
        if (info.id === id) {
          return {
            id,
            ...data,
          };
        }
        return info;
      }),
      // 방법 2.
      // information: information.map(
      //   info =>
      //     id === info.id
      //       ? { ...info, ...data } // 새 객체를 만들어서 기존의 값과 전달받은 data 을 덮어씀
      //       : info, // 기존의 값을 그대로 유지
      // ),
    });
  };

  render() {
    const { information, keyword } = this.state;
    const filteredList = information.filter(
      info => info.name.indexOf(keyword) !== -1,
    );
    return (
      <Fragment>
        <InfoInsert onCreate={this.handleCreate} />
        {/* 결과 : {JSON.stringify(this.state.information)} */}
        <p>
          <input
            placeholder="검색 할 이름 입력"
            onChange={this.handleChange}
            value={keyword}
          />
        </p>
        <InfoList
          data={filteredList}
          onRemove={this.handleRemove}
          onUpdate={this.handleUpdate}
        />
      </Fragment>
    );
  }
}

export default InfoFrame;
