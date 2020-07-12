import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { User } from "./user";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ nullable: false })
  public type!: "all" | "connected";

  @Column({ nullable: false })
  public content!: string;

  @Column({ nullable: false })
  author!: number;

  @Column({ nullable: true })
  hearts!: string;

  @Column({ nullable: false })
  createdOn!: Date;
}