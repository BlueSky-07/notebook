import { ApiProperty } from '@nestjs/swagger';

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
