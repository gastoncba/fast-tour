import * as boom from "@hapi/boom";

import { HotelRepository } from "../repositories/repository";

export class HotelService {
  constructor() {}

  async find() {
    const hotels = await HotelRepository.find();
    return hotels;
  }

  async findOne(id: string) {
    const hotel = await HotelRepository.findOneBy({ id });
    if (!hotel) {
      throw boom.notFound(`hotel #${id} not found`);
    }
    return hotel;
  }

  async create(data: { name: string; star: number; }) {
    const hotel = HotelRepository.create(data);
    return await HotelRepository.save(hotel);
  }

  async update(id: string, changes: { name?: string; star?: number }) {
    const hotel = await HotelRepository.findOneBy({ id });

    if (!hotel) {
      throw boom.notFound(`hotel #${id} not found`);
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
