import { FlowEntity } from '../flow/flow.entity'
import { NodeEntity } from '../node/node.entity'
import { EdgeEntity } from '../edge/edge.entity'
import { ApiProperty } from '@nestjs/swagger'

export class DocumentFull {
  @ApiProperty({ type: Number })
  flowId: FlowEntity['id']
  @ApiProperty({ type: String })
  name: FlowEntity['name']
  @ApiProperty({ type: String })
  author: FlowEntity['author']
  @ApiProperty({ type: Date })
  updatedAt: FlowEntity['updatedAt']
  @ApiProperty({ type: NodeEntity, isArray: true })
  nodes: NodeEntity[]
  @ApiProperty({ type: EdgeEntity, isArray: true })
  edges: EdgeEntity[]
}

export class DocumentSlim {
  @ApiProperty({ type: Number })
  flowId: FlowEntity['id']
  @ApiProperty({ type: String })
  name: FlowEntity['name']
  @ApiProperty({ type: String })
  author: FlowEntity['author']
  @ApiProperty({ type: Date })
  updatedAt: FlowEntity['updatedAt']
  @ApiProperty({ type: String, isArray: true })
  nodeIds: NodeEntity['id'][]
  @ApiProperty({ type: String, isArray: true })
  edgeIds: EdgeEntity['id'][]
}