import * as boom from "@hapi/boom";
import QueryString from "qs";
import { FindManyOptions, In } from "typeorm";

import { PlaceRepository } from "../repositories/repository";
import { CountryService } from "./country.service";
import { Place } from "../entities";

const countryService = new CountryService();

export class PlaceService {
  constructor() {}

  async find(query: QueryString.ParsedQs) {
    const { countryId } = query;
    const options: FindManyOptions<Place> = {};
    options.relations = ["country", "hotels"];

    if (countryId) {
      options.where = { country: { id: In([countryId]) } };
    }
    const place = await PlaceRepository.find(options);
    return place;
  }

  async findOne(id: string) {
    const place = await PlaceRepository.findOne({ relations: ["country"], where: { id } });
    if (!place) {
      throw boom.notFound(`place #${id} not found`);
    }

    return place;
  }

  async findIn(placesId: number[]) {
    const places = await PlaceRepository.findBy({ id: In(placesId) });

    if (places.length === 0) {
      throw boom.notFound("places not found");
    }

    return places;
  }

  async create(data: { name: string; img?: string; countryId: string }) {
    const { countryId, ...newPlace } = data;
    const place = PlaceRepository.create(newPlace);
    const country = await countryService.findOne(countryId);
    place.country = country;
    return await PlaceRepository.save(place);
  }

  async update(id: string, changes: { name?: string; img?: string; countryId?: string }) {
    const place = await PlaceRepository.findOneBy({ id });

    if (!place) {
      throw boom.notFound(`place #${id} not found`);
    }

    if (changes.countryId) {
      const country = await countryService.findOne(changes.countryId);
      place.country = country;
    }

    PlaceRepository.merge(place, changes);
    return await PlaceRepository.save(place);
  }

  async remove(id: string) {
    const place = await PlaceRepository.findOneBy({ id });

    if (!place) {
      throw boom.notFound(`place #${id} not found`);
    }

    return await PlaceRepository.delete(id);
  }
}
