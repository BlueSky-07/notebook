import {
  EdgeEntity,
  EdgeData,
  EdgeDataType,
  EdgeHandle,
  EdgeLayout,
} from './edge.entity';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels(EdgeData, EdgeLayout)
export class EdgeAddInput {
  @ApiProperty({ type: Number })
  flowId: EdgeEntity['flowId'];
  @ApiProperty({ type: Number, required: false })
  sourceNodeId?: EdgeEntity['sourceNodeId'];
  @ApiProperty({ type: Number, required: false })
  targetNodeId?: EdgeEntity['targetNodeId'];
  @ApiProperty({
    type: EdgeLayout,
    default: {
      sourceHandle: EdgeHandle.Right,
      targetHandle: EdgeHandle.Top,
    },
  })
  layout: EdgeEntity['layout'];
  @ApiProperty({ type: EdgeData, required: false, default: { label: '' } })
  data?: EdgeEntity['data'];
  @ApiProperty({
    enum: EdgeDataType,
    enumName: 'EdgeDataTypeEnum',
    required: false,
    default: EdgeDataType.Label,
  })
  dataType?: EdgeEntity['dataType'];
}

export class EdgeAddResponse {
  @ApiProperty({ type: Number })
  id: EdgeEntity['id'];
}

@ApiExtraModels(EdgeLayout)
export class EdgePatchInput {
  @ApiProperty({ type: Number, required: false })
  sourceNodeId?: EdgeEntity['sourceNodeId'];
  @ApiProperty({ type: Number, required: false })
  targetNodeId?: EdgeEntity['targetNodeId'];
  @ApiProperty({
    type: EdgeLayout,
    required: false,
    default: {
      sourceHandle: EdgeHandle.Right,
      targetHandle: EdgeHandle.Top,
    },
  })
  layout?: EdgeEntity['layout'];
  @ApiProperty({ type: EdgeData, required: false })
  data?: EdgeEntity['data'];
  @ApiProperty({
    enum: EdgeDataType,
    enumName: 'EdgeDataTypeEnum',
    required: false,
    default: EdgeDataType.Label,
  })
  dataType?: EdgeEntity['dataType'];
}

export class EdgeDeleteResponse {
  @ApiProperty({ type: Boolean })
  done: boolean;
}

@ApiExtraModels(EdgeAddInput)
export class BatchEdgeAddInput {
  @ApiProperty({ type: [EdgeAddInput] })
  edges: EdgeAddInput[];
}

export class BatchEdgeAddResponse {
  @ApiProperty({ type: Number, isArray: true })
  ids: EdgeEntity['id'][];
}

export class BatchEdgePatchInputItem extends EdgePatchInput {
  @ApiProperty({ type: Number })
  id: EdgeEntity['id'];
}

@ApiExtraModels(BatchEdgePatchInputItem)
export class BatchEdgePatchInput {
  @ApiProperty({ type: BatchEdgePatchInputItem, isArray: true })
  edges: BatchEdgePatchInputItem[];
}

export class BatchEdgeDeleteInput {
  @ApiProperty({ type: Number, isArray: true })
  ids: EdgeEntity['id'][];
}