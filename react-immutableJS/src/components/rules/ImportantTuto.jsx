import React, { Component } from 'react';
import { Map, List } from 'immutable';

class ImportantTuto extends Component {
  render() {
    console.log('-----------------------');
    // 1. 객체는 Map( ) 을 사용하여 선언한다.
    let obj = Map({
      name: 'jerome',
      age: 28,
    });
    console.log(obj);
    // 2. 일반 JavaScript 객체로 변환 할 땐 toJS( ) 를 사용한다.
    console.log(obj.toJS());

    // 3. 배열은 List( ) 를 사용하여 선언한다.
    let arr = List([1, 2, 3]);
    console.log(arr);
    console.log(arr.toJS());

    let arrObj = List([{ foo: 1 }, { bar: 2 }]);
    console.log(arrObj);
    console.log(arrObj.toJS());

    // 4. 값을 설정할땐 set( ) 을 사용한다.
    let nextObjKey = obj.set('key');
    console.log(nextObjKey.toJS());
    let nextObj = obj.set('key', 5);
    console.log(nextObj.toJS());
    console.log(`nextObj !== obj : ${nextObj !== obj}`);

    let nextArrIndex = arr.set(5);
    console.log(nextArrIndex.toJS());
    let nextArrIndex2 = arr.set(4);
    console.log(nextArrIndex2.toJS());

    let nextArr = arr.set(5, 1);
    console.log(nextArr.toJS());

    // 5. 값을 조회할땐 get( ) 을 사용한다.
    console.log(obj.toJS());
    console.log(obj.get('name'));
    console.log(arr.toJS());
    console.log(arr.get(0));

    // 6. 값을 변경할땐 update( ) 를 사용한다.
    // 두번째 파라미터로는 updater 함수가 들어간다.
    console.log(nextObj.toJS());
    nextObj = nextObj.update('key', value => value + 1);
    console.log(nextObj.toJS());

    console.log(nextArr.toJS());
    nextArr = nextArr.update(0, value => value * 3);
    console.log(nextArr.toJS());

    // 7. 객체 혹은 배열의 내부에 대한 값을 제어할땐 ln 이 붙여진 함수를 사용한다.
    // ex) setIn( ), getIn( ), updateIn( )
    nextObj = obj.setIn(['inner', 'bar'], 20);
    console.log(nextObj.getIn(['inner', 'bar']));

    console.log(arrObj.toJS());
    let newArr = arrObj.setIn([3, 'foo'], 10);
    console.log(newArr.getIn([3, 'foo']));
    console.log(newArr.toJS());

    // 8. List 내장함수는 일반 JavaScript 배열의 내장함수와 비슷하다.
    nextArr = arrObj.push(Map({ qaz: 3 }));
    console.log(nextArr.toJS());

    console.log(arrObj.toJS());
    nextArr = arrObj.filter(item => item.foo === 1);
    console.log(nextArr.toJS());

    // 9. 객체에서 특정 key 값을 삭제하거나,
    // 배열 List 에서 원소를 삭제하려 할때는 delete( ) 를 사용하여 지운다.
    console.log(nextObj.toJS());
    nextObj = nextObj.delete('age');
    console.log(nextObj.toJS());
    nextObj = nextObj.deleteIn(['inner', 'bar']);
    console.log(nextObj.toJS());

    console.log(nextArr.toJS());
    nextArr = nextArr.delete(0);
    console.log(nextArr.toJS());
    console.log('-----------------------');
    return <div />;
  }
}

export default ImportantTuto;
