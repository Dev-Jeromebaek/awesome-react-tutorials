import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Value from '../components/counter/Value';
import Control from '../components/counter/Control';

import * as actions from '../actions';

function createWarning(funcName) {
  return () => console.warn(`${funcName} is not defined in Counter.jsx`);
}

const propTypes = {
  color: PropTypes.arrayOf(PropTypes.number),
  number: PropTypes.number,
  increment: PropTypes.func,
  decrement: PropTypes.func,
  initialize: PropTypes.func,
  changeColor: PropTypes.func,
};

const defaultProps = {
  color: [0, 0, 0],
  number: -1,
  increment: createWarning('onPlus'),
  decrement: createWarning('onSuntract'),
  initialize: createWarning('onInitialize'),
  changeColor: createWarning('onChangeColor'),
};

class Counter extends Component {
    setRandomColor = () => {
      const { changeColor } = this.props;
      const color = [
        Math.floor(Math.random() * 75 + 150),
        Math.floor(Math.random() * 75 + 150),
        Math.floor(Math.random() * 75 + 150),
      ];
      changeColor(color);
    };

    render() {
      const {
        number, color, increment, decrement, initialize,
      } = this.props;
      return (
        <div>
          {/* <Value number={this.props.store.getState().counter.number}/> */}
          {/* 원래 위에 처럼 불러와서 사용해야 하는데,  */}
          {/* connect() 함수에 mapStateToProps() 와 mapDispatchToProps()를 */}
          {/* 전달해 주었기 때문에 아래와 같이 사용할 수 있다. */}
          <Value number={number} color={color} />
          <Control
            onPlus={increment}
            onSubtract={decrement}
            onInitialize={initialize}
            onChangeColor={this.setRandomColor}
          />
        </div>
      );
    }
}

// mapStateToProps
// - 리덕스에 store 안에 있는 state를 이 컴포넌트의 props로 매핑해주는것.
const mapStateToProps = state => ({
  number: state.counter.number,
  color: state.ui.color,
});

// mapDispatchToProps
// 액션을 디스패치하는 함수를 프롭스로 연결해주는것.
// 액션 크리에이터들을 불러온다.
// import * as actions from '../actions';
// 그 다음 여기서 함수를 어떻게 작성하냐면
// 먼저 INCREMENT 를 담당할 함수 handelIncrement() 를 만들고
// 이 함수를 통해 액션 생성자에서 만든 actions.increment() 를 dispatch() 한다.
// dispatch(actions.increment())
// mapDispatchToProps 는 아래와 같이 사용하면 된다.
// const mapDispatchToProps = dispatch => {
//   return {
//     handelIncrement: () => {
//       dispatch(actions.increment());
//     },
//     handleDecrement: () => {
//       dispatch(actions.decrement());
//     },
//     handleInitialize: () => {
//       dispatch(actions.initialize());
//     },
//     handleChangeColor: color => {
//       dispatch(actions.changeColor(color));
//     },
//   };
// };
// 다만 여기서 mapDispatchToProps 를 좀 더 쉽게 사용하는 방법이 있는데,
// 우선 이를 사용해보기 위해 redux 에서 bindActionCreators 를 불러온다.
// import { bindActionCreators } from 'redux';
// 그 다음 mapDispatchToProps를 주석처리하고 아래와 같이 사용하면 된다.
// bindActionCreators() 의 첫번째 매개변수는 action creator들이 들어있는
// 객체 actions 를 넣어주고 두번째 매개변수로는 dispatch를 넣어주면 모든걸 알아서 처리해준다.
// 다만 단점이라면 액션생성자에서 만든 함수의 이름 그대로를 사용한다.
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// 그렇다면 이제 이 카운터를 방금만든 mapStateToProps 와 mapDispatchToProps 를 통해 redux 와 연결해보도록 하자.
// 그러러면 일단 connect 함수를 사용한다.
// export default connect()(Counter);
// connect() 함수가 새로운 함수를 반환하고
// 그 반환된 함수에 Counter를 인수로 넣어준 것이다.

Counter.propTypes = propTypes;
Counter.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Counter);
