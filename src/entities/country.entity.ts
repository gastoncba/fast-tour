import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
} from "typeorm";

import { Place } from "./place.entity";

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 10 })
  code: string;

  @OneToMany(() => Place, (place) => place.country)
  places: Place[];
}
