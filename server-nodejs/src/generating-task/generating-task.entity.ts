import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { NodeEntity } from '../node/node.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EdgeEntity } from '../edge/edge.entity';

export enum GeneratingTaskStatus {
  Pending = 'Pending',
  Generating = 'Generating',
  Done = 'Done',
  Failed = 'Failed',
  Stopped = 'Stopped',
}

export enum GeneratingTaskInputPromptType {
  Text = 'Text',
  Image = 'Image',
}

export class GeneratingTaskInputPrompt {
  @ApiProperty({
    enum: GeneratingTaskInputPromptType,
    enumName: 'GeneratingTaskInputPromptType',
  })
  type: GeneratingTaskInputPromptType;

  @ApiProperty({
    type: String,
  })
  text?: string;

  @ApiProperty({
    type: String,
  })
  src?: string;
}

@ApiExtraModels(GeneratingTaskInputPrompt)
export class GeneratingTaskInput {
  @ApiProperty({
    type: String,
    description: 'model id',
  })
  modelId?: string;

  @ApiProperty({
    type: GeneratingTaskInputPrompt,
    isArray: true,
    description: 'prompt to trigger generating task',
  })
  prompt?: GeneratingTaskInputPrompt[];

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

export class GeneratedUsage {
  @ApiProperty({ type: Number, description: 'prompt tokens' })
  promptTokens: number;
  @ApiProperty({ type: Number, description: 'completion tokens' })
  completionTokens: number;
  @ApiProperty({ type: Number, description: 'total tokens' })
  totalTokens: number;
}

@ApiExtraModels(GeneratedUsage)
export class GeneratingTaskOutput {
  @ApiProperty({ type: String, description: 'generated content' })
  generatedText?: string;
  @ApiProperty({ type: String, description: 'generated reasoning' })
  generatedReasoning?: string;
  @ApiProperty({ type: GeneratedUsage, description: 'generated usage' })
  generatedUsage?: GeneratedUsage;
  @ApiProperty({ type: String, description: 'error message' })
  errorMessage?: string;
}

@Entity({
  name: 'generating_tasks',
})
export class GeneratingTaskEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  flowId: number;

  @Column({ type: 'int' })
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
    type: 'varchar',
    length: 20,
    // enum: GeneratingTaskStatus,
    default: GeneratingTaskStatus.Pending,
  })
  status: GeneratingTaskStatus;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
