import { appDataSource } from "../database/database";
import { Trip, Country, Place, Hotel, User, Role } from "../entities";

export const TripRepository = appDataSource.getRepository(Trip)
export const PlaceRepository  = appDataSource.getRepository(Place)
export const CountryRepository = appDataSource.getRepository(Country)
export const HotelRepository = appDataSource.getRepository(Hotel)
export const UserRepository = appDataSource.getRepository(User)
export const RoleRepository = appDataSource.getRepository(Role)
