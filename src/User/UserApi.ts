import {UserDTO} from "./UserDTO";
import {waitFor} from "../utils";

const data: UserDTO[] = [
  {id: 1, firstName: 'John', lastName: 'Doe', isAdmin: true},
  {id: 2, firstName: 'Sarah', lastName: 'Connor', isAdmin: false},
  {id: 3, firstName: 'Barry', lastName: 'Allen', isAdmin: false}
];

const UserApi = {
  getList: async () => {
    console.log('-----', 'get users list');
    await waitFor(500);
    return data;
  },
  getItem: async (id: number) => {
    console.log('-----', `get user #${id}`);
    await waitFor(500);
    return data.find((user) => user.id === id) as UserDTO;
  },
  createItem: async (user: UserDTO) => {
    await waitFor(500);
    const result = {
      ...user,
      id: Math.round(Math.random() * 100000),
    };
    data.push(result);
    return result;
  },
  updateItem: async (user: UserDTO) => {
    await waitFor(500);
    const index = data.findIndex((item) => item.id === user.id);
    data[index] = user;
    return user;
  },
  deleteItem: async (id: number) => {
    await waitFor(500);
    const index = data.findIndex((user) => user.id === id);
    data.splice(index, 1);
    return true;
  }
}

export { data as userData };
export default UserApi;
