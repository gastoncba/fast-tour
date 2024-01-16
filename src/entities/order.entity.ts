import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from "typeorm";

import { User } from "./user.entity";
import { OrderDetail } from "./orderDetail.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "date" })
  purchaseDate: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, { onDelete: "CASCADE" })
  orderDetails: OrderDetail[];
}
