import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Conversation } from "./conversation";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ nullable: false })
  public name!: string;

  @Column({ nullable: false })
  public username!: string;

  @Column({ nullable: false })
  public school!: string;

  @Column({ nullable: false })
  public grade!: number;

  @Column({ nullable: false })
  public password!: string;

  @Column({ nullable: true })
  public email!: string;

  @Column({ nullable: true, comment: "Comma separated user IDs" })
  public connections!: string;

  @Column({ nullable: true, comment: "Comma separated user IDs" })
  public conversations!: string;
}