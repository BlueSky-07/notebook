import { Injectable } from '@nestjs/common';
import {
  AiModelAdapter,
  AiModelAdapterPollingResult,
  AiModelAdapterProcessResult,
} from '../adapter.type';
import { GeneratingTaskEntity } from '../../generating-task/generating-task.entity';
import { STORAGE_BUCKET_NAME } from '../../storage/storage.const';
import AiModelAdapterHandlerEvent from '../adapter.event';
import { Service } from '@volcengine/openapi';
import { get } from 'lodash';

interface DoubaoT2IVolcEngineAdapterOptions {
  region?: string;
  accessKeyId?: string;
  secretKey?: string;
  reqKey?: string; // "high_aes_general_v21_L", "high_aes_general_v20_L", "high_aes_general_v20", "high_aes_general_v14", "high_aes", "t2i_xl_sft"
  CVSync2AsyncSubmitTaskBody?: Record<string, unknown>; // https://www.volcengine.com/docs/6791/1399614
  CVSync2AsyncGetResultBody?: Record<string, unknown>; // https://www.volcengine.com/docs/6791/1399614
}

const DEFAULT_DOUBAO_T2I_VOLCENGINE_ADAPTER_OPTIONS: Required<DoubaoT2IVolcEngineAdapterOptions> =
  {
    region: 'cn-north-1',
    accessKeyId: '',
    secretKey: '',
    reqKey: 'high_aes_general_v21_L',
    // https://www.volcengine.com/docs/6791/1399614
    CVSync2AsyncSubmitTaskBody: {
      // seed: 1,
      // scale: 3.5,
      // ddim_steps: 25,
      width: 512,
      height: 512,
      use_pre_llm: true,
      use_sr: true,
    },
    // https://www.volcengine.com/docs/6791/1399614
    CVSync2AsyncGetResultBody: {
      return_url: true,
      logo_info: {
        add_logo: false,
        // position: 0,
        // language: 0,
        // opacity: 0.3,
        // logo_text_content: '',
      },
    },
  };

const DEFAULT_DOUBAO_T2I_VOLCENGINE_ADAPTER_CONST = {
  serviceName: 'cv',
  generate: {
    // https://www.volcengine.com/docs/6791/1399614
    actionName: 'CVSync2AsyncSubmitTask',
    version: '2022-08-31',
  },
  pollingTask: {
    // https://www.volcengine.com/docs/6791/1399614
    actionName: 'CVSync2AsyncGetResult',
    version: '2022-08-31',
  },
};

@Injectable()
export class DoubaoT2iVolcengineAdapter extends AiModelAdapter<DoubaoT2IVolcEngineAdapterOptions> {
  static adapterName = 'doubao-t2i@volcengine';
  waitForTimeout = '5min';
  pollingTaskWaitForTimeout = '3min';
  private client: Service;

  getClient(): typeof this.client {
    if (this.client) return this.client;
    this.client = new Service({
      serviceName: DEFAULT_DOUBAO_T2I_VOLCENGINE_ADAPTER_CONST.serviceName,
      region:
        this.config.adapterOptions?.region ||
        DEFAULT_DOUBAO_T2I_VOLCENGINE_ADAPTER_OPTIONS.region,
    });
    this.client.setAccessKeyId(this.config.adapterOptions?.accessKeyId || '');
    this.client.setSecretKey(this.config.adapterOptions?.secretKey || '');
    return this.client;
  }

