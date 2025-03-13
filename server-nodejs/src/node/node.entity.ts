import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { NodeDataType } from './node.type'

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

  @Column({ default: '' })
  data: string

  @Column({
    type: 'enum', enum: NodeDataType, default: NodeDataType.TEXT
  })
  dataType: NodeDataType

  @Column()
  updatedAt: Date
}