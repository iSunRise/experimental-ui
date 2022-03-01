import {UserDTO} from "./UserDTO";
import {BaseEntity} from "../BaseRepo";

class User extends BaseEntity<UserDTO> {
  private data: UserDTO;

  constructor(data: UserDTO) {
    this.data = data;
  }

  get id() { return this.data.id };

  get name() {
    return `${this.data.firstName} ${this.data.lastName}`
  }

  getDTO() {
    return this.data
  }
}

const a = new User({} as any);

export default User;
