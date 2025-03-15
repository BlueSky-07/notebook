import { EdgeEntity, EdgeData, EdgeDataType, EdgeHandle } from './edge.entity'
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'

@ApiExtraModels(EdgeData)
export class EdgeAddInput {
  @ApiProperty({ type: Number })
  flowId: EdgeEntity['flowId']
  @ApiProperty({ type: Number, required: false })
  sourceNodeId?: EdgeEntity['sourceNodeId']
  @ApiProperty({ type: Number, required: false })
  targetNodeId?: EdgeEntity['targetNodeId']
  @ApiProperty({ enum: EdgeHandle, enumName: 'EdgeHandleEnum', required: false, default: EdgeHandle.Right })
  sourceHandle?: EdgeHandle
  @ApiProperty({ enum: EdgeHandle, enumName: 'EdgeHandleEnum', required: false, default: EdgeHandle.Top })
  targetHandle?: EdgeHandle
  @ApiProperty({ type: EdgeData, required: false, default: { label: '' } })
  data?: EdgeEntity['data']
  @ApiProperty({ enum: EdgeDataType, enumName: 'EdgeDataTypeEnum', required: false, default: EdgeDataType.Label })
  dataType?: EdgeEntity['dataType']
}

export class EdgeAddResponse {
  @ApiProperty({ type: Number })
  id: EdgeEntity['id']
}

export class EdgePatchInput {
  @ApiProperty({ type: Number, required: false })
  sourceNodeId?: EdgeEntity['sourceNodeId']
  @ApiProperty({ type: Number, required: false })
  targetNodeId?: EdgeEntity['targetNodeId']
  @ApiProperty({ enum: EdgeHandle, enumName: 'EdgeHandleEnum', required: false, default: EdgeHandle.Right })
  sourceHandle?: EdgeHandle
  @ApiProperty({ enum: EdgeHandle, enumName: 'EdgeHandleEnum', required: false, default: EdgeHandle.Top })
  targetHandle?: EdgeHandle
  @ApiProperty({ type: EdgeData, required: false })
  data?: EdgeEntity['data']
  @ApiProperty({ enum: EdgeDataType, enumName: 'EdgeDataTypeEnum', required: false, default: EdgeDataType.Label })
  dataType?: EdgeEntity['dataType']
}

export class EdgeDeleteResponse {
  @ApiProperty({ type: Boolean })
  done: boolean
}
