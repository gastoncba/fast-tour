import * as boom from "@hapi/boom";
import bcrypt from "bcrypt";

import { UserRepository } from "../repositories/repository";
import { RoleService } from "./role.service";
import { OrderService } from "./order.service";
import { UserDTO } from "../dtos/user.dto";

const orderService = new OrderService();
const roleService = new RoleService();

export class UserService {
  constructor() {}

  async find() {
    const users = await UserRepository.find({ relations: ["role"] });
    const userDTOs = users.map((user) => new UserDTO(user)).filter((user) => user.role.id !== "1");
    return userDTOs;
  }

  async create(data: { firstName: string; lastName: string; email: string; password: string; roleId: string }) {
    const { roleId, ...newData } = data;
    const role = await roleService.findOne(roleId);

    const foundUser = await this.findByEmail(data.email);

    if (foundUser) {
      throw boom.conflict(`email ${data.email} is repeated`);
    }

    const hash = await bcrypt.hash(data.password, 10);
    const user = UserRepository.create({ ...newData, password: hash, role });
    const savedUser = await UserRepository.save(user);
    const { password, recoveryToken, ...returned } = savedUser;
    return returned;
  }

  async findByEmail(email: string) {
    return await UserRepository.findOne({ where: { email }, relations: ["role"] });
  }

  async findById(userId: string) {
    const user = await UserRepository.findOne({ where: { id: userId }, relations: ["role"] });

    if (!user) {
      throw boom.notFound(`user #${userId} not found`);
    }

    const { recoveryToken, password, ...userReturned } = user;
    return userReturned;
  }

  async findUserComplete(userId: string) {
    const user = await UserRepository.findOneBy({ id: userId });

    if (!user) {
      throw boom.notFound(`user #${userId} not found`);
    }

    return user;
  }

  async update(id: string, changes: { firstName?: string; lastName?: string; email?: string }) {
    const user = await UserRepository.findOneBy({ id });
    if (!user) {
      throw boom.notFound(`user #${id} not found`);
    }

    UserRepository.merge(user, changes);
    await UserRepository.save(user);
    return await this.findById(id);
  }

  async updatePassword(id: string, password: string) {
    const user = await UserRepository.findOneBy({ id });
    if (!user) {
      throw boom.notFound(`user #${id} not found`);
    }
    UserRepository.merge(user, { password, recoveryToken: null });
    return await UserRepository.save(user);
  }

  async searchOrders(userId: string, query?: Record<string, any>) {
    await this.findUserComplete(userId);
    return await orderService.findOrderByUser(userId, query ? query.take : 5, query ? query.skip : 0);
  }
}
