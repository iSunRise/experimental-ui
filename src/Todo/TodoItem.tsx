import React from "react";
import TodoRepo from "./TodoRepo";

type TodoItemProps = {
  id: number;
}

const TodoItem: React.FC<TodoItemProps> = (props) => {
  const { item } = TodoRepo.useItem(props.id);
  if (!item) return null;

  return (
      <div>
        <h2>Detailed information for {item.id}:</h2>
        <p>{item.description}</p>
      </div>
  )
}

export default TodoItem;
