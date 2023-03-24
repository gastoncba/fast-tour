import * as boom from "@hapi/boom";

import { TravelRepository } from "../repositories/repository";
import { PlacesService } from "./place.service";

const placesServices = new PlacesService();

export class TravelsService {
  constructor() {}

  async find() {
    const travel = await TravelRepository.find({ relations: ['place']})
    return travel
  }

  async findOne(id: string) {
    const travel = await TravelRepository.findOne({relations: ['relations'], where: { id }})
    if(!travel) {
      throw boom.notFound(`travel #${id} not found`)
    }
    return travel
  }

  async create(data: {name: string, price: number, placeId?: string}) {
    const travel = TravelRepository.create(data)

    if(data.placeId) {
      const place = await placesServices.findOne(data.placeId)
      travel.place = place;
    }
    return await TravelRepository.save(travel)
  }

  async update(id: string, changes: {name?: string, price?: number, placeId?: string}) {
    const travel = await TravelRepository.findOneBy({id})

    if(!travel) {
      throw boom.notFound(`travel #${id} not found`)
    }

    if(changes.placeId) {
      const place = await placesServices.findOne(changes.placeId);
      travel.place = place;
    }

    TravelRepository.merge(travel, changes)
    return await TravelRepository.save(travel)
  }

  async remove(id: string) {
    const travel = await TravelRepository.findOneBy({id})

    if(!travel) {
      throw boom.notFound(`travel #${id} not found`)
    }

    return await TravelRepository.delete(id)
  }
}
