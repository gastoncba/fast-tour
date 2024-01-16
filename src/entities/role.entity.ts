import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { User } from "./user.entity";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
