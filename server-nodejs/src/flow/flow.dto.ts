import { FlowEntity } from './flow.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ListInput, ListResponse } from '../utils/pagination';
import { NodeEntity } from '../node/node.entity';
import { EdgeEntity } from '../edge/edge.entity';

export class FlowFull {
  @ApiProperty({ type: Number })
  flowId: FlowEntity['id'];
  @ApiProperty({ type: String })
  name: FlowEntity['name'];
  @ApiProperty({ type: Date })
  updatedAt: FlowEntity['updatedAt'];
  @ApiProperty({ type: NodeEntity, isArray: true })
  nodes: NodeEntity[];
  @ApiProperty({ type: EdgeEntity, isArray: true })
  edges: EdgeEntity[];
}

export class FlowAddInput {
  @ApiProperty({ type: String })
  name: FlowEntity['name'];
}

export class FlowAddResponse {
  @ApiProperty({ type: Number })
  id: FlowEntity['id'];
}
export class FlowPatchInput {
  @ApiProperty({ type: String, required: false })
  name?: FlowEntity['name'];
}
export class FlowDeleteResponse {
  @ApiProperty({ type: Boolean })
  done: boolean;
}

export class FlowListInput extends ListInput {
  @ApiProperty({ type: String, required: false })
  keyword?: string;
}

export class FlowListResponse extends ListResponse<FlowEntity> {
  @ApiProperty({ type: FlowEntity, isArray: true })
  items: FlowEntity[];
}
