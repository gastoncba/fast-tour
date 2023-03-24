import * as boom from "@hapi/boom";

import { PlaceRepository } from "../repositories/repository"
import { CountriesService } from "./country.service";

const countriesService = new CountriesService();

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

  async create(data: {name: string, description: string, countryId?: string}) {
    const place = PlaceRepository.create(data)

    if(data.countryId) {
      const country = await countriesService.findOne(data.countryId)
      place.country = country;
    }
    return await PlaceRepository.save(place)
  }

  async update(id: string, changes: {name: string, description: string, countryId?: string}) {
    const place = await PlaceRepository.findOneBy({id})

    if(!place) {
      throw boom.notFound(`place #${id} not found`)
    }

    if(changes.countryId) {
      const country = await countriesService.findOne(changes.countryId)
      place.country = country
    }

    PlaceRepository.merge(place, changes)
    return await PlaceRepository.save(place)
  }

  async remove(id: string) {
    const place = await PlaceRepository.findOneBy({id})

    if(!place) {
      throw boom.notFound(`place #${id} not found`)
    }

    return await PlaceRepository.delete(id)
  }
}
