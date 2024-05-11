import * as boom from "@hapi/boom";
import QueryString from "qs";
import { FindManyOptions, ILike } from "typeorm";

import { Country } from "../entities";
import { CountryRepository } from "../repositories/repository";

export class CountryService {
  constructor() {}

  async find(query: QueryString.ParsedQs) {
    const { take, skip, name } = query;
    const options: FindManyOptions<Country> = {};
    options.order = { id: "ASC" };

    if (take && skip) {
      options.take = parseInt(take as string);
      options.skip = parseInt(skip as string);
    }

    if (name) {
      options.where = {
        ...options.where,
        name: ILike(`%${name}%`),
      };
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

  async create(data: { name: string; code: string }) {
    const country = CountryRepository.create(data);
    return await CountryRepository.save(country);
  }

  async update(id: string, changes: { name?: string; code?: string }) {
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

  async getTop(limit: number) {
    const countryTop = await CountryRepository.createQueryBuilder("trip")
      .select("c.*")
      .addSelect('COUNT("o"."tripId")', "sales_total")
      .innerJoin("orders", "o", "o.tripId = trip.id")
      .innerJoin("trip_places_place", "tpp", "tpp.tripId = trip.id")
      .innerJoin("place", "p", "tpp.placeId = p.id")
      .innerJoin("country", "c", "c.id = p.countryId")
      .groupBy("c.id")
      .orderBy("sales_total", "DESC")
      .limit(limit)
      .getRawMany();
    return countryTop;
  }
}
