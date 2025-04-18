import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { createOpenAI, OpenAIProviderSettings } from '@ai-sdk/openai';
import { ConfigService } from '@nestjs/config';
import { AiModelConfig, AiModelsResponse } from './ai.dto';
import { fetch, ProxyAgent, type RequestInfo, type RequestInit } from 'undici';
import { type ImageModel, type LanguageModelV1 } from 'ai';
import { pick } from 'lodash';
import {
  AI_MODEL_ADAPTERS_INJECTION_NAME,
  AiModelAdapter,
} from './adapter.type';
import { FileService } from '../file/file.service';
import { InngestService } from '../inngest/inngest.service';
import { GeneratingTaskService } from '../generating-task/generating-task.service';

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
        'id' | 'provider' | 'modelName' | 'features' | 'adapter'
      >;
      adapter?: AiModelAdapter;
    }
  > = new Map();

  constructor(
    private readonly configService: ConfigService,
    @Inject(AI_MODEL_ADAPTERS_INJECTION_NAME)
    private readonly aiModelAdapters: (typeof AiModelAdapter)[],
    private readonly fileService: FileService,
    @Inject(forwardRef(() => InngestService))
    private readonly inngestService: InngestService,
    private readonly generatingTaskService: GeneratingTaskService,
  ) {
    const modelConfigs =
      this.configService.get<AiModelConfig[]>('ai.models') ?? [];
    const enabledModelConfigs = modelConfigs.filter((mc) => !mc.disabled);
    for (let i = 0; i < enabledModelConfigs.length; i++) {
      const mc = enabledModelConfigs[i];
      const fetcher = this.initFetcher(mc);
      this.models.set(mc.id, {
        models: this.initModelClient(mc, fetcher),
        options: {
          ...pick(mc, ['id', 'provider', 'modelName']),
          features: mc.features ?? ['text-generation'],
        },
        adapter: mc.adapter
          ? this.initAdapter(mc.adapter, mc, fetcher)
          : undefined,
      });
    }
    this.enabled = enabledModelConfigs.length > 0;
  }

  initFetcher(
    modelConfig: Pick<AiModelConfig, 'proxy'>,
  ): typeof fetch | undefined {
    const dispatcher = modelConfig.proxy
      ? new ProxyAgent(modelConfig.proxy)
      : undefined;
    return dispatcher
      ? (input: RequestInfo, init?: RequestInit) => {
          return fetch(input, {
            ...init,
            dispatcher,
          });
        }
      : undefined;
  }

  initModelClient(
    modelConfig: AiModelConfig,
    fetcher?: ReturnType<AiService['initFetcher']>,
  ): {
    llm: LanguageModelV1 | null;
    image: ImageModel | null;
  } {
    this.logger.verbose(`${modelConfig.id} initialized`);
    const provider = createOpenAI({
      name: modelConfig.provider,
      apiKey: modelConfig.apiKey,
      baseURL: modelConfig.baseUrl,
      fetch: fetcher as unknown as OpenAIProviderSettings['fetch'],
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

  initAdapter(
    name: string,
    config: AiModelConfig,
    fetcher?: ReturnType<AiService['initFetcher']>,
  ): AiModelAdapter | undefined {
    if (!name) {
      return undefined;
    }
    const adapter = this.aiModelAdapters.find(
      (adapter) => adapter.adapterName === name,
    );
    if (adapter) {
      return new adapter(
        config,
        this.fileService,
        this.inngestService,
        this.generatingTaskService,
        fetcher ?? fetch,
      );
    }
    return undefined;
  }

  getAdapter(id: string): ReturnType<typeof this.initAdapter> | undefined {
    return this.models.get(id)?.adapter;
  }

  getModel(id: string): ReturnType<typeof this.initModelClient> | undefined {
    return this.models.get(id)?.models;
  }

  getAllModels(): AiModelsResponse {
    return {
      enabled: this.enabled,
      models: Array.from(this.models.values()).map((model) => model.options),
    };
  }
}
