import * as boom from "@hapi/boom";
import { FindManyOptions, ILike, In } from "typeorm";

import { HotelRepository } from "../repositories/repository";
import { PlaceService } from "./place.service";
import { Hotel } from "../entities";
import { IService } from "./private/IService";

const placeService = new PlaceService();

export class HotelService implements IService<Hotel> {
  constructor() {}

  async find(query: Record<string, any>, relations?: string[]) {
    const { name, placeId, take, skip } = query;
    const options: FindManyOptions<Hotel> = {};
    options.order = { id: "ASC" };
    options.relations = relations;

    if (name) {
      options.where = {
        ...options.where,
        name: ILike(`%${name}%`),
      };
    }

    if (placeId) {
      options.where = {
        ...options.where,
        place: In([placeId]),
      };
    }

    if (take && skip) {
      options.take = parseInt(take);
      options.skip = parseInt(skip);
    }

    const hotels = await HotelRepository.find(options);
    return hotels;
  }

  async findOne(id: string, relations?: string[]) {
    const hotel = await HotelRepository.findOne({ relations: relations ? [...relations, "place", "place.country"] : ["place", "place.country"], where: { id } });
    if (!hotel) {
      throw boom.notFound(`hotel #${id} not found`);
    }
    return hotel;
  }

  async create(data: { name: string; stars: number; placeId: string; description?: string }) {
    const { placeId, ...newHotel } = data;
    const hotel = HotelRepository.create(newHotel);
    const place = await placeService.findOne(placeId);
    hotel.place = place;

    return await HotelRepository.save(hotel);
  }

  async update(id: string, changes: { name?: string; stars?: number; description?: string; placeId?: string }) {
    const hotel = await HotelRepository.findOneBy({ id });

    if (!hotel) {
      throw boom.notFound(`hotel #${id} not found`);
    }

    if (changes.placeId) {
      const place = await placeService.findOne(changes.placeId);
      hotel.place = place;
    }

    HotelRepository.merge(hotel, changes);
    return await HotelRepository.save(hotel);
  }

  async remove(id: string) {
    const hotel = await HotelRepository.findOneBy({ id });

    if (!hotel) {
      throw boom.notFound(`hotel #${id} not found`);
    }

    return await HotelRepository.delete(id);
  }
}
