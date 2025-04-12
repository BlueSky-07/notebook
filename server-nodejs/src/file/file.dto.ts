import { ApiProperty } from '@nestjs/swagger';
import { FileEntity } from './file.entity';

export class FileAddInput {
  @ApiProperty({
    type: String,
    required: false,
    description: 'filename',
    default: '',
  })
  name?: string;

  @ApiProperty({ type: String, required: false, default: '' })
  description?: string;

  @ApiProperty({ type: String, format: 'binary', required: true })
  file: Express.Multer.File;
}

export class FileDeleteResponse {
  @ApiProperty({ type: Boolean })
  done: boolean;
}

export class FileQueryInput {
  @ApiProperty({ type: Number, required: false, default: '' })
  id?: number;

  @ApiProperty({ type: String, required: false, default: '' })
  path?: string;
}

export class FileAdminClearNoReferencesInput {
  @ApiProperty({ type: Boolean, required: false, default: true })
  dryRun?: boolean;
}

export class FileAdminClearNoReferencesResponse {
  @ApiProperty({
    type: Number,
    description: 'id of deleted files',
    isArray: true,
  })
  ids: FileEntity['id'][];

  @ApiProperty({ type: Number, description: 'count of deleted files' })
  count: number;
}
