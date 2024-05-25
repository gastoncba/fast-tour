import * as boom from "@hapi/boom";
import { Between, FindManyOptions, ILike, In, LessThanOrEqual, MoreThanOrEqual } from "typeorm";

import { Trip } from "../entities";
import { TripRepository } from "../repositories/repository";
import { PlaceService } from "./place.service";
import { IService } from "./private/IService";

const placeService = new PlaceService();

export class TripService implements IService<Trip> {
  constructor() {}

  async find(query: Record<string, any>, relations?: string[]) {
    const { take, skip, maxPrice, minPrice, start, end, places, name } = query;
    const options: FindManyOptions<Trip> = {};
    options.order = { id: "ASC" };

    if (take && skip) {
      options.take = parseInt(take);
      options.skip = parseInt(skip);
    }

    if (minPrice && maxPrice) {
      options.where = {
        ...options.where,
        price: Between(parseFloat(minPrice), parseFloat(maxPrice)),
      };
    }

    if (start && end) {
      const arrayStart = (start as string).split("-");
      const arrayEnd = (end as string).split("-");
      const formattedStart = new Date(parseInt(arrayStart[2]), parseInt(arrayStart[1]) - 1, parseInt(arrayStart[0]));
      const formattedEnd = new Date(parseInt(arrayEnd[2]), parseInt(arrayEnd[1]) - 1, parseInt(arrayEnd[0]));
      options.where = {
        ...options.where,
        startDate: MoreThanOrEqual(formattedStart),
        endDate: LessThanOrEqual(formattedEnd),
      };
    }

    if (places) {
      const placesQuery = places as string;
      const placesIds = placesQuery.split(",").map((q) => parseInt(q));

      options.relations = relations ? [...relations, "places"] : ["places"];

      options.where = {
        ...options.where,
        places: {
          id: In(placesIds),
        },
      };
    }

    if (name) {
      options.where = {
        ...options.where,
        name: ILike(`%${name}%`),
      };
    }

    const travel = await TripRepository.find(options);
    return travel;
  }

  async findOne(id: string, relations?: string[]) {
    const trip = await TripRepository.findOne({
      relations: relations ? [...relations, "places", "places.country"] : ["places", "places.country"],
      where: { id },
    });
    if (!trip) {
      throw boom.notFound(`trip #${id} not found`);
    }
    return trip;
  }

  async create(data: { name: string; description?: string; price: number; startDate: string; endDate: string; img?: string; placesId: number[] }) {
    const { placesId, ...newTrip } = data;
    const destinations = await placeService.findIn(placesId);
    const trip = TripRepository.create({ ...newTrip, places: destinations });
    return await TripRepository.save(trip);
  }

  async update(
    id: string,
    changes: {
      name?: string;
      description?: string;
      price?: number;
      startDate?: string;
      endDate?: string;
      placesId?: number[];
    }
  ) {
    const trip = await TripRepository.findOneBy({ id });

    if (!trip) {
      throw boom.notFound(`trip #${id} not found`);
    }

    if (changes.placesId) {
      const places = await placeService.findIn(changes.placesId);
      trip.places = places;
    }

    TripRepository.merge(trip, changes);
    return await TripRepository.save(trip);
  }

  async remove(id: string) {
    const travel = await TripRepository.findOneBy({ id });

    if (!travel) {
      throw boom.notFound(`trip #${id} not found`);
    }

    return await TripRepository.delete(id);
  }

  async getTop(limit: number) {
    const tripTop = await TripRepository.createQueryBuilder("trip")
      .select("trip.*")
      .addSelect('COUNT("o"."tripId")', "sales_total")
      .innerJoin("orders", "o", "o.tripId = trip.id")
      .groupBy("trip.id")
      .orderBy("sales_total", "DESC")
      .limit(limit)
      .getRawMany();
    return tripTop;
  }
}
