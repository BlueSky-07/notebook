import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { GeneratingTaskStatus } from '../generating-task/generating-task.entity'

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

export class NodeState {
  @ApiProperty({ type: Number, required: false, description: 'AI generating task id' })
  generatingTaskId?: number

  @ApiProperty({ enum: GeneratingTaskStatus, required: false, enumName: 'GeneratingTaskStatusEnum', default: GeneratingTaskStatus.Pending, description: 'AI genarating task status' })
  generatingTaskStatus?: GeneratingTaskStatus
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

  @Column({ type: 'simple-json', default: () => `('${JSON.stringify({ content: '' })}')` })
  data: NodeData

  @ApiProperty({ enum: NodeDataType, enumName: 'NodeDataTypeEnum', required: false, default: NodeDataType.Text })
  @Column({ type: 'enum', enum: NodeDataType, default: NodeDataType.Text })
  dataType: NodeDataType

  @Column({ type: 'simple-json', default: () => `('${JSON.stringify({})}')` })
  state: NodeState

  @Column()
  updatedAt: Date
}