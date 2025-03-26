import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum EdgeDataType {
  Label = 'Label',
}

export enum EdgeHandle {
  Top = 'Top',
  Right = 'Right',
  Bottom = 'Bottom',
  Left = 'Left',
}

export class EdgeData {
  @ApiProperty({ type: String, required: false, description: 'label content' })
  label?: string;
}

@Entity({
  name: 'edges',
})
export class EdgeEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  flowId: number;

  @Column({ type: 'int', default: null })
  sourceNodeId?: number;

  @Column({ type: 'int', default: null })
  targetNodeId?: number;

  @ApiProperty({
    enum: EdgeHandle,
    enumName: 'EdgeHandleEnum',
    required: false,
    default: EdgeHandle.Right,
  })
  @Column({
    type: 'varchar',
    length: 10,
    // enum: EdgeHandle,
    default: EdgeHandle.Right,
  })
  sourceHandle?: EdgeHandle;

  @ApiProperty({
    enum: EdgeHandle,
    enumName: 'EdgeHandleEnum',
    required: false,
    default: EdgeHandle.Top,
  })
  @Column({
    type: 'varchar',
    length: 10,
    // enum: EdgeHandle,
    default: EdgeHandle.Top,
  })
  targetHandle?: EdgeHandle;

  @Column({
    type: 'simple-json',
    default: () => `('${JSON.stringify({ label: '' })}')`,
  })
  data: EdgeData;

  @ApiProperty({
    enum: EdgeDataType,
    enumName: 'EdgeDataTypeEnum',
    required: false,
    default: EdgeDataType.Label,
  })
  @Column({
    type: 'varchar',
    length: 20,
    // enum: EdgeDataType,
    default: EdgeDataType.Label,
  })
  dataType: EdgeDataType;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
