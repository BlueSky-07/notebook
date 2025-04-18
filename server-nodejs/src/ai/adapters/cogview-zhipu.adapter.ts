import { Injectable } from '@nestjs/common';
import { AiModelAdapter, AiModelAdapterProcessResult } from '../adapter.type';
import { GeneratingTaskEntity } from '../../generating-task/generating-task.entity';
import { get } from 'lodash';
import { STORAGE_BUCKET_NAME } from '../../storage/storage.const';

@Injectable()
export class CogviewZhipuAdapter extends AiModelAdapter {
  static adapterName = 'cogview@zhipu';
  waitForTimeout = '3min';

  async processGenerating(
    taskId: GeneratingTaskEntity['id'],
  ): Promise<AiModelAdapterProcessResult> {
    const record = await this.generatingTaskService.getGeneratingTask(taskId);
    const prompt =
      await this.generatingTaskService.prepareGeneratingTaskStringPrompt(
        record.input.prompt,
      );
    // https://www.bigmodel.cn/dev/api/image-model/cogview
    const json = await this.fetcher(
      this.config.baseUrl ||
        'https://open.bigmodel.cn/api/paas/v4/images/generations',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.modelName,
          prompt: prompt,
          // quality: 'standard',
          size: '1024x1024',
          n: 1,
        }),
      },
    ).then((resp) => resp.json());
    const imageUrl = get(json, ['data', '0', 'url'], '') as string;
    if (!imageUrl) {
      throw new Error(`Empty Generated`);
    }

    const buffer = await this.fetcher(imageUrl).then((resp) =>
      resp.arrayBuffer(),
    );
    const file = await this.fileService.addFile(STORAGE_BUCKET_NAME.GENERATED, {
      buffer: Buffer.from(buffer),
      size: buffer.byteLength,
      originalname: 'generated.jpg',
      mimetype: 'image/jpeg',
    });

    return { fileId: file.id };
  }
}
