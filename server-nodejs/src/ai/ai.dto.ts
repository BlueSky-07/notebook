import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

export class AiModelInfo {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  provider: string;
  @ApiProperty({ type: String })
  modelName: string;
  @ApiProperty({ type: String, isArray: true })
  features: string[];
}

@ApiExtraModels(AiModelInfo)
export class AiModelsResponse {
  @ApiProperty({ type: Boolean })
  enabled: boolean;
  @ApiProperty({ type: AiModelInfo, isArray: true })
  models: AiModelInfo[];
}

export interface AiModelConfig<AdapterOptions = Record<string, unknown>> {
  id: string; // unique id, format: ${modelName}@${provider}
  provider: string;
  modelName: string;
  apiKey?: string;
  baseUrl?: string;
  proxy?: string;
  disabled?: boolean;
  adapter?: string;
  adapterOptions?: AdapterOptions;
  features: Array<
    'text-generation' | 'reasoning' | 'vision' | 'image-generation'
  >;
}
