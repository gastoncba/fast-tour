import * as boom from "@hapi/boom";
import { In } from "typeorm";

import { HotelRepository, TravelRepository } from "../repositories/repository";
import { PlacesService } from "./place.service";

const placesServices = new PlacesService();

export class TravelsService {
  constructor() {}

  async find() {
    const travel = await TravelRepository.find();
    return travel;
  }

  async findOne(id: string) {
    const travel = await TravelRepository.findOne({
      relations: ["place","hotels"],
      where: { id },
    });
    if (!travel) {
      throw boom.notFound(`travel #${id} not found`);
    }
    return travel;
  }

  async create(data: {
    name: string;
    price: number;
    placeId: string;
    hotelsIds: number[];
  }) {
    const travel = TravelRepository.create(data);
    const destination = await placesServices.findOne(data.placeId);
    const hotels = await HotelRepository.findBy({ id: In(data.hotelsIds) });

    travel.place = destination;
    travel.hotels = hotels;

    return await TravelRepository.save(travel);
  }

  async update(
    id: string,
    changes: {
      name?: string;
      price?: number;
      placeId?: string;
      hotelsIds: number[];
    }
  ) {
    const travel = await TravelRepository.findOneBy({id});

    if (!travel) {
      throw boom.notFound(`travel #${id} not found`);
    }

    if (changes.placeId) {
      const destination = await placesServices.findOne(changes.placeId);
      travel.place = destination;
    }

    if (changes.hotelsIds) {
      const hotels = await HotelRepository.findBy({
        id: In(changes.hotelsIds),
      });
      travel.hotels = hotels;
    }

    TravelRepository.merge(travel, changes);
    return await TravelRepository.save(travel);
  }

  async remove(id: string) {
    const travel = await TravelRepository.findOneBy({ id });

    if (!travel) {
      throw boom.notFound(`travel #${id} not found`);
    }

    return await TravelRepository.delete(id);
  }
}
