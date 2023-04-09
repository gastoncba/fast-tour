import * as boom from "@hapi/boom";
import moment from "moment";
import QueryString from "qs";
import {
  Between,
  FindManyOptions,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
} from "typeorm";

import { Place, Travel } from "../entities";
import { HotelRepository, PlaceRepository, TravelRepository } from "../repositories/repository";
import { PlacesService } from "./place.service";

const placesServices = new PlacesService();

export class TravelsService {
  constructor() {}

  async find(query: QueryString.ParsedQs) {
    const { take, skip, max_price, min_price, fromDate, toDate, placeId} = query;
    const options: FindManyOptions<Travel> = {};
    if (take && skip) {
      options.take = parseInt(take as string);
      options.skip = parseInt(skip as string);
    }

    if (min_price && max_price) {
      options.where = {
        ...options.where,
        price: Between(
          parseInt(min_price as string),
          parseInt(max_price as string)
        ),
      };
    }

    if (fromDate) {
      const dateParts = (fromDate as string).split("/");
      const newDate = new Date(
        parseInt(dateParts[2]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[0])
      );
      options.where = {
        ...options.where,
        startDate: MoreThanOrEqual(newDate),
      };
    }
    if (toDate) {
      const dateParts = (toDate as string).split("/");
      const newDate = new Date(
        parseInt(dateParts[2]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[0])
      );
      options.where = {
        ...options.where,
        endDate: LessThanOrEqual(newDate),
      };
    }

    if(placeId) {
      const id = placeId as string
      const place = await PlaceRepository.findOne({where: {id}})
      if(place) {
        options.where = {
          ...options.where,
          place: place
        }
      }
    }

    const travel = await TravelRepository.find(options);
    return travel;
  }

  async findOne(id: string) {
    const travel = await TravelRepository.findOne({
      relations: ["place", "hotels"],
      where: { id },
    });
    if (!travel) {
      throw boom.notFound(`travel #${id} not found`);
    }
    return travel;
  }

  async create(data: {
    name: string;
    price: number;
    startDate: string;
    endDate: string;
    placeId: string;
    hotelsIds: number[];
  }) {
    const startDateFormater = moment(data.startDate, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );
    const endDateFormater = moment(data.endDate, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );
    const travel = TravelRepository.create({
      ...data,
      startDate: startDateFormater,
      endDate: endDateFormater,
    });
    const destination = await placesServices.findOne(data.placeId);
    const hotels = await HotelRepository.findBy({ id: In(data.hotelsIds) });

    travel.place = destination;
    travel.hotels = hotels;

    return await TravelRepository.save(travel);
  }

  async update(
    id: string,
    changes: {
      name?: string;
      price?: number;
      startDate?: string;
      endDate?: string;
      placeId?: string;
      hotelsIds: number[];
    }
  ) {
    const travel = await TravelRepository.findOneBy({ id });

    if (!travel) {
      throw boom.notFound(`travel #${id} not found`);
    }

    if (changes.placeId) {
      const destination = await placesServices.findOne(changes.placeId);
      travel.place = destination;
    }

    if (changes.hotelsIds) {
      const hotels = await HotelRepository.findBy({
        id: In(changes.hotelsIds),
      });
      travel.hotels = hotels;
    }

    if (changes.startDate) {
      const startDateFormater = moment(changes.startDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
      changes = { ...changes, startDate: startDateFormater };
      console.log("fecha converitida: ", changes.startDate);
    }

    if (changes.endDate) {
      const endDateFormater = moment(changes.endDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
      changes = { ...changes, endDate: endDateFormater };
    }

    TravelRepository.merge(travel, changes);
    return await TravelRepository.save(travel);
  }

  async remove(id: string) {
    const travel = await TravelRepository.findOneBy({ id });

    if (!travel) {
      throw boom.notFound(`travel #${id} not found`);
    }

    return await TravelRepository.delete(id);
  }
}
