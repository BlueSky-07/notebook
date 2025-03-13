import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'edges'
})
export class EdgeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  flowId: number;

  @Column({ default: null })
  label?: string

  @Column({ default: null })
  sourceNodeId?: number

  @Column({ default: null })
  targetNodeId?: number

  @Column()
  updatedAt: Date;
}