import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { EventSchemas, Inngest } from 'inngest';
import InngestEvents from './type';
import { FlowService } from '../flow/flow.service';
import { createInngestFunctions } from './functions';
import { NodeService } from '../node/node.service';
import { GeneratingTaskService } from '../generating-task/generating-task.service';
import { AiService } from '../ai/ai.service';
import { ConfigService } from '@nestjs/config';
import { FileReferenceService } from '../file/file-reference.service';
import { EdgeService } from '../edge/edge.service';
import { FileService } from '../file/file.service';
import type { ClientOptions } from 'inngest/types';

@Injectable()
export class InngestService {
  private readonly logger = new Logger(InngestService.name);
  inngest: Inngest;
  functions: ReturnType<typeof createInngestFunctions>;

  constructor(
    @Inject(forwardRef(() => FlowService))
    private readonly flowService: FlowService,
    @Inject(forwardRef(() => NodeService))
    private readonly nodeService: NodeService,
    @Inject(forwardRef(() => EdgeService))
    private readonly edgeService: EdgeService,
    @Inject(forwardRef(() => GeneratingTaskService))
    private readonly generatingTaskService: GeneratingTaskService,
    private readonly aiService: AiService,
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
    private readonly fileReferenceService: FileReferenceService,
  ) {
    const clientOptions =
      this.configService.getOrThrow<ClientOptions>('inngest.client');
    this.inngest = new Inngest(clientOptions);
    this.functions = createInngestFunctions(this.inngest, {
      logger: this.logger,
      flowService,
      nodeService,
      edgeService,
      generatingTaskService,
      aiService,
      fileService,
      fileReferenceService,
    });
  }
}
