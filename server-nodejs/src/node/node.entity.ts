import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

export enum NodeDataType {
  Text = 'Text',
  Image = 'Image',
}

export class NodeData {
  @ApiProperty({ type: String, required: false, description: 'text content' })
  content?: string

  @ApiProperty({ type: String, required: false, description: 'image src' })
  src?: string
}

@Entity({
  name: 'nodes'
})
export class NodeEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  flowId: number

  @Column({ default: 0 })
  positionX: number

  @Column({ default: 0 })
  positionY: number

  @Column({ type: 'simple-json' })
  data: NodeData

  @Column({ type: 'enum', enum: NodeDataType, default: NodeDataType.Text })
  dataType: NodeDataType

  @Column()
  updatedAt: Date
}