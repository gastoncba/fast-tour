import * as boom from "@hapi/boom";

import { RoleRepository } from "../repositories/repository";
import { Role, RoleType } from "../entities/role.entity";
import { IService } from "./private/IService";

export class RoleService implements IService<Role> {
  constructor() {}

  async create(data: { name: RoleType }) {
    const role = RoleRepository.create(data);
    return await RoleRepository.save(role);
  }

  async findOne(id: string) {
    const role = await RoleRepository.findOneBy({ id });
    if (!role) {
      throw boom.notFound(`role #${id} not found`);
    }

    return role;
  }

  async find() {
    return await RoleRepository.find();
  }

  update(id: string, changes: Record<string, any>): Promise<Role> {
    throw new Error("Method not implemented.");
  }
  remove(id: string): Promise<void> | Promise<any> {
    throw new Error("Method not implemented.");
  }
}
