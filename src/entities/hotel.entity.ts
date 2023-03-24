import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 50 })
  name: string;

  @Column({ type: "int" })
  star: number;
}
