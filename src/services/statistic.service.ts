import { CountryRanking, OrderService, PlaceRanking, TripRanking } from "./order.service";
import { UserService } from "./user.service";

const orderService = new OrderService();
const userService = new UserService();

export class StatisticService {
  constructor() {}

  async generalStatistics() {
    const orders = await orderService.find();
    const users = await userService.find();

    let averageSales = 0;
    if (orders.length !== 0) {
      const sum = orders.reduce((acc, order) => order.total + acc, 0);
      averageSales = sum / orders.length;
    }

    const general = {
      orders: orders.length,
      users: users.length,
      averageSales,
    };

    return general;
  }

  async ranking() {
    const countryRanking = await orderService.getRankings(new CountryRanking());
    const placeRanking = await orderService.getRankings(new PlaceRanking());
    const tripRanking = await orderService.getRankings(new TripRanking());

    const rankings = {
      tripRanking,
      placeRanking,
      countryRanking,
    };
    return rankings;
  }
  async getMonthlyTripCounts(year: number) {
    return await orderService.getMonthlyTripCounts(year);
  }
}
