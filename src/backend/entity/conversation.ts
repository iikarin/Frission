import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { User } from "./user";

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ nullable: false })
  public participantOne!: number;

  @Column({ nullable: false })
  public participantTwo!: number;
}