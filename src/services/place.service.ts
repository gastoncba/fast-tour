import * as boom from "@hapi/boom";

import { PlaceRepository } from "../repositories/repository"

export class PlacesService {
  constructor() {}

  async find() {
    const place = PlaceRepository.find({relations: ['country']})
    return place;
  }

  async findOne(id: string) {
    const place = await PlaceRepository.findOneBy({id})
    if(!place) {
      throw boom.notFound(`place #${id} not found`)
    }

    return place;
  }

  async create(data: {name: string, description: string}) {
    const place = PlaceRepository.create(data)
    return await PlaceRepository.save(place)
  }

  async update(id: string, changes: {name: string, description: string}) {
    const place = await PlaceRepository.findOneBy({id})

    if(!place) {
      throw boom.notFound(`travel #${id} not found`)
    }
    PlaceRepository.merge(place, changes)
    return await PlaceRepository.save(place)
  }

  async remove(id: string) {
    const place = await PlaceRepository.findOneBy({id})

    if(!place) {
      throw boom.notFound(`travel #${id} not found`)
    }

    return await PlaceRepository.delete(id)
  }
}
