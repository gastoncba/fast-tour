import * as boom from "@hapi/boom";
import { FindManyOptions } from "typeorm";

import { Hotel, Order, PendingOrderState, Place, PlaceVisited, Trip, User } from "../entities";
import { OrderRepository } from "../repositories/repository";
import { appDataSource } from "../database/database";
import { TripService } from "./trip.service";
import { CountryService } from "./country.service";
import { PlaceService } from "./place.service";
import { IService } from "./private/IService";
import { EmailService } from "./email.service";

const tripService = new TripService();
const countryService = new CountryService();
const placeService = new PlaceService();
const emailService = new EmailService();

interface RankingStrategy {
  calculateRanking(limit: number): Promise<any[]>;
}

export class CountryRanking implements RankingStrategy {
  async calculateRanking(limit: number): Promise<any[]> {
    return await countryService.getTop(limit);
  }
}

export class PlaceRanking implements RankingStrategy {
  async calculateRanking(limit: number): Promise<any[]> {
    return await placeService.getTop(limit);
  }
}

export class TripRanking implements RankingStrategy {
  async calculateRanking(limit: number): Promise<any[]> {
    return await tripService.getTop(limit);
  }
}

export class OrderService implements IService<Order> {
  constructor() {}

  async create(data: { purchaseDate: string; userId: number | null; tripId: number; placesVisited: { placeId: number; hotelId: number }[]; numberPeople: number; firstName?: string; lastName?: string; email?: string; total: number }) {
    const queryRunner = appDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let visiteds: PlaceVisited[] = [];
    const { placesVisited, tripId, userId, ...newData } = data;

    try {
      for (const visited of placesVisited) {
        const hotel = await queryRunner.manager.findOne(Hotel, { where: { id: visited.hotelId.toString() } });
        const place = await queryRunner.manager.findOne(Place, { where: { id: visited.placeId.toString() } });

        if (!hotel || !place) {
          throw boom.notFound(`place or hotel not found`);
        }

        const newVisited = queryRunner.manager.create(PlaceVisited, { hotel, place });
        const saveVisited = await queryRunner.manager.save(newVisited);
        visiteds.push(saveVisited);
      }

      const trip = await queryRunner.manager.findOne(Trip, { where: { id: tripId.toString() } });

      if (!trip) {
        throw boom.notFound(`trip #${tripId} not found`);
      }

      let user: User | undefined = undefined;
      if (userId) {
        let user_data = await queryRunner.manager.findOne(User, { where: { id: userId.toString() } });
        if (!user_data) {
          throw boom.notFound(`user #${userId} not found`);
        }
        user = user_data;
      }

      const order = queryRunner.manager.create(Order, { ...newData, placesVisited: visiteds, trip, user });
      order.state = new PendingOrderState();
      emailService.notifyChangeOfStatus(order, "Orden de viaje - registrada", "¡Registramos tu Pedido de Viaje!", "Pendiente", "Confirmada");
      const newOrder = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
      return newOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw boom.badRequest("ERROR IN CREATE ORDER " + error);
    } finally {
      await queryRunner.release();
    }
  }

  async find(query?: Record<string, any>) {
    const options: FindManyOptions<Order> = {};
    if (query) {
      const { take, skip } = query;
      if (take && skip) {
        options.take = parseInt(take);
        options.skip = parseInt(skip);
      }
    }

    options.order = { id: "ASC" };
    options.relations = ["trip", "user", "placesVisited", "placesVisited.hotel", "placesVisited.place", "state"];
    return await OrderRepository.find(options);
  }

  async findOne(id: string) {
    const order = await OrderRepository.findOne({ where: { id }, relations: ["placesVisited", "trip", "user", "placesVisited.hotel", "placesVisited.place"] });

    if (!order) {
      throw boom.notFound(`order #${id} not found`);
    }

    return order;
  }

  async remove(id: string) {
    const queryRunner = appDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.findOne(id);
      await queryRunner.manager.remove(order.placesVisited);
      await queryRunner.manager.remove(order);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw boom.badRequest("ERROR IN DELETE ORDER " + error);
    } finally {
      await queryRunner.release();
    }
  }

  update(id: string, changes: Record<string, any>): Promise<Order> {
    throw new Error("Method not implemented.");
  }

  async getRankings(strategy: RankingStrategy, limit: number = 10): Promise<any[]> {
    return await strategy.calculateRanking(limit);
  }

  async getMonthlyTripCounts(year: number): Promise<{ month: string; tripCount: number }[]> {
    const orders = await OrderRepository.createQueryBuilder("orders")
      .select("to_char(DATE_TRUNC('month', orders.purchaseDate), 'Month') AS month")
      .addSelect("COUNT(orders.id) AS trip_count")
      .addGroupBy("to_char(DATE_TRUNC('month', orders.purchaseDate), 'Month')")
      .where("EXTRACT(year FROM orders.purchaseDate) = :year", { year })
      .orderBy("to_char(DATE_TRUNC('month', orders.purchaseDate), 'Month')")
      .getRawMany();

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const result = months.map((month) => {
      const existingMonth = orders.find((order) => order.month.trim() === month);
      return {
        month: existingMonth ? existingMonth.month.trim() : month,
        tripCount: existingMonth ? parseInt(existingMonth.trip_count) : 0,
      };
    });

    return result;
  }

  async findOrderByUser(userId: string, take: number, skip: number) {
    return await OrderRepository.find({ take, skip, where: { user: { id: userId } }, relations: ["trip", "placesVisited", "placesVisited.hotel", "placesVisited.place", "state"] });
  }

  async confirm(orderId: string) {
    const order = await this.findOne(orderId);
    order.confirm(emailService);
    return await OrderRepository.save(order);
  }

  async complete(orderId: string) {
    const order = await this.findOne(orderId);
    order.complete(emailService);
    return await OrderRepository.save(order);
  }

  async pay(orderId: string) {
    const order = await this.findOne(orderId);
    order.pay(emailService);
    return await OrderRepository.save(order);
  }

  async cancel(orderId: string) {
    const order = await this.findOne(orderId);
    order.cancel(emailService);
    return await OrderRepository.save(order);
  }
}
