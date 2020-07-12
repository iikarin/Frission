import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ConnectionStatus } from "../../types/connection-status";

@Entity()
export class Connection {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public initiator!: number;

  @Column()
  public receiver!: number;

  @Column()
  public status!: ConnectionStatus;
}