import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, OneToMany, ManyToMany } from "typeorm";

import { Country } from "./country.entity";
import { Trip } from "./trip.entity";
import { Hotel } from "./hotel.entity";
import { PlaceVisited } from "./placeVisited.entity";

@Entity()
export class Place {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  img: string;

  @ManyToOne(() => Country, (country) => country.places)
  country: Country;

  @ManyToMany(() => Trip, (trip) => trip.places)
  trips: Trip[];

  @OneToMany(() => Hotel, (hotel) => hotel.place)
  hotels: Hotel[];

  @OneToMany(() => PlaceVisited, (placeVisited) => placeVisited.place)
  visiteds: PlaceVisited[];

  @Column({ type: "boolean", default: true, select: false })
  enabled: boolean;
}
