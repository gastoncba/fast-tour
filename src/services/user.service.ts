import * as boom from "@hapi/boom";
import bcrypt from "bcrypt";

import { UserRepository } from "../repositories/repository";
import { RoleService } from "./role.service";
import { OrderService } from "./order.service";
import { UserDTO } from "../dtos/user.dto";
import { FindManyOptions, ILike } from "typeorm";
import { User } from "../entities";
import { IService, PaginatedResponse } from "./private/IService";
import { EmailService } from "./email.service";
import { RoleType } from "../entities/role.entity";

const orderService = new OrderService();
const roleService = new RoleService();
const emailService = new EmailService();

export class UserService implements IService<UserDTO> {
  constructor() {}

  async findPaginated(
    page: number = 1,
    limit: number = 10,
    query?: Record<string, any>,
    relations?: string[]
  ): Promise<PaginatedResponse<UserDTO>> {
    const skip = (page - 1) * limit;
    
    const options: FindManyOptions<User> = {
      skip,
      take: limit,
      relations: relations ? [...relations, "role"] : ["role"],
      order: { id: "ASC" },
      where: { enabled: true },
    };

    // Aplicar filtros adicionales si existen
    if (query) {
      this.applyQueryFilters(options, query);
    }

    // Obtener items y total
    const [users, totalItems] = await UserRepository.findAndCount(options);
    
    // Convertir a DTOs y filtrar admins
    const userDTOs = users.map((user) => new UserDTO(user)).filter((user) => user.role.name !== RoleType.ADMIN);
    
    const totalPages = Math.ceil(totalItems / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      page,
      items: userDTOs,
      count: totalPages,
      totalItems,
      totalPages,
      hasNext,
      hasPrevious,
    };
  }

  async find(query?: Record<string, any>, relations?: []) {
    const options: FindManyOptions<User> = {};
    options.where = { enabled: true };

    if (query) {
      const { take, skip } = query;
      if (take && skip) {
        options.take = parseInt(take);
        options.skip = parseInt(skip);
      }
    }

    const users = await UserRepository.find({ ...options, relations: ["role"] });
    const userDTOs = users.map((user) => new UserDTO(user)).filter((user) => user.role.name !== RoleType.ADMIN);
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
    return await UserRepository.findOne({ where: { email, enabled: true }, relations: ["role"] });
  }

  async findOne(id: string, relations?: string[]) {
    const user = await UserRepository.findOne({ where: { id, enabled: true }, relations: relations ? [...relations, "role"] : ["role"] });

    if (!user) {
      throw boom.notFound(`user #${id} not found`);
    }
    const userDto = new UserDTO(user);
    return userDto;
  }

  async findUserComplete(userId: string) {
    const user = await UserRepository.findOne({ where: { id: userId, enabled: true } });

    if (!user) {
      throw boom.notFound(`user #${userId} not found`);
    }

    return user;
  }

  async update(id: string, changes: { firstName?: string; lastName?: string; email?: string, recoveryToken?: string }) {
    const user = await UserRepository.findOneBy({ id });
    if (!user) {
      throw boom.notFound(`user #${id} not found`);
    }

    UserRepository.merge(user, changes);
    await UserRepository.save(user);
    return await this.findOne(id);
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

  async remove(id: string) {
    const user = await UserRepository.findOne({ where: { id, enabled: true } });
    if (!user) {
      throw boom.notFound(`user #${id} not found`);
    }
    user.enabled = false;
    await UserRepository.save(user);
  }

  async sendMessage(userId: string, message: string) {
    const user = await this.findOne(userId);
    await emailService.sendToUser(message, user.firstName, user.lastName, user.email);
  }

  private applyQueryFilters(options: FindManyOptions<User>, query: Record<string, any>): void {
    const { firstName, lastName, email, roleId } = query;
    
    if (firstName) {
      options.where = {
        ...options.where,
        firstName: ILike(`%${firstName}%`),
      };
    }

    if (lastName) {
      options.where = {
        ...options.where,
        lastName: ILike(`%${lastName}%`),
      };
    }

    if (email) {
      options.where = {
        ...options.where,
        email: ILike(`%${email}%`),
      };
    }

    if (roleId) {
      options.where = {
        ...options.where,
        role: { id: roleId },
      };
    }
  }
}
