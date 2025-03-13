import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FlowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string

  @Column()
  author: string

  @Column()
  updatedAt: Date;
}