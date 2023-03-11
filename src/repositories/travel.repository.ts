import { Travel } from "../entities/travel.entity";
import { appDataSource } from "../database/database";

export const TravelRepository = appDataSource.getRepository(Travel)
