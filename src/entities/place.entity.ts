import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  OneToMany
} from "typeorm";

import { Country } from "./country.entity";
import { Travel } from "./travel.entity";

@Entity()
export class Place {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({type: 'varchar', length: 255, nullable: true})
  img: string;

  @ManyToOne(() => Country, (country) => country.places)
  country: Country;

  @OneToMany(() => Travel, (travel) => travel.place)
  travels: Travel[]
}
