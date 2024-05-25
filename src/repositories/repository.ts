import { appDataSource } from "../database/database";
import { Trip, Country, Place, Hotel, User, Role, Order, PlaceVisited } from "../entities";

export const TripRepository = appDataSource.getRepository(Trip)
export const PlaceRepository  = appDataSource.getRepository(Place)
export const CountryRepository = appDataSource.getRepository(Country)
export const HotelRepository = appDataSource.getRepository(Hotel)
export const UserRepository = appDataSource.getRepository(User)
export const RoleRepository = appDataSource.getRepository(Role)
export const OrderRepository = appDataSource.getRepository(Order)
export const PlaceVisitedRepository = appDataSource.getRepository(PlaceVisited)
