import { Injectable } from '@nestjs/common';
import {
  AiModelAdapter,
  AiModelAdapterPollingResult,
  AiModelAdapterProcessResult,
} from '../adapter.type';
import { GeneratingTaskEntity } from '../../generating-task/generating-task.entity';
import { STORAGE_BUCKET_NAME } from '../../storage/storage.const';
import AiModelAdapterHandlerEvent from '../adapter.event';
import { hunyuan } from 'tencentcloud-sdk-nodejs-hunyuan';

interface HunyuanImageTencentCloudAdapterOptions {
  secretId?: string;
  secretKey?: string;
  token?: string;
  region?: string;
}

const DEFAULT_HUNYAN_IMAGE_TENCENTCLOUD_ADAPTER_OPTIONS: Required<HunyuanImageTencentCloudAdapterOptions> =
  {
    secretId: '',
    secretKey: '',
    token: '',
    region: 'ap-guangzhou',
  };

@Injectable()
export class HunyuanImageTencentCloudAdapter extends AiModelAdapter<HunyuanImageTencentCloudAdapterOptions> {
  static adapterName = 'hunyuan-image@tencentcloud';
  waitForTimeout = '5min';
  pollingTaskWaitForTimeout = '3min';
  private readonly client = new hunyuan.v20230901.Client({
    credential: {
      secretId: this.config.adapterOptions?.secretId,
      secretKey: this.config.adapterOptions?.secretKey,
      token: this.config.adapterOptions?.token,
    },
    region:
      this.config.adapterOptions?.region ||
      DEFAULT_HUNYAN_IMAGE_TENCENTCLOUD_ADAPTER_OPTIONS.region,
  });

  async processGenerating(
    taskId: GeneratingTaskEntity['id'],
  ): Promise<AiModelAdapterProcessResult> {
    const record = await this.generatingTaskService.getGeneratingTask(taskId);
    const prompt =
      await this.generatingTaskService.prepareGeneratingTaskStringPrompt(
        record.input.prompt,
      );
    // https://cloud.tencent.com/document/product/1729/105969
    const json = await this.client.SubmitHunyuanImageJob({
      Prompt: prompt,
      // NegativePrompt: '',
      // Style: '' // https://cloud.tencent.com/document/product/1729/105846,
      Resolution: '1024:1024',
      Num: 1,
      // Clarity: 'x2',
      // ContentImage: {
      //   ImageUrl: ''
      // },
      // Revise: 1,
      // Seed: 1,
      LogoAdd: 0,
      // LogoParam: {
      //   LogoUrl: '',
      //   LogoRect: { X: 10, Y: 10, Width: 20, Height: 20 },
      // },
    });
    const pollingTaskId = json.JobId;
    if (!pollingTaskId) {
      throw new Error(`Task create failed`);
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
    // https://cloud.tencent.com/document/product/1729/105970
    const json = await this.client.QueryHunyuanImageJob({
      JobId: pollingTaskId,
    });

    const status = json.JobStatusCode;
    const imageUrl = json.ResultImage?.[0];
    const errorMessage = json.JobErrorMsg;

    if (status === '5') {
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
    } else if (['1', '2'].includes(status || '')) {
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
        failed: status === '4' || true,
        status,
        errorMessage,
      };
    }
  }
}
