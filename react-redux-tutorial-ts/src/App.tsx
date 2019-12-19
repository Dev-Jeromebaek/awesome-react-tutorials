import React from "react";
import Counter from "./components/Counter";
import TodoInsert from "./components/TodoInsert";
import TodoList from "./components/TodoList";

function App() {
  return (
    <>
      <Counter />
      <hr />
      <TodoInsert />
      <TodoList />
    </>
  );
}

export default App;
