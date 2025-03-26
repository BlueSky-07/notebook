import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'flows',
})
export class FlowEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
