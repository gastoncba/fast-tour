import * as boom from "@hapi/boom";
import QueryString from "qs";
import { FindManyOptions } from "typeorm";

import { Country } from "../entities";
import { CountryRepository } from "../repositories/repository";

export class CountriesService {
  constructor() {}

  async find(query: QueryString.ParsedQs) {
    const { take, skip } = query;
    const options: FindManyOptions<Country> = {};
    if (take && skip) {
      options.take = parseInt(take as string);
      options.skip = parseInt(skip as string);
    }

    const countries = CountryRepository.find(options);
    return countries;
  }

  async findOne(id: string) {
    const country = await CountryRepository.findOneBy({ id });

    if (!country) {
      throw boom.notFound(`country #${id} not found`);
    }

    return country;
  }

  async findPLaces(id: string) {
    const country = await CountryRepository.findOne({
      where: { id },
      relations: ["places"],
    });

    if (!country) {
      throw boom.notFound(`country #${id} not found`);
    }

    const places = country.places;
    return places;
  }

  async create(data: { name: string }) {
    const country = CountryRepository.create(data);
    return await CountryRepository.save(country);
  }

  async update(id: string, changes: { name: string }) {
    const country = await CountryRepository.findOneBy({ id });

    if (!country) {
      throw boom.notFound(`country #${id} not found`);
    }
    CountryRepository.merge(country, changes);
    return await CountryRepository.save(country);
  }

  async remove(id: string) {
    const country = await CountryRepository.findOneBy({ id });

    if (!country) {
      throw boom.notFound(`country #${id} not found`);
    }

    return await CountryRepository.delete(id);
  }
}
