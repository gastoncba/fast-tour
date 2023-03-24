import { appDataSource } from "../database/database";
import { Travel, Country, Place, Hotel } from "../entities";

export const TravelRepository = appDataSource.getRepository(Travel)
export const PlaceRepository  = appDataSource.getRepository(Place)
export const CountryRepository = appDataSource.getRepository(Country)
export const HotelRepository = appDataSource.getRepository(Hotel)
