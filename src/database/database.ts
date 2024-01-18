import { DataSource } from "typeorm";
import { config } from "../config/config";

import { Country, Hotel, Place, Trip, Order, OrderDetail, User, Role } from "../entities";

export const appDataSource = new DataSource({
  type: "postgres",
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  synchronize: true,
  logging: true,
  entities: [Trip, Country, Place, Hotel, Order, OrderDetail, User, Role],
});
