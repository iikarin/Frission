import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ nullable: false })
  public user!: number;

  @Column({ nullable: false })
  public date!: Date;

  @Column({ nullable: false })
  public title!: string;

  @Column({ nullable: false })
  public description!: string;
}