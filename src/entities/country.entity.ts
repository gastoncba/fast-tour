import { Column, PrimaryGeneratedColumn, Entity, OneToMany, ManyToMany } from "typeorm";

import { Place } from "./place.entity";
import { Travel } from "./travel.entity";

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({type: 'varchar', length: 255, nullable:true})
  img: string;

  @OneToMany(() => Place, (place) => place.country)
  places: Place[];

}
