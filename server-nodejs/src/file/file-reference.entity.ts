import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileEntity } from './file.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum FileReferenceSourceType {
  Node = 'Node',
}

@Entity({
  name: 'file-references',
})
export class FileReferenceEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  fileId: FileEntity['id'];

  @ApiProperty({
    enum: FileReferenceSourceType,
    enumName: 'FileReferenceSourceTypeEnum',
    required: false,
    default: FileReferenceSourceType.Node,
  })
  @Column({
    type: 'varchar',
    length: 20,
    // enum: FileReferenceSourceType,
    default: FileReferenceSourceType.Node,
  })
  sourceType: FileReferenceSourceType;

  @Column({ type: 'int' })
  sourceId: number;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
