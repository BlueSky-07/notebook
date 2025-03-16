import { ApiProperty } from '@nestjs/swagger';
import { NodeEntity } from '../node/node.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EdgeEntity } from '../edge/edge.entity';

export enum GeneratingTaskStatus {
  Pending = 'Pending',
  Generating = 'Generating',
  Done = 'Done',
  Failed = 'Failed',
  Stopped = 'Stopped',
}

export class GeneratingTaskInput {
  @ApiProperty({
    type: String,
    description: 'prompt to trigger generating task',
  })
  prompt?: string;

  @ApiProperty({
    type: NodeEntity,
    isArray: true,
    required: false,
    description: 'generating from source nodes',
  })
  sourceNodeSnapshots?: NodeEntity[];

  @ApiProperty({
    type: EdgeEntity,
    isArray: true,
    required: false,
    description: 'generating from source edges',
  })
  edgeSnapshots?: EdgeEntity[];
}

export class GeneratingTaskOutput {
  @ApiProperty({ type: String, description: 'generated content' })
  generatedContent?: string;
  @ApiProperty({ type: String, description: 'error message' })
  errorMessage?: string;
}

@Entity({
  name: 'generating_tasks',
})
export class GeneratingTaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  flowId: number;

  @Column()
  targetNodeId: number;

  @Column({ type: 'simple-json', default: () => `('${JSON.stringify({})}')` })
  input: GeneratingTaskInput;

  @Column({ type: 'simple-json', default: () => `('${JSON.stringify({})}')` })
  output: GeneratingTaskOutput;

  @ApiProperty({
    enum: GeneratingTaskStatus,
    enumName: 'GeneratingTaskStatusEnum',
    default: GeneratingTaskStatus.Pending,
  })
  @Column({
    type: 'enum',
    enum: GeneratingTaskStatus,
    default: GeneratingTaskStatus.Pending,
  })
  status: GeneratingTaskStatus;

  @Column()
  updatedAt: Date;
}
