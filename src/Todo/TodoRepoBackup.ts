// import React, { useEffect, useMemo, useRef } from "react";
// import { useMutation, useQuery} from "react-query";
//
// import queryClient from "../queryClient";
// import { eventBus } from "../EventBus";
// import BaseRepo, { BaseEntityEvents } from "../BaseRepo";
//
// import { BaseEntity, ShortTodo, Todo } from "./Todo";
// import {buildItemClient, buildListClient} from "../utils/RepoClient";
// import {ShortTodoDTO, TodoDTO} from "./TodoDTO";
// import UserRepo from "../User/UserRepo";
// import userRepo from "../User/UserRepo";
// import TodoApi from "./TodoApi";
// import TodoEvents from "./TodoEvents";
// import User from "../User/User";
//
//
// type QueryResult<ResultType> = {
//   data: ResultType;
//   update: (newData: ResultType) => void;
//   invalidate: VoidFunction;
//   remove: VoidFunction;
// }
//
// type QueryParams<FetchParams, DTO, ResultType> = {
//   buildKey: (p: FetchParams) => string;
//   apiCall: (p: FetchParams) => Promise<DTO>;
//   deserialize: (p: DTO) => ResultType;
//   watch?: (queryResult: QueryResult<ResultType>, on: typeof eventBus.on) => void;
//   initialize?: (updateQuery: (data: ResultType, params: FetchParams) => void, on: typeof eventBus.on) => void;
// }
//
// const spyCreatedEntities = <T>(callback: () => T): { result: T, entities: BaseEntity[]} => {
//   const createdEntities: BaseEntity[] = [];
//   const unsubscribe = eventBus.on(BaseEntityEvents.EntityBuilt, (event) => createdEntities.push(event.payload));
//   const result = callback();
//   unsubscribe();
//   return { result, entities: createdEntities };
// }
//
// const createQuery = <FetchParams, DTO, ResultType>(queryParams: QueryParams<FetchParams, DTO, ResultType>) => {
//   if (queryParams.initialize) {
//     const updateQuery = (data: ResultType, params: FetchParams) => {
//       const  queryId = queryParams.buildKey(params);
//       queryClient.setQueryData(queryId, data);
//     };
//     queryParams.initialize(updateQuery, eventBus.on);
//   }
//
//   return (fetchParams: FetchParams) => {
//     const queryId = useMemo(() => queryParams.buildKey(fetchParams), [fetchParams]);
//
//     const trackedEntities = useRef<BaseEntity[]>([]);
//
//     const result = useQuery(queryId, async () => {
//       const rawResult = await queryParams.apiCall(fetchParams);
//       // automatically catch all the created entities
//       const { result: deserializedResult, entities } = spyCreatedEntities(() => queryParams.deserialize(rawResult));
//       trackedEntities.current = entities;
//
//       return deserializedResult;
//     });
//
//     useEffect(() => {
//       if (!result.data) return;
//
//       const qResult: QueryResult<ResultType> = {
//         data: result.data,
//         update: (newData) => queryClient.setQueryData(queryId, newData),
//         invalidate: () => queryClient.invalidateQueries(queryId),
//         remove: () => queryClient.removeQueries(queryId)
//       };
//
//       // collect all the things we have to unsubscribe on useEffect unmount
//       const unsubscribers: VoidFunction[] = [];
//
//       // decorate "eventBus.on" in order to connect unsubscribe callbacks
//       const on: typeof eventBus.on = (eventType, handler) => {
//         const unsubscribe = eventBus.on(eventType, handler);
//         unsubscribers.push(unsubscribe);
//         return unsubscribe;
//       }
//
//       // apply automatic tracking
//       on(BaseEntityEvents.EntityUpdated, (event) => {
//         if (trackedEntities.current.find((entity) => entity === event.payload)) {
//           qResult.invalidate();
//         }
//       });
//       on(BaseEntityEvents.EntityRemoved, (event) => {
//         if (trackedEntities.current.find((entity) => entity === event.payload)) {
//           qResult.remove();
//         }
//       });
//
//       // apply custom tracking
//       queryParams.watch?.(qResult, on);
//
//       return () => unsubscribers.forEach((un) => un());
//     }, [queryId, result.data]);
//
//     return { data: result.data, loading: result.isLoading };
//   }
// }
//
// // SIMPLE GOES HERE
//
// type SimpleQueryParams<FetchParams, Result> = {
//   buildKey: (p: FetchParams) => string;
//   apiCall: (p: FetchParams) => Promise<Result>;
// }
//
//
// const cache = Symbol('cache');
//
//
// const invalidate2 = Symbol('invalidate');
//
// const createSimpleQuery = <FetchParams, Result>(queryParams: SimpleQueryParams<FetchParams, Result>) => {
//   const useQueryHook = (fetchParams: FetchParams) => {
//     const queryId = useMemo(() => queryParams.buildKey(fetchParams), [fetchParams]);
//
//     const result = useQuery(queryId, () => queryParams.apiCall(fetchParams));
//
//     return { data: result.data, loading: result.isLoading };
//   };
//
//   const invalidate = (p: FetchParams) => queryClient.invalidateQueries(queryParams.buildKey(p));
//   const remove = (p: FetchParams) => queryClient.removeQueries(queryParams.buildKey(p));
//   const setData = (p: FetchParams, data: Result) => queryClient.setQueryData(queryParams.buildKey(p), data);
//   const getLatestData = (p: FetchParams, data: Result) => queryClient.setQueryData(queryParams.buildKey(p), data);
//
//   return { useQueryHook, invalidate, remove, setData, getLatestData };
// }
//
// class TodoRepo2 extends BaseRepo {
//
//   private itemQuery = createSimpleQuery<number, Todo>({
//     buildKey: (id) => `todo/${id}`,
//     apiCall: async (id) => {
//       const todo = await TodoApi.getItem(id).then((todoDTO) => TodoRepo.buildModel(todoDTO));
//
//
//       return todo;
//     },
//     reportEffect: (item, data, setData) => {
//
//     }
//
//   })
//
//   private listQuery = createSimpleQuery<void, Todo>({
//     buildKey: () => `todos`,
//     apiCall: (id) => TodoApi.getList().then((todoDTO) => TodoRepo.buildModel(todoDTO))
//   })
//
//   useTodo = this.itemQuery.useQueryHook;
//   useShortTodo = this.itemQuery.useQueryHook;
//
//   useList = this.itemQuery.useQueryHook;
//
//
//
//
//   // reportItem(item: Todo | ShortTodo) {
//
//   // }
//
//
//   storeShortTodo(item: ShortTodoDTO) {
//
//   }
//
//   storeTodo(item: TodoDTO) {
//
//   }
//
//   // example
//   useUpdate = (todo: Todo) => {
//     // await do update..
//     this.itemQuery.setResult(todo.id, todo);
//     setResult((prevResult) => { ..nextResult })
//   }
//
//
//
// }
//
//
//
// useSimpleItem.invalidate(5);
//
//
// // SIMPLE ENDS HERE
//
//
// class TodoRepo extends BaseRepo {
//
//   static buildModel = (dto: TodoDTO) => {
//     // UserRepo.buildModel(dto.user);
//     // TODO: use WeakMap for cache
//     const todo = new Todo(dto);
//     eventBus.dispatch(new TodoEvents.TodoBuilt(todo));
//     return todo;
//   };
//
//   static buildShortModel = (dto: ShortTodoDTO) => {
//     // TODO: use WeakMap for cache
//     const shortTodo = new ShortTodo(dto);
//     eventBus.dispatch(new TodoEvents.ShortTodoBuilt(shortTodo));
//     return shortTodo;
//   };
//
//   useTodo = createSimpleQuery<number, Todo>({
//     buildKey: (id) => `todo/${id}`,
//     apiCall: (id) => TodoApi.getItem(id).then((todoDTO) => TodoRepo.buildModel(todoDTO)),
//     onNotice: (qResult, todo) => {
//
//     }
//   });
//
//
//   useTodoUpdate = createMutation<Todo>({
//     apiCall: (todo) => TodoApi.updateItem(todo),
//     updateAllShit: (newTodo) => {
//
//     }
//   })
//
//   useItem = createQuery<number, TodoDTO, Todo>({
//     buildKey: (id) => `todo/${id}`,
//     apiCall: TodoApi.getItem,
//     deserialize: (dto) => TodoRepo.buildModel(dto),
//     // watch: (queryResult, on) => {
//     //   const isRelated = (todo: Todo) => queryResult.data === todo;
//
//     //   on(TodoEvents.TodoUpdated, (event) => {
//     //     if (isRelated(event.payload)) queryResult.update(event.payload);
//     //   });
//     //   on(TodoEvents.TodoRemoved, (event) => {
//     //     if (isRelated(event.payload)) queryResult.remove();
//     //   })
//     // },
//     // staticWatch
//     initialize: (preCreateQuery, on) => {
//       on(TodoEvents.TodoBuilt, (event) => preCreateQuery(event.payload, event.payload.id));
//       on(TodoEvents.TodoCreated, (event) => preCreateQuery(event.payload, event.payload.id));
//     }
//   });
//
//   useList = createQuery<void, ShortTodoDTO[], ShortTodo[]>({
//     buildKey: () => 'todos-list',
//     apiCall: TodoApi.getList,
//     deserialize: (dtos) => dtos.map(TodoRepo.buildShortModel),
//     watch: (queryResult, on) => {
//       const isRelated = (todo: ShortTodo) => queryResult.data.some((t) => t === todo);
//
//       on(TodoEvents.TodoUpdated, (event) => {
//         if (isRelated(event.payload)) queryResult.invalidate();
//       });
//       on(TodoEvents.TodoRemoved, (event) => {
//         if (isRelated(event.payload)) queryResult.invalidate();
//       });
//     }
//   })
//
//   useItemUpdate() {
//
//     // useMutation
//     eventBus.dispatch(new TodoEvents.TodoUpdated({} as Todo));
//     // invalidate lists
//     // return result
//   }
//
//
//   useSetDefault() {
//     // useMutation
//     // invalidate single item
//     // invalidate full single item
//     // invalidate lists
//     // return result
//   }
//
//   useSetDefault() {
//     // useMutation
//     // invalidate single item
//     // invalidate full single item
//     // invalidate lists
//     // return result
//   }
//
//   // useList2: (viewId: number) => {
//   //   const queryId = todoListClient.key;
//
//   //   const result = useQuery(`todos`, async () => {
//   //     const dtoList = await TodoApi.getList();
//   //     const list = dtoList.map((dto) => new ShortTodo(dto));
//   //     list.forEach((todo) => registerTodoAndQueryReference(todo.id, queryId));
//   //     return list;
//   //   });
//
//   //   return { list: result.data, loading: result.isLoading, error: result.error };
//   // },
//
//   // useItem: (id: number) => {
//   //   const requestResult = useQuery(['todo', { id }], () => TodoApi.getItem(id));
//
//   //   useDeserialize(requestResult, () => {
//
//   //   });
//
//
//   //   const result2 = useQuery(['todo', { id }], async () => {
//   //     if (!id) return undefined; // strange case, must be noted
//
//
//   //     const queryId = JSON.stringify(singleTodoClient.getKey(id)); // fixme
//   //     const todo = await TodoApi.getItem(id).then(todoRepo.buildModel);
//   //     registerTodoAndQueryReference(todo.id, queryId);
//   //     return todo;
//   //   });
//
//   //   // subscribe on nested resource
//   //   const { item: user } = UserRepo.useItem(result.data?.userId, cachedUserDTO: result.data?.getDTO().user);
//   //   if (result.data && user) result.data.applyUser(user);
//
//   //   return { item: result.data, loading: result.isLoading, error: result.error };
//   // },
//
//   // useItemCreate: () => {
//   //   const mutation = useMutation((todo: Todo) => TodoApi.createItem(todo.getDTO())
//   //       .then((dto) => {
//   //         const todo = todoRepo.buildModel(dto);
//   //         // 1)
//   //         getReferencedQueryIds(todo.id).forEach((queryId) => /* invalidateQuery(queryId)*/);
//   //         // 2)
//   //         todoListClient.updateList((prevList) => [todo, ...prevList]);
//
//   //         // insert single item
//   //         singleTodoClient.applyItem(todo.id, todo);
//   //         return todo;
//   //       })
//   //   )
//   //   return { onCreate: mutation.mutateAsync, loading: mutation.isLoading, error: mutation.error }
//   // },
//
//   // useItemUpdate: () => {
//   //   const mutation = useMutation((todo: Todo) => TodoApi.updateItem(todo.getDTO())
//   //       .then((dto) => {
//   //         const todo = todoRepo.buildModel(dto);
//   //         getReferencedQueryIds(todo.id).forEach((queryId) => /* invalidateQuery(queryId)*/);
//   //         todoListClient.updateList((prevList) => {
//   //           return prevList.map((item) => item.id === todo.id ? todo : item);
//   //         });
//   //         singleTodoClient.applyItem(todo.id, todo);
//   //         return todo;
//   //       })
//   //   )
//   // },
//
//   // useItemRemove: () => {
//   //   const mutation = useMutation(async (id: number) => {
//   //     TodoApi.deleteItem(id)
//   //         .then(() => {
//   //           todoListClient.updateList((prevList) => prevList.filter((item) => item.id !== id))
//   //           singleTodoClient.removeItem(id);
//   //           return true;
//   //         })
//   //       }
//   //   )
//   //   return { onDelete: mutation.mutateAsync, loading: mutation.isLoading, error: mutation.error }
//   // },
//
// };
//
// const todoRepo = new TodoRepo();
//
//
// export default todoRepo;
