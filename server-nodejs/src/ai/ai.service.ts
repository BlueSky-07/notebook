import { Injectable, Logger } from '@nestjs/common';
import { createOpenAI, OpenAIProviderSettings } from '@ai-sdk/openai';
import { ConfigService } from '@nestjs/config';
import { AiInfoResponse } from './ai.type';

@Injectable()
export class AiService {
  private model?: ReturnType<ReturnType<typeof createOpenAI>> | undefined =
    undefined;
  private enabled: boolean;
  private options: OpenAIProviderSettings & {
    modelName?: string;
  };

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.options = {
      modelName: this.configService.get<string>('AI_MODEL_NAME'),
      name: this.configService.get('AI_MODEL_PROVIDER_NAME'),
      apiKey: this.configService.get('AI_MODEL_API_KEY'),
      baseURL: this.configService.get('AI_MODEL_BASE_URL'),
    };
    this.enabled = [
      this.options.modelName,
      ...Object.values<string>(this.options as Record<string, string>),
    ].every(Boolean);
    if (this.enabled) {
      this.logger.verbose('ai model initialized: ' + this.options.modelName);
      this.model = createOpenAI(this.options)(this.options.modelName);
    }
  }

  getModel() {
    return this.model;
  }

  getInfo(): AiInfoResponse {
    return {
      enabled: this.enabled,
      provider: this.options.name,
      modelName: this.options.modelName,
    };
  }
}
