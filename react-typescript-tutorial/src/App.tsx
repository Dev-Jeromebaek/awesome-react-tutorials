import React from "react";
import "./App.css";
import Greetings from "./Greetings";
import Counter from './Counter';
import MyForm from './MyForm';
import ReducerSample from './ReducerSample';

const App: React.FC = () => {
  const onClick = (name: string) => {
    console.log(`${name} says hello`);
  };
  const onSubmit = (form: { name: string; description: string }) => {
    console.log(form);
  };

  return (
    <div>
      <h3>1. 일반 TS 컴포넌트 테스트</h3>
      <Greetings name='React' onClick={onClick} />
      <hr />
      <h3>2. Counter</h3>
      <Counter />
      <hr />
      <h3>3. Form</h3>
      <MyForm onSubmit={onSubmit} />
      <hr />
      <h3>4. ReducerSample</h3>
      <ReducerSample />
    </div>
  );
};

export default App;
