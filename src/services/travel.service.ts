import * as boom from "@hapi/boom";

import { TravelRepository } from "../repositories/repository";

export class TravelsService {
  constructor() {}

  async find() {
    const travel = await TravelRepository.find()
    return travel
  }

  async findOne(id: string) {
    const travel = await TravelRepository.findOneBy({id})
    if(!travel) {
      throw boom.notFound(`travel #${id} not found`)
    }

    return travel
  }

  async create(data: {name: string, price: number}) {
    const travel = TravelRepository.create(data)
    return await TravelRepository.save(travel)
  }

  async update(id: string, changes: {name?: string, price?: number}) {
    const travel = await TravelRepository.findOneBy({id})

    if(!travel) {
      throw boom.notFound(`travel #${id} not found`)
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
