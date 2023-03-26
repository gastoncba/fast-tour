import { Column, PrimaryGeneratedColumn, Entity, ManyToMany} from "typeorm";
import { Travel } from "./travel.entity";

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 50 })
  name: string;

  @Column({ type: "int" })
  star: number;

  @ManyToMany(() => Travel, (travel) => travel.hotels)
  travels: Travel[];
}
