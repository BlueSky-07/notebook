import { EdgeEntity } from './edge.entity'
import { ApiProperty } from '@nestjs/swagger'

export class EdgeAddInput {
  @ApiProperty({ type: Number })
  flowId: EdgeEntity['flowId']
  @ApiProperty({ type: Number, required: false })
  sourceNodeId?: EdgeEntity['sourceNodeId']
  @ApiProperty({ type: Number, required: false })
  targetNodeId?: EdgeEntity['targetNodeId']
  @ApiProperty({ type: String, required: false })
  label?: EdgeEntity['label']
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
  @ApiProperty({ type: String, required: false })
  label?: EdgeEntity['label']
}

export class EdgeDeleteResponse {
  @ApiProperty({ type: Boolean })
  done: boolean
}
