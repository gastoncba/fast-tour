import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { Hotel } from "./hotel.entity";
import { Place } from "./place.entity";

@Entity()
export class Travel {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "int" })
  price: number;

  @ManyToOne(() => Place, (place) => place.travels)
  place: Place

  @ManyToMany(() => Hotel, (hotel) => hotel.travels)
  @JoinTable()
  hotels: Hotel[]
}
