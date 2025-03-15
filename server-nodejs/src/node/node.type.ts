import { NodeDataType, NodeEntity, NodeData, NodeState } from './node.entity'
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'

@ApiExtraModels(NodeData)
export class NodeAddInput {
  @ApiProperty({ type: Number })
  flowId: NodeEntity['flowId']
  @ApiProperty({ type: Number, required: false, default: 0 })
  positionX?: NodeEntity['positionX']
  @ApiProperty({ type: Number, required: false, default: 0 })
  positionY?: NodeEntity['positionY']
  @ApiProperty({ type: NodeData, required: false, default: { content: '' } })
  data?: NodeEntity['data']
  @ApiProperty({ enum: NodeDataType, enumName: 'NodeDataTypeEnum', required: false, default: NodeDataType.Text })
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
  @ApiProperty({ type: NodeData, required: false })
  data?: NodeEntity['data']
  @ApiProperty({ enum: NodeDataType, enumName: 'NodeDataTypeEnum', required: false, default: NodeDataType.Text })
  dataType?: NodeEntity['dataType']
  @ApiProperty({ type: NodeState, required: false })
  state?: NodeEntity['state']
}

export class NodeDeleteResponse {
  @ApiProperty({ type: Boolean })
  done: boolean
}

