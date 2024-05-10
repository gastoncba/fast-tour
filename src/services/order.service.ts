import { FindManyOptions } from "typeorm";
import { Order, PlaceVisited, User } from "../entities";
import { OrderRepository } from "../repositories/repository";
import { PlaceVisitedService } from "./placeVisited.service";
import { TripService } from "./trip.service";
import { UserService } from "./user.service";

const placeVisitedService = new PlaceVisitedService();
const tripService = new TripService();
const userService = new UserService();

export class OrderService {
  constructor() {}

  async create(data: { purchaseDate: string; userId: number | null; tripId: number; placesVisited: { placeId: number; hotelId: number }[]; numberPeople: number; firstName?: string; lastName?: string; email?: string }) {
    let visiteds: PlaceVisited[] = [];

    const { placesVisited, tripId, userId, ...newData } = data;

    for (const visited of placesVisited) {
      const newVisted = await placeVisitedService.create(visited);
      visiteds.push(newVisted);
    }

    const trip = await tripService.findOne(tripId.toString());

    let user: User | undefined = undefined;
    if (userId) {
      user = await userService.findUserComplete(userId.toString());
    }

    const order = OrderRepository.create({ ...newData, placesVisited: visiteds, trip, user });
    return await OrderRepository.save(order);
  }

  async find() {
    const options: FindManyOptions<Order> = {};
    options.order = { id: "ASC" };
    options.relations = ["trip", "user", "placesVisited", "placesVisited.hotel", "placesVisited.place"];
    return await OrderRepository.find(options);
  }
}
