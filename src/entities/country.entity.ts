import { Column, PrimaryGeneratedColumn, Entity, OneToOne } from "typeorm";

import { Place } from "./place.entity";

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @OneToOne(() => Place, (place) => place.country, { nullable: true })
  place: Place;
}
