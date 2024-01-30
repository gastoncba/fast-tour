import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Hotel } from "./hotel.entity";
import { Place } from "./place.entity";
import { Order } from "./order.entity";

@Entity()
export class PlaceVisited {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.visiteds)
  hotel: Hotel;

  @ManyToOne(() => Place, (place) => place.visiteds)
  place: Place;

  @ManyToOne(() => Order, (order) => order.placesVisited)
  order: Order;
}
