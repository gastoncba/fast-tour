import * as boom from "@hapi/boom";

import { HotelRepository } from "../repositories/repository";
import { TravelsService } from "./travel.service";

const travelsService = new TravelsService();

export class HotelService {
  constructor() {}

  async find() {
    const hotels = await HotelRepository.find({ relations: ['travel'] });
    return hotels;
  }

  async findOne(id: string) {
    const hotel = await HotelRepository.findOneBy({ id });
    if (!hotel) {
      throw boom.notFound(`hotel #${id} not found`);
    }
    return hotel;
  }

  async create(data: { name: string; price: number; travelId: string }) {
    const hotel = HotelRepository.create(data);
    const travel = await travelsService.findOne(data.travelId);
    hotel.travel = travel;
    return await HotelRepository.save(travel);
  }

  async update(id: string, changes: { name?: string; price?: number, travelId?: string }) {
    const hotel = await HotelRepository.findOneBy({ id });

    if (!hotel) {
      throw boom.notFound(`hotel #${id} not found`);
    }

    if(changes.travelId) {
      const travel = await travelsService.findOne(changes.travelId);
      hotel.travel  =travel
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
