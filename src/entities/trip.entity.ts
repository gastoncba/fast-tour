import { Column, PrimaryGeneratedColumn, Entity, ManyToMany, JoinTable } from "typeorm";

import { Place } from "./place.entity";

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description: string;

  @Column({ type: "int" })
  price: number;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date" })
  endDate: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  img: string;

  @ManyToMany(() => Place, (place) => place.trips)
  @JoinTable()
  places: Place[];
}
