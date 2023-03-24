import { DataSource } from "typeorm";
import { config } from "../config/config";
import { Country, Hotel, Place, Travel } from "../entities";

export const appDataSource = new DataSource({
    type: "postgres",
    host: config.dbHost,
    port: config.dbPort,
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    synchronize: true,
    logging: true,
    entities: [Travel, Country, Place, Hotel],
    migrations: [],
    subscribers: []
    // migrations: ['src/database/migrations/*.ts']
})
