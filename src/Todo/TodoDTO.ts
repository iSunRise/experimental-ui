import {UserDTO} from "../User/UserDTO";

type ShortTodoDTO = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  completed: boolean;
}

type TodoDTO = ShortTodoDTO & {
  user: UserDTO;
}

export type { ShortTodoDTO, TodoDTO };
