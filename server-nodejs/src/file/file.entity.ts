import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  STORAGE_BUCKET_NAME,
  type StorageBucketName,
} from '../storage/storage.const';
import { ApiProperty } from '@nestjs/swagger';

export class FileMetadata {
  @ApiProperty({
    type: String,
    required: true,
    description: 'filename extension',
  })
  extension: string;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'file size, unit: byte',
  })
  size: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'MIME',
  })
  mime: string;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'image file width',
  })
  width?: number;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'image file height',
  })
  height?: number;
}

@Entity({
  name: 'files',
})
export class FileEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({
    type: 'varchar',
    length: 256,
  })
  name: string;

  @Column({
    type: 'text',
    default: '',
  })
  description: string;

  @ApiProperty({
    enum: STORAGE_BUCKET_NAME,
    enumName: 'StorageBucketName',
    required: true,
    default: STORAGE_BUCKET_NAME.UPLOADED,
  })
  @Column({
    type: 'varchar',
    length: '50',
    // enum: STORAGE_BUCKET_NAME,
    default: STORAGE_BUCKET_NAME.UPLOADED,
  })
  bucket: StorageBucketName;

  @Column({
    type: 'varchar',
    length: 256,
  })
  path: string;

  @Column({ type: 'simple-json', default: () => `('${JSON.stringify({})}')` })
  metadata: FileMetadata;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
