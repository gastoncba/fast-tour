import { Entity, Column, TableInheritance, ChildEntity, PrimaryColumn } from "typeorm";

import { Order } from "./order.entity";
import { EmailService } from "../services/email.service";

@Entity({ name: "order_state" })
@TableInheritance({ column: { type: "varchar", name: "type" } })
export abstract class OrderState {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id: string;

  @Column({ type: "varchar", length: 50 })
  name: string;

  abstract confirm(order: Order, emailService: EmailService): void;
  abstract cancel(order: Order, emailService: EmailService): void;
  abstract pay(order: Order, emailService: EmailService): void;
  abstract complete(order: Order, emailService: EmailService): void;
}

@ChildEntity()
export class PendingOrderState extends OrderState {
  constructor() {
    super();
    this.id = "PENDING";
    this.name = "Pendiente";
  }

  confirm(order: Order, emailService: EmailService) {
    order.state = new ConfirmedOrderState();
    emailService.notifyChangeOfStatus(order, "Orden - Confirmada", "!Tu orden de viaje fue confirmada!", "Confirmada", "Pagada");
  }

  cancel(order: Order, emailService: EmailService) {
    order.state = new CanceledOrderState();
    emailService.notifyChangeOfStatus(order, "Orden - Cancelada", "!Tu orden de viaje fue Cancelada!", "Cancelada");
  }

  pay(order: Order, emailService: EmailService) {
    throw new Error("Cannot pay a pending order");
  }

  complete(order: Order, emailService: EmailService) {
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

  confirm(order: Order, emailService: EmailService) {
    throw new Error("Order is already confirmed");
  }

  cancel(order: Order, emailService: EmailService) {
    order.state = new CanceledOrderState();
    emailService.notifyChangeOfStatus(order, "Orden - Cancelada", "!Tu orden de viaje fue Cancelada!", "Cancelada");
  }

  pay(order: Order, emailService: EmailService) {
    order.state = new PaidOrderState();
    emailService.notifyChangeOfStatus(order, "Orden - Pagada", "!Tu orden de viaje ha sido pagada!", "Pagada", "Completada");
  }

  complete(order: Order, emailService: EmailService) {
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

  confirm(order: Order, emailService: EmailService) {
    throw new Error("Cannot confirm a paid order");
  }

  cancel(order: Order, emailService: EmailService) {
    order.state = new CanceledOrderState();
    emailService.notifyChangeOfStatus(order, "Orden - Cancelada", "!Tu orden de viaje fue Cancelada!", "Cancelada");
  }

  pay(order: Order, emailService: EmailService) {
    throw new Error("Order is already paid");
  }

  complete(order: Order, emailService: EmailService) {
    order.state = new CompletedOrderState();
    emailService.notifyChangeOfStatus(order, "Orden - Completada", "!Tu orden de viaje ha sido Completada!", "Completada");
  }
}

@ChildEntity()
export class CompletedOrderState extends OrderState {
  constructor() {
    super();
    this.id = "COMPLETED";
    this.name = "Completada";
  }

  confirm(order: Order, emailService: EmailService) {
    throw new Error("Cannot transition from a completed order");
  }

  cancel(order: Order, emailService: EmailService) {
    throw new Error("Cannot transition from a completed order");
  }

  pay(order: Order, emailService: EmailService) {
    throw new Error("Cannot transition from a completed order");
  }

  complete(order: Order, emailService: EmailService) {
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

  confirm(order: Order, emailService: EmailService) {
    throw new Error("Cannot transition from a canceled order");
  }

  cancel(order: Order, emailService: EmailService) {
    throw new Error("Order is already canceled");
  }

  pay(order: Order, emailService: EmailService) {
    throw new Error("Cannot transition from a canceled order");
  }

  complete(order: Order, emailService: EmailService) {
    throw new Error("Cannot transition from a canceled order");
  }
}
