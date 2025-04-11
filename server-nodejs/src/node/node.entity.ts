import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { GeneratingTaskStatus } from '../generating-task/generating-task.entity';
import { FileEntity } from '../storage/storage.entity';

export enum NodeDataType {
  Text = 'Text',
  Image = 'Image',
}

export class NodeData {
  @ApiProperty({ type: String, required: false, description: 'text content' })
  content?: string;

  @ApiProperty({ type: String, required: false, description: 'image src' })
  src?: string;

  @ApiProperty({ type: Number, required: false, description: 'file id' })
  fileId?: FileEntity['id'];

  @ApiProperty({
    type: String,
    required: false,
    description: 'background (css)',
  })
  background?: string;
}

export class NodeState {
  @ApiProperty({
    type: Number,
    required: false,
    description: 'AI generating task id',
  })
  generatingTaskId?: number;

  @ApiProperty({
    enum: GeneratingTaskStatus,
    required: false,
    enumName: 'GeneratingTaskStatusEnum',
    default: GeneratingTaskStatus.Pending,
    description: 'AI generating task status',
  })
  generatingTaskStatus?: GeneratingTaskStatus;
}

export class NodeLayout {
  @ApiProperty({ type: Number })
  positionX: number;

  @ApiProperty({ type: Number })
  positionY: number;

  @ApiProperty({ type: Number })
  width: number;

  @ApiProperty({ type: Number })
  height: number;
}

@Entity({
  name: 'nodes',
})
export class NodeEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  flowId: number;

  @Column({
    type: 'simple-json',
    default: () =>
      `('${JSON.stringify({
        positionX: 0,
        positionY: 0,
        width: 100,
        height: 100,
      })}')`,
  })
  layout: NodeLayout;

  @Column({
    type: 'simple-json',
    default: () => `('${JSON.stringify({ content: '' })}')`,
  })
  data: NodeData;

  @ApiProperty({
    enum: NodeDataType,
    enumName: 'NodeDataTypeEnum',
    required: false,
    default: NodeDataType.Text,
  })
  @Column({
    type: 'varchar',
    length: 20,
    // enum: NodeDataType,
    default: NodeDataType.Text,
  })
  dataType: NodeDataType;

  @Column({ type: 'simple-json', default: () => `('${JSON.stringify({})}')` })
  state: NodeState;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
