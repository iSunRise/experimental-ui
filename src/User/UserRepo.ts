import { useMutation } from "react-query";
import UserApi from "./UserApi";
import User from "./User";
import {UserDTO} from "./UserDTO";
import BaseRepo from "../BaseRepo";
import { createQuery }  from "../utils/createQuery";

class UserRepo extends BaseRepo {
  private buildUser = (dto: UserDTO) => new User(dto);

  private listQuery = createQuery({
    buildKey: () => 'user-list',
    apiCall: () => UserApi.getList().then((list) => list.map(this.buildUser))
  });

  private itemQuery = createQuery({
    buildKey: (id) => `user/${id}`,
    apiCall: (id: number) => UserApi.getItem(id).then(this.buildUser)
  })

  useList = () => {
    const { data: userList, isLoading, error } = this.listQuery.useQueryHook({});
    return { userList, isLoading, error };
  };

  useItem = (id?: number) => {
    const { data: user, isLoading, error } = this.itemQuery.useQueryHook(id);
    return { user, isLoading, error };
  }

  cacheUser(dto: UserDTO): User {
    const user = this.buildUser(dto);
    const list = [...(this.listQuery.getLatestData({}) || [])]
    const userIndex = list.findIndex((item) => item.id === user.id);
    if (userIndex !== -1) {
      list[userIndex] = user;
    } else {
      list.push(user);
    }

    this.listQuery.setData({}, list);
    this.itemQuery.setData(user.id, user);
  }

  private removeCachedUser(id: number) {
    const list = [...(this.listQuery.getLatestData({}) || [])];
    const nextList = list.filter((item) => item.id !== id);
    this.listQuery.setData({}, nextList);
    this.itemQuery.remove(id);
  }

  useCreate = (user: User) => {
    const mutation = useMutation(() => UserApi.createItem(user.getDTO()).then(this.cacheUser));
    return { create: mutation.mutateAsync, loading: mutation.isLoading, error: mutation.error };
  }

  useUpdate = (user: User) => {
    const mutation = useMutation(() => UserApi.updateItem(user.getDTO()).then(this.cacheUser));
    return { update: mutation.mutateAsync, loading: mutation.isLoading, error: mutation.error };
  }

  useDelete = (id: number) => {
    const mutation = useMutation(() => UserApi.deleteItem(id).then(() => this.removeCachedUser(id)));
    return { delete: mutation.mutateAsync, loading: mutation.isLoading, error: mutation.error };
  }
}

export default new UserRepo();
