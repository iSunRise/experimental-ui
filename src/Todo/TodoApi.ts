import {ShortTodoDTO, TodoDTO} from "./TodoDTO";
import {waitFor} from "../utils";
import {userData} from "../User/UserApi";

const data: TodoDTO[] = [
  { id: 1, createdAt: new Date(), updatedAt: new Date(), title: 'Task #1', completed: false, user: userData[0]},
  { id: 2, createdAt: new Date(), updatedAt: new Date(), title: 'Task #2', completed: false, user: userData[0]},
  { id: 3, createdAt: new Date(), updatedAt: new Date(), title: 'Task #3', completed: false, user: userData[0]}
];

const TodoApi = {
  getList: async (): Promise<ShortTodoDTO[]> => {
    console.log('-----', 'get todo list');
    await waitFor(500);
    return data;
  },
  getItem: async (id: number) => {
    console.log('-----', `get todo #${id}`);
    await waitFor(500);
    return data.find((todo) => todo.id === id) as TodoDTO;
  },
  createItem: async (todo: TodoDTO) => {
    await waitFor(500);
    const result = {
      ...todo,
      id: Math.round(Math.random() * 100000),
    };
    data.push(result);
    return result;
  },
  updateItem: async (todo: TodoDTO) => {
    await waitFor(500);
    const index = data.findIndex((item) => item.id === todo.id);
    data[index] = todo;
    return todo;
  },
  deleteItem: async (id: number) => {
    await waitFor(500);
    const index = data.findIndex((todo) => todo.id === id);
    data.splice(index, 1);
    return true;
  }
}

export default TodoApi;
