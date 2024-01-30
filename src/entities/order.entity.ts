import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from "typeorm";

import { User } from "./user.entity";
import { Trip } from "./trip.entity";
import { PlaceVisited } from "./PlaceVisited.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "date" })
  purchaseDate: Date;

  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  user: User;

  @ManyToOne(() => Trip, (trip) => trip.orders)
  trip: Trip;

  @OneToMany(() => PlaceVisited, (placeVisited) => placeVisited.order)
  placesVisited: PlaceVisited[];

  @Column({ type: "int", nullable: true })
  numberPeople: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  firstName: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  lastName: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email: string;
}
