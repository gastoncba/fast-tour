import { Order, Role, User } from "../entities";

export class UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  orders: Order[];

  constructor(user: User) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.role = user.role;
    this.orders = user.orders;
  }
}
