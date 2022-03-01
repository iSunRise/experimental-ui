import { BaseEntity } from "../BaseRepo";

import {ShortTodoDTO, TodoDTO} from "./TodoDTO";
import User from "../User/User";


class ShortTodo extends BaseEntity<ShortTodoDTO> {
  // protected dto: ShortTodoDTO;

  constructor(dto: ShortTodoDTO) {
    super(dto);
  }

  get id() { return this.dto.id }

  get name() {
    return `${this.dto.title} /${this.dto.completed ? 'completed' : 'incomplete'}/`
  }

  getDTO() {
    return this.dto;
  }
}

class Todo extends ShortTodo {
  data: TodoDTO;

  constructor(data: TodoDTO) {
    super(data);
    this.data = data;
  }

  getDTO(): TodoDTO {
    return this.data;
  }

  get userId() {
    return this.data.user.id;
  }
}

class TodoWithUser extends Todo {
  private user: User;

  constructor(data: TodoDTO, user: User) {
    super(data);
    this.user = user;
  }

  get description() {
    return `Created by: ${this.user.name}`;
  }
}



const useTodoController = () => {
  const todo = todoRepo.useItem(1);
  const { update, todoDraft } = todoRepo.useUpdate(todo);

  const onNameChange (name: string) => {
    todoDraft.name = name;
  }

  const onSubmit () => {
    update(todoDraft);
  }
}

const useCreateTodoController = () => {
  const todo = todoRepo.useBuildTodo(1);
  const { create, todoDraft } = todoRepo.useCreate(todo);

  const onNameChange (name: string) => {
    todoDraft.name = name;
  }

  const onSubmit () => {
    create(todoCopy);
  }
}

export { BaseEntity, ShortTodo, Todo, TodoWithUser };