  async processGenerating(
    taskId: GeneratingTaskEntity['id'],
  ): Promise<AiModelAdapterProcessResult> {
    const record = await this.generatingTaskService.getGeneratingTask(taskId);
    const prompt =
      await this.generatingTaskService.prepareGeneratingTaskStringPrompt(
        record.input.prompt,
      );
    // https://www.volcengine.com/docs/6791/1399614
    const json = await this.getClient().createAPI(
      DEFAULT_DOUBAO_T2I_VOLCENGINE_ADAPTER_CONST.generate.actionName,
      {
        Version: DEFAULT_DOUBAO_T2I_VOLCENGINE_ADAPTER_CONST.generate.version,
        contentType: 'json',
        method: 'POST',
      },
    )({
      ...(this.config.adapterOptions?.CVSync2AsyncSubmitTaskBody ||
        DEFAULT_DOUBAO_T2I_VOLCENGINE_ADAPTER_OPTIONS.CVSync2AsyncSubmitTaskBody),
      req_key:
        this.config.adapterOptions?.reqKey ||
        DEFAULT_DOUBAO_T2I_VOLCENGINE_ADAPTER_OPTIONS.reqKey,
      prompt,
    });

    const pollingTaskId = get(json, ['data', 'task_id']) as string;
    const errorMessage =
      get(json, ['ResponseMetadata', 'Error', 'Message'], '') ||
      (get(json, ['message'], '') as string);
    if (!pollingTaskId) {
      throw new Error(errorMessage || `Task create failed`);
    }
    await AiModelAdapterHandlerEvent.trigger(
      this.inngestService.inngest,
      AiModelAdapterHandlerEvent.EVENT_NAMES
        .AI_MODEL_ADAPTER_HANDLER_POLLING_CREATED,
      {
        modelId: this.config.id,
        generatingTaskId: taskId,
        pollingTaskId,
      },
    );

    return {
      pollingTaskId,
    };
  }

  async pollingGeneratingTask(
    taskId: GeneratingTaskEntity['id'],
    pollingTaskId: NonNullable<AiModelAdapterProcessResult['pollingTaskId']>,
  ): Promise<AiModelAdapterPollingResult> {
    // https://www.volcengine.com/docs/6791/1399614
    const json = await this.getClient().createAPI(
      DEFAULT_DOUBAO_T2I_VOLCENGINE_ADAPTER_CONST.pollingTask.actionName,
      {
        Version:
          DEFAULT_DOUBAO_T2I_VOLCENGINE_ADAPTER_CONST.pollingTask.version,
        contentType: 'json',
        method: 'POST',
      },
    )({
      ...(this.config.adapterOptions?.CVSync2AsyncGetResultBody ||
        DEFAULT_DOUBAO_T2I_VOLCENGINE_ADAPTER_OPTIONS.CVSync2AsyncGetResultBody),
      req_key:
        this.config.adapterOptions?.reqKey ||
        DEFAULT_DOUBAO_T2I_VOLCENGINE_ADAPTER_OPTIONS.reqKey,
      task_id: pollingTaskId,
    });

    const status = get(json, ['data', 'status']) as string;
    // const imageUrl = get(json, ['data', 'image_urls', '0']) as string;
    const imageBase64 = get(json, [
      'data',
      'binary_data_base64',
      '0',
    ]) as string;
    const errorMessage =
      get(json, ['ResponseMetadata', 'Error', 'Message'], '') ||
      (get(json, ['message'], '') as string);

    if (status === 'done') {
      if (!imageBase64) {
        return {
          done: true,
          failed: false,
          status,
        };
      }
      const buffer = Buffer.from(imageBase64, 'base64');
      const file = await this.fileService.addFile(
        STORAGE_BUCKET_NAME.GENERATED,
        {
          buffer: Buffer.from(buffer),
          size: buffer.byteLength,
          originalname: 'generated.jpg',
          mimetype: 'image/jpeg',
        },
      );

      return {
        done: true,
        failed: false,
        status,
        fileId: file.id,
      };
    } else if (['in_queue', 'generating'].includes(status || '')) {
      AiModelAdapterHandlerEvent.trigger(
        this.inngestService.inngest,
        AiModelAdapterHandlerEvent.EVENT_NAMES
          .AI_MODEL_ADAPTER_HANDLER_POLLING_CREATED,
        {
          modelId: this.config.id,
          generatingTaskId: taskId,
          pollingTaskId,
        },
      );
      return {
        done: false,
        failed: false,
        status,
        errorMessage,
      };
    } else {
      return {
        done: false,
        failed: ['not_found', 'expired'].includes(status || '') || true,
        status,
        errorMessage,
      };
    }
  }
}
