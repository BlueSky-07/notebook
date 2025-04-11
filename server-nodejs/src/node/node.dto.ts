import {
  NodeDataType,
  NodeEntity,
  NodeData,
  NodeState,
  NodeLayout,
} from './node.entity';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels(NodeData, NodeLayout)
export class NodeAddInput {
  @ApiProperty({ type: Number })
  flowId: NodeEntity['flowId'];
  @ApiProperty({
    type: NodeLayout,
    default: {
      positionX: 0,
      positionY: 0,
      width: 100,
      height: 100,
    },
  })
  layout: NodeEntity['layout'];
  @ApiProperty({ type: NodeData, required: false, default: { content: '' } })
  data?: NodeEntity['data'];
  @ApiProperty({
    enum: NodeDataType,
    enumName: 'NodeDataTypeEnum',
    required: false,
    default: NodeDataType.Text,
  })
  dataType?: NodeEntity['dataType'];
}

export class NodeAddResponse {
  @ApiProperty({ type: Number })
  id: NodeEntity['id'];
}

@ApiExtraModels(NodeLayout)
export class NodePatchInput {
  @ApiProperty({
    type: NodeLayout,
    required: false,
    default: {
      positionX: 0,
      positionY: 0,
      width: 100,
      height: 100,
    },
  })
  layout?: NodeEntity['layout'];
  @ApiProperty({ type: NodeData, required: false })
  data?: NodeEntity['data'];
  @ApiProperty({
    enum: NodeDataType,
    enumName: 'NodeDataTypeEnum',
    required: false,
    default: NodeDataType.Text,
  })
  dataType?: NodeEntity['dataType'];
  @ApiProperty({ type: NodeState, required: false })
  state?: NodeEntity['state'];
}

export class NodeDeleteResponse {
  @ApiProperty({ type: Boolean })
  done: boolean;
}

@ApiExtraModels(NodeAddInput)
export class BatchNodeAddInput {
  @ApiProperty({ type: [NodeAddInput] })
  nodes: NodeAddInput[];
}

export class BatchNodeAddResponse {
  @ApiProperty({ type: Number, isArray: true })
  ids: NodeEntity['id'][];
}

export class BatchNodePatchInputItem extends NodePatchInput {
  @ApiProperty({ type: Number })
  id: NodeEntity['id'];
}

@ApiExtraModels(BatchNodePatchInputItem)
export class BatchNodePatchInput {
  @ApiProperty({ type: BatchNodePatchInputItem, isArray: true })
  nodes: BatchNodePatchInputItem[];
}

export class BatchNodeDeleteInput {
  @ApiProperty({ type: Number, isArray: true })
  ids: NodeEntity['id'][];
}
