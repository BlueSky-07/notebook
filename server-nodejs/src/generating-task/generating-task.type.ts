import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
  GeneratingTaskEntity,
  GeneratingTaskOutput,
  GeneratingTaskStatus,
} from './generating-task.entity';
import { NodeEntity } from '../node/node.entity';
import { EdgeEntity } from '../edge/edge.entity';

export class GeneratingTaskInputInAddInput {
  @ApiProperty({
    type: Number,
    isArray: true,
    description: 'generating from source nodes',
  })
  sourceNodeIds: NodeEntity['id'][];

  @ApiProperty({
    type: Number,
    isArray: true,
    description: 'generating from source edges',
  })
  edgeIds: EdgeEntity['id'][];
}

@ApiExtraModels(GeneratingTaskInputInAddInput)
export class GeneratingTaskAddInput {
  @ApiProperty({ type: Number })
  flowId: GeneratingTaskEntity['flowId'];
  @ApiProperty({ type: Number })
  targetNodeId: GeneratingTaskEntity['targetNodeId'];
  @ApiProperty({ type: GeneratingTaskInputInAddInput })
  input: GeneratingTaskInputInAddInput;
}

export class GeneratingTaskAddResponse {
  @ApiProperty({ type: Number })
  id: GeneratingTaskEntity['id'];
}

export class GeneratingTaskPatchInput {
  @ApiProperty({ type: GeneratingTaskOutput })
  output: GeneratingTaskEntity['output'];
  @ApiProperty({
    enum: GeneratingTaskStatus,
    enumName: 'GeneratingTaskStatusEnum',
  })
  status: GeneratingTaskEntity['status'];
}

export class GeneratingTaskStopResponse {
  @ApiProperty({ type: Boolean })
  done: boolean;
}
