import { Injectable, Logger } from '@nestjs/common';
import { createOpenAI, OpenAIProviderSettings } from '@ai-sdk/openai';
import { ConfigService } from '@nestjs/config';
import { AiModelsResponse, AiModelConfig } from './ai.dto';
import { fetch, ProxyAgent, type RequestInfo, type RequestInit } from 'undici';
import { LanguageModelV1 } from 'ai';
import { pick } from 'lodash';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly enabled: boolean;
  private readonly models: Map<
    string,
    {
      client: LanguageModelV1;
      options: Pick<AiModelConfig, 'id' | 'provider' | 'modelName'>;
    }
  > = new Map();

  constructor(private readonly configService: ConfigService) {
    const modelConfigs =
      this.configService.get<AiModelConfig[]>('ai.models') ?? [];
    const enabledModelConfigs = modelConfigs.filter((mc) => !mc.disabled);
    for (let i = 0; i < enabledModelConfigs.length; i++) {
      const mc = enabledModelConfigs[i];
      this.models.set(mc.id, {
        client: this.initModelClient(mc),
        options: pick(mc, ['id', 'provider', 'modelName']),
      });
    }
    this.enabled = enabledModelConfigs.length > 0;
  }

  initModelClient(modelConfig: AiModelConfig): LanguageModelV1 {
    const dispatcher = modelConfig.proxy
      ? new ProxyAgent(modelConfig.proxy)
      : undefined;
    this.logger.verbose(`${modelConfig.id} initialized`);
    return createOpenAI({
      name: modelConfig.provider,
      apiKey: modelConfig.apiKey,
      baseURL: modelConfig.baseUrl,
      fetch: dispatcher
        ? (((input: RequestInfo, init?: RequestInit) => {
            return fetch(input, {
              ...init,
              dispatcher,
            });
          }) as unknown as OpenAIProviderSettings['fetch'])
        : undefined,
    })(modelConfig.modelName);
  }

  getModel(id: string): LanguageModelV1 | undefined {
    return this.models.get(id)?.client;
  }

  getModels(): AiModelsResponse {
    return {
      enabled: this.enabled,
      models: Array.from(this.models.values()).map((model) => model.options),
    };
  }
}
