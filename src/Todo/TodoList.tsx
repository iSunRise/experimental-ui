import React, { useState } from "react";
import TodoRepo from "./TodoRepo";
import TodoItem from "./TodoItem";

const TodoList: React.FC<{}> = () => {
  const { list } = TodoRepo.useList();
  const [ selectedId, setSelectedId ] = useState<number>();

  if (!list) return null;
  return (
      <div>
        <h1>Todo list</h1>
        <ul>
          {list.map((todo) => <li key={todo.id} onClick={() => setSelectedId(todo.id)}>{todo.name}</li>)}
        </ul>
        {selectedId && (
            <TodoItem id={selectedId} />
        )}
      </div>
  )
}

export default TodoList;
