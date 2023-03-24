import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToOne,
  JoinColumn,
} from "typeorm";

import { Place } from "./place.entity";

@Entity()
export class Travel {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "int" })
  price: number;

  @OneToOne(() => Place, (place) => place.travel, { nullable: true })
  @JoinColumn()
  place: Place;
}
