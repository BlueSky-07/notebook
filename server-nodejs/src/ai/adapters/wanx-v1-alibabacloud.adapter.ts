import { Injectable } from '@nestjs/common';
import {
  AiModelAdapter,
  AiModelAdapterPollingResult,
  AiModelAdapterProcessResult,
} from '../adapter.type';
import { GeneratingTaskEntity } from '../../generating-task/generating-task.entity';
import { get } from 'lodash';
import { STORAGE_BUCKET_NAME } from '../../storage/storage.const';
import AiModelAdapterHandlerEvent from '../adapter.event';

interface WanxV1AlibabaCloudAdapterOptions {
  generateUrl?: string;
  pollingTaskUrl?: string;
  apiKey: string;
  modelName: string;
}

const DEFAULT_WANX_V1_ALIBABACLOUD_ADAPTER_OPTIONS: Required<WanxV1AlibabaCloudAdapterOptions> =
  {
    generateUrl:
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
    pollingTaskUrl: 'https://dashscope.aliyuncs.com/api/v1/tasks/',
    apiKey: '',
    modelName: 'wanx-v1',
  };

@Injectable()
export class WanxV1AlibabaCloudAdapter extends AiModelAdapter<WanxV1AlibabaCloudAdapterOptions> {
  static adapterName = 'wanx-v1@alibabacloud';
  waitForTimeout = '5min';
  pollingTaskWaitForTimeout = '3min';

  async processGenerating(
    taskId: GeneratingTaskEntity['id'],
  ): Promise<AiModelAdapterProcessResult> {
    const record = await this.generatingTaskService.getGeneratingTask(taskId);
    const prompt =
      await this.generatingTaskService.prepareGeneratingTaskStringPrompt(
        record.input.prompt,
      );
    // https://help.aliyun.com/zh/model-studio/text-to-image-api-reference
    const json = await this.fetcher(
      this.config.adapterOptions?.generateUrl ||
        DEFAULT_WANX_V1_ALIBABACLOUD_ADAPTER_OPTIONS.generateUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.adapterOptions?.apiKey}`,
          'X-DashScope-Async': `enable`, // must set as enable
        },
        body: JSON.stringify({
          model:
            this.config.adapterOptions?.modelName ||
            DEFAULT_WANX_V1_ALIBABACLOUD_ADAPTER_OPTIONS.modelName,
          input: {
            prompt: prompt,
            // negative_prompt: '',
            // ref_img: ''
          },
          parameters: {
            style: '<auto>',
            size: '1024*1024',
            n: 1,
            // seed: 123456789,
            // ref_strength: 0.5,
            // ref_mode: 'repaint'
          },
        }),
      },
    ).then((resp) => resp.json());
    const pollingTaskId = get(json, ['output', 'task_id'], '') as string;
    const errorMessage = get(json, ['message'], '') as string;
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
    // https://help.aliyun.com/zh/model-studio/text-to-image-api-reference
    const json = await this.fetcher(
      `${this.config.adapterOptions?.pollingTaskUrl || DEFAULT_WANX_V1_ALIBABACLOUD_ADAPTER_OPTIONS.pollingTaskUrl}${pollingTaskId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.adapterOptions?.apiKey}`,
        },
      },
    ).then((resp) => resp.json());

    const status = get(json, ['output', 'task_status'], '') as string;
    const imageUrl = get(json, ['output', 'results', '0', 'url'], '') as string;
    const errorMessage = get(json, ['output', 'message'], '') as string;

    if (status === 'SUCCEEDED') {
      if (!imageUrl) {
        return {
          done: true,
          failed: false,
          status,
        };
      }
      const buffer = await this.fetcher(imageUrl).then((resp) =>
        resp.arrayBuffer(),
      );
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
    } else if (['PENDING', 'RUNNING'].includes(status)) {
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
        failed: ['FAILED', 'CANCELED', 'UNKNOWN'].includes(status) || true,
        status,
        errorMessage,
      };
    }
  }
}
