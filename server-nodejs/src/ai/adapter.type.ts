import { AiModelConfig } from './ai.dto';
import { FileService } from '../file/file.service';
import { InngestService } from '../inngest/inngest.service';
import { GeneratingTaskEntity } from '../generating-task/generating-task.entity';
import { GeneratingTaskService } from '../generating-task/generating-task.service';
import { FileEntity } from '../file/file.entity';
import { fetch } from 'undici';
import { Logger } from '@nestjs/common';

export type AiModelAdapterProcessResult = {
  fileId?: FileEntity['id'];
  pollingTaskId?: string;
};

export type AiModelAdapterPollingResult = {
  done: boolean;
  failed: boolean;
  status?: string;
  fileId?: FileEntity['id'];
  errorMessage?: string;
};

export class AiModelAdapter<AdapterOptions = AiModelConfig['adapterOptions']> {
  protected readonly logger: Logger;
  static adapterName: string;

  waitForTimeout: number | string | Date; // Total timeout
  pollingTaskWaitForTimeout?: number | string | Date; // Timeout for polling task

  constructor(
    protected readonly config: AiModelConfig<AdapterOptions>,
    protected readonly fileService: FileService,
    protected readonly inngestService: InngestService,
    protected readonly generatingTaskService: GeneratingTaskService,
    protected readonly fetcher: typeof fetch,
  ) {
    this.logger = new Logger(this.constructor.name);
    this.logger.verbose(`${this.config.id} adapter initialized`);
  }

  processGenerating(
    taskId: GeneratingTaskEntity['id'],
  ): Promise<AiModelAdapterProcessResult> {
    throw new Error('Method not implemented.');
  }

  pollingGeneratingTask(
    taskId: GeneratingTaskEntity['id'],
    pollingTaskId: NonNullable<AiModelAdapterProcessResult['pollingTaskId']>,
  ): Promise<AiModelAdapterPollingResult> {
    throw new Error('Method not implemented.');
  }
}

export const AI_MODEL_ADAPTERS_INJECTION_NAME = 'AI_MODEL_ADAPTERS';

export enum AiModelAdapterStatus {
  Done = 'Done',
  Failed = 'Failed',
}
