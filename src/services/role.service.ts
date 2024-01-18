import * as boom from "@hapi/boom";

import { RoleRepository } from "../repositories/repository";
import { RoleType } from "../entities/role.entity";

export class RoleService {
  constructor() {}

  async create(data: { name: RoleType }) {
    const role = RoleRepository.create(data);
    return await RoleRepository.save(role);
  }

  async findById(id: string) {
    const role = await RoleRepository.findOneBy({ id });
    if (!role) {
      throw boom.notFound(`role #${id} not found`);
    }

    return role;
  }

  async find() {
    return await RoleRepository.find()
  }
}
