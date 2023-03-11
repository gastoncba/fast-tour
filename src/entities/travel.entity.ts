import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToOne,
  JoinColumn
} from "typeorm";
// import { BasicEntity } from "./basic.entity";
import { Place } from "./place.entity";

@Entity()
export class Travel {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "int" })
  price: number;

  @OneToOne(() => Place, (place) => place.travel)
  @JoinColumn()
  place: Place
}
