import { FlowEntity } from './flow.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ListInput, ListResponse } from '../utils/pagination';

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
  filter?: Record<string, unknown>;
}

export class FlowListResponse extends ListResponse<FlowEntity> {
  @ApiProperty({ type: FlowEntity, isArray: true })
  items: FlowEntity[];
}
