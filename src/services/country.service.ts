import * as boom from "@hapi/boom";

import { CountryRepository } from "../repositories/repository";

export class CountriesService {
  constructor() {}

  async find() {
    const countries = CountryRepository.find();
    return countries;
  }

  async findOne(id: string) {
    const country = await CountryRepository.findOneBy({id})

    if(!country) {
      throw boom.notFound(`country #${id} not found`)
    }

    return country;
  }

  async create(data: {name: string}) {
    const country = CountryRepository.create(data)
    return await CountryRepository.save(country)
  }

  async update(id: string, changes: {name: string}) {
    const country = await CountryRepository.findOneBy({id})

    if(!country) {
      throw boom.notFound(`country #${id} not found`)
    }
    CountryRepository.merge(country, changes)
    return await CountryRepository.save(country)
  }

  async remove(id: string) {
    const country = await CountryRepository.findOneBy({id})

    if(!country) {
      throw boom.notFound(`countyr #${id} not found`)
    }

    return await CountryRepository.delete(id)
  }
}
