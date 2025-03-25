import { Injectable, Logger } from '@nestjs/common';
import { createOpenAI, OpenAIProviderSettings } from '@ai-sdk/openai';
import { ConfigService } from '@nestjs/config';
import { AiInfoResponse } from './ai.type';
import { fetch, ProxyAgent, type RequestInfo, type RequestInit } from 'undici'

@Injectable()
export class AiService {
  private model?: ReturnType<ReturnType<typeof createOpenAI>> | undefined =
    undefined;
  private enabled: boolean;
  private options: OpenAIProviderSettings & {
    modelName?: string;
  };
  private dispatcher: ProxyAgent;

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    const httpProxyUri = this.configService.get('HTTP_PROXY')
    if (httpProxyUri) {
      this.dispatcher = new ProxyAgent(httpProxyUri)
      this.logger.verbose('ai model use proxy: ' + httpProxyUri);
    }
    this.options = {
      modelName: this.configService.get<string>('AI_MODEL_NAME'),
      name: this.configService.get('AI_MODEL_PROVIDER_NAME'),
      apiKey: this.configService.get('AI_MODEL_API_KEY'),
      baseURL: this.configService.get('AI_MODEL_BASE_URL'),
      fetch: ((input: RequestInfo, init?: RequestInit) => {
        return fetch(input, {
          ...init,
          dispatcher: this.dispatcher
        })
      }) as unknown as OpenAIProviderSettings['fetch']
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
