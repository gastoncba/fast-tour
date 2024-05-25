import { DataSource } from "typeorm";
import { config } from "../config/config";

import { Country, Hotel, Place, Trip, Order, User, Role, PlaceVisited, OrderState, PendingOrderState, ConfirmedOrderState, CompletedOrderState, PaidOrderState, CanceledOrderState } from "../entities";

export const appDataSource = new DataSource({
  type: "postgres",
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  synchronize: true,
  logging: true,
  entities: [Trip, Country, Place, Hotel, Order, PlaceVisited, User, Role, OrderState, PendingOrderState, ConfirmedOrderState, CompletedOrderState, PaidOrderState, CanceledOrderState ],
});
