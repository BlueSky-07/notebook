import { ApiProperty } from '@nestjs/swagger';

export class AiInfoResponse {
  @ApiProperty({ type: Boolean })
  enabled: boolean;
  @ApiProperty({ type: String, required: false })
  provider: string;
  @ApiProperty({ type: String, required: false })
  modelName: string;
}
