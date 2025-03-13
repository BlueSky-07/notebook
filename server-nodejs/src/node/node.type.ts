import { NodeEntity } from './node.entity'
import { ApiProperty } from '@nestjs/swagger'

export enum NodeDataType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
}

export class NodeAddInput {
  @ApiProperty({ type: Number })
  flowId: NodeEntity['flowId']
  @ApiProperty({ type: Number, required: false, default: 0 })
  positionX?: NodeEntity['positionX']
  @ApiProperty({ type: Number, required: false, default: 0 })
  positionY?: NodeEntity['positionY']
  @ApiProperty({ type: String, required: false, default: '' })
  data?: NodeEntity['data']
  @ApiProperty({ type: String, required: false, enum: NodeDataType, default: NodeDataType.TEXT })
  dataType?: NodeEntity['dataType']
}

export class NodeAddResponse  {
  @ApiProperty({ type: Number })
  id: NodeEntity['id']
}

export class NodePatchInput {
  @ApiProperty({ type: Number, required: false })
  positionX?: NodeEntity['positionX']
  @ApiProperty({ type: Number, required: false })
  positionY?: NodeEntity['positionY']
  @ApiProperty({ type: String, required: false })
  data?: NodeEntity['data']
  @ApiProperty({ type: String, required: false, enum: NodeDataType })
  dataType?: NodeEntity['dataType']
}

export class NodeDeleteResponse {
  @ApiProperty({ type: Boolean })
  done: boolean
}

