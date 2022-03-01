import {useMutation} from "react-query";

import BaseRepo from "../BaseRepo";
import { createQuery, createMutation } from "../utils/createQuery";

import { ShortTodo, Todo } from "./Todo";
import {ShortTodoDTO, TodoDTO} from "./TodoDTO";
import TodoApi from "./TodoApi";
import UserRepo from "../User/UserRepo";

type PaginedList = {
  items: any[];
  pageNumber: number;
  totalPages: number;
  sortBy: string;
  viewId: number;
}

class TodoRepo extends BaseRepo {
  private buildShortTodo = (dto: ShortTodoDTO) => new ShortTodo(dto);

  private buildTodo = (dto: TodoDTO) => new Todo(dto);

  private listQuery = createQuery({
    apiCall: () => TodoApi.getList().then((list) => list.map(this.buildShortTodo)),
    buildKey: () => 'todo-list',
    useRemapResult: (result) => {
      return  {
        todoList: result.data,
        isLoading: result.isLoading,
        error: result.error
      }
    }
  })

  private itemQuery = createQuery({
    apiCall: (id: number) => TodoApi.getItem(id).then(this.buildTodo),
    buildKey: (id) => `todo/${id}`,
    useRemapResult: (result) => {
      return  {
        todo: result.data,
        isLoading: result.isLoading,
        error: result.error
      }
    }
  })

  private searchQuery = createQuery({
    apiCall: (text: string) => TodoApi.getList().then((list) => list.map(this.buildShortTodo)),
    buildKey: (text) => `todo/search/${text}`,
    useRemapResult: (result) => {
      return  {
        todo: result.data,
        isLoading: result.isLoading,
        error: result.error
      }
    }
  })

  useList = this.listQuery.useQueryHook;

  useItem = this.itemQuery.useQueryHook;

  private storeShortTodo(dto: ShortTodoDTO) {
    const todo = this.buildShortTodo(dto);
    const list = [...(this.listQuery.getLatestData({}) || [])];
    const todoIndex = list.findIndex((item) => item.id === todo.id)
    if (todoIndex !== -1) {
      list[todoIndex] = todo;
    } else {
      list.push(todo);
    }

    this.listQuery.setData({}, list)
  }

  private storeTodo(dto: TodoDTO) {
    this.storeShortTodo(dto);
    UserRepo.cacheUser(dto.user);
    const todo = this.buildTodo(dto);
    this.itemQuery.setData(todo.id, todo);
  }

  private deleteTodo(id: number) {
    const list = [...(this.listQuery.getLatestData({}) || [])];
    const nextList = list.filter((item) => item.id !== id);
    this.listQuery.setData({}, nextList);
    this.itemQuery.remove(id);
  }


  private createQuery = createMutation({
    apiCall: TodoApi.createItem,
    useMutationResult: (result) => ({ create: result.mutateAsync, loading: result.isLoading, error: result.error }),
    onMutated: this.storeTodo
  });

  useCreate2 = this.createQuery.useMutationHook;

  useCreate = (todo: Todo) => {
    const mutation = useMutation(() => TodoApi.createItem(todo.getDTO()).then(this.storeTodo));
    return { create: mutation.mutateAsync, loading: mutation.isLoading, error: mutation.error };
  }

  useUpdate = (todo: Todo) => {
    const mutation = useMutation(() => TodoApi.updateItem(todo.getDTO()).then(this.storeTodo));
    return { update: mutation.mutateAsync, loading: mutation.isLoading, error: mutation.error };
  }

  useDelete = (id: number) => {
    const mutation = useMutation(() => TodoApi.deleteItem(id).then(() => this.deleteTodo(id)));
    return { delete: mutation.mutateAsync, loading: mutation.isLoading, error: mutation.error };
  }
}


const repo = new TodoRepo();

type ValidationErrors = {

}


// const { isLoading, save, draft, validationErrors } = repo.useCreate2();
const { isLoading, save, draft, validationErrors } = repo.useUpdate();


// const { create } = repo.useCreate({} as any);

create()
export default repo;
