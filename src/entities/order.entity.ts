import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from "typeorm";

import { User } from "./user.entity";
import { Trip } from "./trip.entity";
import { PlaceVisited } from "./placeVisited.entity";
import { OrderState } from "./order-state.entity";
import { EmailService } from "../services/email.service";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "date" })
  purchaseDate: Date;

  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  user: User;

  @ManyToOne(() => Trip, (trip) => trip.orders)
  trip: Trip;

  @OneToMany(() => PlaceVisited, (placeVisited) => placeVisited.order, { onDelete: "CASCADE" })
  placesVisited: PlaceVisited[];

  @Column({ type: "int", nullable: true })
  numberPeople: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  firstName: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  lastName: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email: string;

  @Column({ type: "real" })
  total: number;

  @ManyToOne(() => OrderState, { eager: true })
  state: OrderState

  confirm(emailService: EmailService) {
    this.state.confirm(this, emailService);
  }

  cancel(emailService: EmailService) {
    this.state.cancel(this, emailService);
  }

  pay(emailService: EmailService) {
    this.state.pay(this, emailService);
  }

  complete(emailService: EmailService) {
    this.state.complete(this, emailService);
  }
}
