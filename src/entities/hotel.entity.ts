import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, OneToMany } from "typeorm";

import { Place } from "./place.entity";
import { PlaceVisited } from "./placeVisited.entity";

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 50 })
  name: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  description: string;

  @Column({ type: "int" })
  stars: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  img: string;

  @ManyToOne(() => Place, (place) => place.hotels)
  place: Place;

  @OneToMany(() => PlaceVisited, (placeVisited) => placeVisited.hotel)
  visiteds: PlaceVisited[];

  @Column({ type: "boolean", default: true, select: false })
  enabled: boolean;
}
