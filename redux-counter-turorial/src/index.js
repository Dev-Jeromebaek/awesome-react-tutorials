import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App';

import reducers from './reducers';

// test
// import * as actions from './actions';

// store가 하는일
// 1. dispatch(action)
//      - action을 리듀서로 보낸다는것.
//      - 스토어는 리듀서에 현재 자신의 상태와 방금 전달받은 액션을 전달해준다.
//      - 그러면 리듀서가 어떠한 변화가 필요한지 알아내서 변화를주고
//      - 새 상태를 주면 현 상태에 갈아끼우는 것이다.
// 2. getState()
//      - 현재 상태를 반환하는 함수
// 3. subscribe(listener)
//      - 상태가 바뀔때마다 실행할 함수를 등록하는것.
//      - 여기서 listener가 상태가 바뀔때마다 실행될 콜백함수
// 4. replaceReducer(nextReducer)
//      - hot reloading 과 코드분할을 구현할때 사용하는 것.
//      - 보통 사용되지 않으니 여기선 구현하지 않겠음.
const store = createStore(reducers);

// getState() 테스트
// console.log(store.getState());

// subscribe() 사용하기
// store.subscribe(() => console.log(store.getState()));

// 더이상 알림이 받기 싫은 경우 unsubscribe
// const unsubscribe = store.subscribe(() => console.log(store.getState()));

// 액션을 보내보자. 액션크리에이터를 불러온다.
// dispatch() 사용하기
// store.dispatch(actions.increment());
// store.dispatch(actions.increment());
// store.dispatch(actions.increment());
// store.dispatch(actions.decrement());
// store.dispatch(actions.initialize());
// store.dispatch(actions.changeColor([200, 200, 200]));

// unsubscribe();
// store.dispatch(actions.changeColor([210, 210, 210]));

// react-redux의 핵심
// 1. Provider
//      - Provider는 하나의 컴포넌트이다.
//      - 프로젝트에서 사용하는 컴포넌트를 react dom 으로 페이지에 렌더링 하게 될 때,
//        해당 컴포넌트를 이 Provider 컴포넌트로 감싸주면
//        이 Provider 가 복잡한 작업들을 알아서 해준다.

// react-redux에서 Provider 불러오기
// 그다음 Provider로 App 컴포넌트 감싸주고 store를 props로 넘겨준다.

// 2. connect([...options])
//      - 컴포넌트를 redux 에 연결하는 함수를 반환한다.
//      - option 을 인수로 받고 전달받은 옵션을 사용해서 컴포넌트를
//        리덕스에 연결하는 "또 다른" 함수를 반환한다.

//      - 그래서 그 함수에 Counter 를 인수로 전달해주면 그 Counter가 리덕스에 연결이되서
//        함수의 반환값으로 새로운 컴포넌트 클래스가 반환된다
//        새로운 컴포넌트는 리덕스에 연결이 되어있구요
//        그렇다고해서 기존의 컴포넌트가 변경되는 것이 아닌 새로운 컴포넌트가 반환되는 것.

//      - connect()(Counter)
//          - sotre에 연결된 새로운 컴포넌트 클래스가 반환됨.
//          - 옵션이 없으면 this.props.store 로 접근 가능

//        만약 위에 주석된 코드처럼 connect에 옵션을 전달하지 않았다면,
//        컴포넌트 내부에서 this.props.state 로 접근할 수 있다.
//        그러면 렌더링할때 그 스토어를 사용해서 getState로 특정값을 가져오면 되겠고
//        아니면 변화를 일으킬때 dispatch 하면 되겠죠

//        그런데 여기에 옵션을 넣게되면 더 편해진다.
//        그 옵션이 뭐냐
//        connect(
//          [mapStateToProps],
//          [mapDispatchToProps],
//          [mergeProps],
//          [options]  <- {[pure = true],[withRef = false]}
//        ),

//  위에 3개는 함수형 파라미터
//  mapStateToProps : state를 파라미터로 가진 함수이고,
//                    state를 해당 컴포넌트의 props로 연결해 주는 것이고,
//  mapDispatchToProps : 디스패치를 파라미터로 가진 함수이고,
//                       디스패처한 함수를 props로 연결해준다.
//  mergeProps : 스테이트와 디스패치를 파라미터로 가져서 만약 컴포넌트에 연결해야할
//               props가 state랑 dispatch를 동시에 사용해야 한다면 
//               이걸 이용하면 되는데 잘 사용하지 않는다.
//  options : 객체형태인데, pure와 withRef가 있다.
//            pure는 기본적으로 ture로 설정되어있는데 이게 true 설정되어있으면,
//            불필요한 업데이트를 하지 않는다.
//            withRef는 기본적으로 false이고,
//            만약 이게 true로 설정되어 있으면,
//            리덕스에 연결된 컴포넌트를 ref에 담아서, 
//            getWrappedInstance()를 통하여 접근할 수 있게한다.
//            보통은 사용될 일이 별로 없다.

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'),
);
