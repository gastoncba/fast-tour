import * as boom from "@hapi/boom";
import bcrypt from "bcrypt";

import { UserRepository } from "../repositories/repository";
import { RoleService } from "./role.service";

const roleService = new RoleService();

export class UserService {
  constructor() {}

  async create(data: { firstName: string; lastName: string; email: string; password: string; roleId: string }) {
    const { roleId, ...newData } = data;
    const role = await roleService.findById(roleId);

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
    return await UserRepository.findOneBy({ email });
  }

  async findById(userId: string) {
    const user = await UserRepository.findOneBy({ id: userId });

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
    return await UserRepository.save(user);
  }

  async updatePassword(id: string, password: string) {
    const user = await UserRepository.findOneBy({ id });
    if (!user) {
      throw boom.notFound(`user #${id} not found`);
    }
    UserRepository.merge(user, { password, recoveryToken: null });
    return await UserRepository.save(user);
  }

  // async updateAll(userId: string, brandId: string, changes: { firstName?: string; lastName?: string; email?: string; brandName?: string }) {
  //   const { brandName, ...userChanges } = changes;
  //   await brandService.update(brandId, { name: brandName });
  //   return await this.update(userId, userChanges);
  // }
}
