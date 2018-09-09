import React, { Component } from 'react';
import InfoManagement from './InfoManagement';

class InfoList extends Component {
  static defaultProps = {
    data: [],
    onRemove: () => console.warn('onRemove not defined'),
    onUpdate: () => console.warn('onUpdate not defined'),
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.data !== this.props.data;
  }

  render() {
    console.log('render InfoList');
    const { data, onRemove, onUpdate } = this.props;

    if (!data) return null;

    // map()에 key가 중요한 이유!
    // component를 여러개 rendering 할때
    // key를 통해 고유값을 정해줌으로써 추후 업데이트 성능을 최적화 해줌.
    // key가 없다면 기본적으로 index로 접근하겠지만 CRUD시에
    // id값이 index와 다르게 작동할 수 있기 때문에
    // key값을 따로 정의해 주는것이 좋다.
    const list = data.map(info => (
      <InfoManagement
        onRemove={onRemove}
        onUpdate={onUpdate}
        info={info}
        key={info.id}
      />
    ));

    return <div>{list}</div>;
  }
}

export default InfoList;
