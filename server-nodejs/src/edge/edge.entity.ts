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

export class EdgeData {
  @ApiProperty({ type: String, required: false, description: 'label content' })
  label?: string;
}

export enum EdgeHandle {
  Top = 'Top',
  Right = 'Right',
  Bottom = 'Bottom',
  Left = 'Left',
}

export class EdgeLayout {
  @ApiProperty({
    enum: EdgeHandle,
    enumName: 'EdgeHandleEnum',
    required: false,
    default: EdgeHandle.Right,
    description: 'Source handle position',
  })
  sourceHandle?: EdgeHandle;

  @ApiProperty({
    enum: EdgeHandle,
    enumName: 'EdgeHandleEnum',
    required: false,
    default: EdgeHandle.Top,
    description: 'Target handle position',
  })
  targetHandle?: EdgeHandle;
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

  @Column({
    type: 'simple-json',
    default: () =>
      `('${JSON.stringify({
        sourceHandle: EdgeHandle.Right,
        targetHandle: EdgeHandle.Top,
      })}')`,
  })
  layout: EdgeLayout;

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
