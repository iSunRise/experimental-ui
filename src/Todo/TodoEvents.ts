import { BaseEntityEvents } from '../BaseRepo';

import { ShortTodo, Todo } from './Todo';

class ShortTodoBuilt<T extends ShortTodo = ShortTodo> extends BaseEntityEvents.EntityBuilt<T> {};
class ShortTodoCreated<T extends ShortTodo = ShortTodo> extends BaseEntityEvents.EntityCreated<T> {};
class ShortTodoUpdated<T extends ShortTodo = ShortTodo> extends BaseEntityEvents.EntityUpdated<T> {};
class ShortTodoRemoved<T extends ShortTodo = ShortTodo> extends BaseEntityEvents.EntityRemoved<T> {};

class TodoBuilt extends ShortTodoBuilt<Todo> {};
class TodoCreated extends ShortTodoCreated<Todo> {};
class TodoUpdated extends ShortTodoUpdated<Todo> {};
class TodoRemoved extends ShortTodoRemoved<Todo> {};

const TodoEvents = {
  ShortTodoBuilt,
  ShortTodoCreated,
  ShortTodoUpdated,
  ShortTodoRemoved,
  TodoBuilt,
  TodoCreated,
  TodoUpdated,
  TodoRemoved
};

export default TodoEvents;
