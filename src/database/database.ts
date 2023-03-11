import { DataSource } from "typeorm";
import { config } from "../config/config";

export const appDataSource = new DataSource({
    type: "postgres",
    host: config.dbHost,
    port: config.dbPort,
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    synchronize: false,
    logging: true,
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts']
})
