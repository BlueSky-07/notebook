import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'

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
  label?: string
}


@Entity({
  name: 'edges'
})
export class EdgeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  flowId: number;

  @Column({ default: null })
  sourceNodeId?: number

  @Column({ default: null })
  targetNodeId?: number

  @ApiProperty({ enum: EdgeHandle, enumName: 'EdgeHandleEnum', required: false, default: EdgeHandle.Right })
  @Column({ type: 'enum', enum: EdgeHandle, default: EdgeHandle.Right })
  sourceHandle?: EdgeHandle

  @ApiProperty({ enum: EdgeHandle, enumName: 'EdgeHandleEnum', required: false, default: EdgeHandle.Top })
  @Column({ type: 'enum', enum: EdgeHandle, default: EdgeHandle.Top })
  targetHandle?: EdgeHandle

  @Column({ type: 'simple-json', default: () => `('${JSON.stringify({ label: '' })}')` })
  data: EdgeData

  @ApiProperty({ enum: EdgeDataType, enumName: 'EdgeDataTypeEnum', required: false, default: EdgeDataType.Label })
  @Column({ type: 'enum', enum: EdgeDataType, default: EdgeDataType.Label })
  dataType: EdgeDataType

  @Column()
  updatedAt: Date;
}