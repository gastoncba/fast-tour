import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";

import { Trip } from "./trip.entity";
import { Order } from "./order.entity";

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "int" })
  cantPersons: number;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  order: Order;

  @ManyToOne(() => Trip)
  trip: Trip;
}
