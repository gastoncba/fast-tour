import * as boom from "@hapi/boom";
import { FindManyOptions, In, ILike } from "typeorm";

import { PlaceRepository } from "../repositories/repository";
import { CountryService } from "./country.service";
import { Place } from "../entities";
import { IService } from "./private/IService";

const countryService = new CountryService();

export class PlaceService implements IService<Place> {
  constructor() {}

  async find(query?: Record<string, any>, relations?: string[]) {
    const options: FindManyOptions<Place> = {};
    options.order = { id: "ASC" };
    options.relations = relations ? [...relations, "country", "hotels"] : ["country", "hotels"];
    options.where = { enabled: true };

    if(query) {
      const { countryId, name, take, skip } = query;
      if (countryId) {
        options.where = { ...options.where, country: { id: In([countryId]) } };
      }

      if (name) {
        options.where = {
          ...options.where,
          name: ILike(`%${name}%`),
        };
      }

      if (take && skip) {
        options.take = parseInt(take);
        options.skip = parseInt(skip);
      }

    }

    const place = await PlaceRepository.find(options);
    return place;
  }

  async findOne(id: string, relations?: string[]) {
    const place = await PlaceRepository.findOne({ relations: relations ? [...relations, "country"] : ["country"], where: { id, enabled: true } });
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

  async create(data: { name: string; description?: string; img?: string; countryId: string }) {
    const { countryId, ...newPlace } = data;
    const place = PlaceRepository.create(newPlace);
    const country = await countryService.findOne(countryId);
    place.country = country;
    return await PlaceRepository.save(place);
  }

  async update(id: string, changes: { name?: string; description?: string; img?: string; countryId?: string }) {
    const place = await this.findOne(id);

    if (changes.countryId) {
      const country = await countryService.findOne(changes.countryId);
      place.country = country;
    }

    PlaceRepository.merge(place, changes);
    return await PlaceRepository.save(place);
  }

  async remove(id: string) {
    const place = await this.findOne(id);
    place.enabled = false;
    await PlaceRepository.save(place);
  }

  async getTop(limit: number) {
    const placeTop = await PlaceRepository.createQueryBuilder("trip")
      .select("p.*")
      .addSelect('COUNT("o"."tripId")', "sales_total")
      .innerJoin("orders", "o", "o.tripId = trip.id")
      .innerJoin("trip_places_place", "tpp", "tpp.tripId = trip.id")
      .innerJoin("place", "p", "tpp.placeId = p.id")
      .groupBy("p.id")
      .orderBy("sales_total", "DESC")
      .limit(limit)
      .getRawMany();
    return placeTop;
  }
}
