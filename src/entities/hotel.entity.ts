import { Column, PrimaryGeneratedColumn, Entity, ManyToOne} from "typeorm";
import { Travel } from "./travel.entity";

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 50 })
  name: string;

  @Column({ type: "int" })
  star: number;

  @ManyToOne(() => Travel, (travel) => travel.hotels)
  travel: Travel;
}
