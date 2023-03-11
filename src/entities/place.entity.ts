import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToOne,
  JoinColumn
} from "typeorm";

import { Country } from "./country.entity";
import { Travel } from "./travel.entity";

@Entity()
export class Place {
  @PrimaryGeneratedColumn()
  id:string

  @Column({type: 'varchar', length: 255})
  name: string

  @OneToOne(() => Country, (country) => country.place)
  @JoinColumn()
  country: Country

  @OneToOne(() => Travel, (travel) => travel.place)
  travel: Travel
}
