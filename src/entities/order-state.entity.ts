import { Entity, Column, TableInheritance, ChildEntity, PrimaryColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity({ name: "order_state" })
@TableInheritance({ column: { type: "varchar", name: "type" } })
export abstract class OrderState {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id: string;

  @Column({ type: "varchar", length: 50 })
  name: string;

  abstract confirm(order: Order): void;
  abstract cancel(order: Order): void;
  abstract pay(order: Order): void;
  abstract complete(order: Order): void;
}

@ChildEntity()
export class PendingOrderState extends OrderState {
  constructor() {
    super();
    this.id = "PENDING";
    this.name = "Pendiente";
  }

  confirm(order: Order) {
    order.state = new ConfirmedOrderState();
  }

  cancel(order: Order) {
    order.state = new CanceledOrderState();
  }

  pay(order: Order) {
    throw new Error("Cannot pay a pending order");
  }

  complete(order: Order) {
    throw new Error("Cannot complete a pending order");
  }
}

@ChildEntity()
export class ConfirmedOrderState extends OrderState {
  constructor() {
    super();
    this.id = "CONFIRMED";
    this.name = "Confirmada";
  }

  confirm(order: Order) {
    throw new Error("Order is already confirmed");
  }

  cancel(order: Order) {
    order.state = new CanceledOrderState();
  }

  pay(order: Order) {
    order.state = new PaidOrderState();
  }

  complete(order: Order) {
    throw new Error("Cannot complete a confirmed order");
  }
}

@ChildEntity()
export class PaidOrderState extends OrderState {
  constructor() {
    super();
    this.id = "PAID";
    this.name = "Pagada";
  }

  confirm(order: Order) {
    throw new Error("Cannot confirm a paid order");
  }

  cancel(order: Order) {
    order.state = new CanceledOrderState();
  }

  pay(order: Order) {
    throw new Error("Order is already paid");
  }

  complete(order: Order) {
    order.state = new CompletedOrderState();
  }
}

@ChildEntity()
export class CompletedOrderState extends OrderState {
  constructor() {
    super();
    this.id = "COMPLETED";
    this.name = "Completada";
  }

  confirm(order: Order) {
    throw new Error("Cannot transition from a completed order");
  }

  cancel(order: Order) {
    throw new Error("Cannot transition from a completed order");
  }

  pay(order: Order) {
    throw new Error("Cannot transition from a completed order");
  }

  complete(order: Order) {
    throw new Error("Order is already completed");
  }
}

@ChildEntity()
export class CanceledOrderState extends OrderState {
  constructor() {
    super();
    this.id = "CANCELED";
    this.name = "Cancelada";
  }

  confirm(order: Order) {
    throw new Error("Cannot transition from a canceled order");
  }

  cancel(order: Order) {
    throw new Error("Order is already canceled");
  }

  pay(order: Order) {
    throw new Error("Cannot transition from a canceled order");
  }

  complete(order: Order) {
    throw new Error("Cannot transition from a canceled order");
  }
}
