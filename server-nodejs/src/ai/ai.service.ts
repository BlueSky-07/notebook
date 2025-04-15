import { Injectable, Logger } from '@nestjs/common';
import { createOpenAI, OpenAIProviderSettings } from '@ai-sdk/openai';
import { ConfigService } from '@nestjs/config';
import { AiModelsResponse, AiModelConfig } from './ai.dto';
import { fetch, ProxyAgent, type RequestInfo, type RequestInit } from 'undici';
import { type LanguageModelV1, type ImageModel } from 'ai';
import { pick } from 'lodash';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly enabled: boolean;
  private readonly models: Map<
    string,
    {
      models: ReturnType<AiService['initModelClient']>;
      options: Pick<
        AiModelConfig,
        'id' | 'provider' | 'modelName' | 'features'
      >;
    }
  > = new Map();

  constructor(private readonly configService: ConfigService) {
    const modelConfigs =
      this.configService.get<AiModelConfig[]>('ai.models') ?? [];
    const enabledModelConfigs = modelConfigs.filter((mc) => !mc.disabled);
    for (let i = 0; i < enabledModelConfigs.length; i++) {
      const mc = enabledModelConfigs[i];
      this.models.set(mc.id, {
        models: this.initModelClient(mc),
        options: {
          ...pick(mc, ['id', 'provider', 'modelName']),
          features: mc.features ?? ['text-generation'],
        },
      });
    }
    this.enabled = enabledModelConfigs.length > 0;
  }

  initModelClient(modelConfig: AiModelConfig): {
    llm: LanguageModelV1 | null;
    image: ImageModel | null;
  } {
    const dispatcher = modelConfig.proxy
      ? new ProxyAgent(modelConfig.proxy)
      : undefined;
    this.logger.verbose(`${modelConfig.id} initialized`);
    const provider = createOpenAI({
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
    });
    return {
      llm: modelConfig.features?.includes('text-generation')
        ? provider.languageModel(modelConfig.modelName)
        : null,
      image: modelConfig.features?.includes('image-generation')
        ? provider.imageModel(modelConfig.modelName)
        : null,
    };
  }

  getModel(id: string): ReturnType<typeof this.initModelClient> | undefined {
    return this.models.get(id)?.models;
  }

  getModels(): AiModelsResponse {
    return {
      enabled: this.enabled,
      models: Array.from(this.models.values()).map((model) => model.options),
    };
  }
}
