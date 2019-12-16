import React, { useState } from "react";

type Information = {
  name: string;
  description: string;
};

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

function Counter() {
  const [count, setCount] = useState(0); // useState<number>Generics을 꼭 사용하지 않아도 됨.
  const [info, setInformation] = useState<Information | null>(null); // 하지만 상태가 null 일 수도 있고 아닐수도 있을 때 Generics를 활용하면 좋음.
  const [todos, setTodos] = useState<Todo[]>([]); // 추가적으로 상태의 타입이 까다로운 구조를 가진 객체이거나 배열일 때는 Generics를 명시하는 것이 좋음.
  // const [todos, setTodos] = useState([] as Todo[]); // Type Assertion 문법을 사용할 수도 있음 ('특정 값이 특정 타입이다'라는 정보를 덮어쓸 수 있는 문법)
  const onIncrease = () => setCount(count + 1);
  const onDecrease = () => setCount(count - 1);
  return (
    <div>
      <h1>{count}</h1>
      <div>
        <button onClick={onIncrease}>+1</button>
        <button onClick={onDecrease}>-1</button>
      </div>
    </div>
  );
}

export default Counter;
