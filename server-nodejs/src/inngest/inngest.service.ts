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
    @Inject(forwardRef(() => GeneratingTaskService))
    private readonly generatingTaskService: GeneratingTaskService,
    private readonly aiService: AiService,
    private readonly configService: ConfigService,
    private readonly fileReferenceService: FileReferenceService,
  ) {
    this.inngest = new Inngest({
      id: 'notebook-inngest',
      schemas: new EventSchemas().fromRecord<InngestEvents>(),
      baseUrl: this.configService.get<string>('inngest.baseUrl'),
      isDev: this.configService.get<boolean>('inngest.dev'),
    });
    this.functions = createInngestFunctions(this.inngest, {
      logger: this.logger,
      flowService,
      nodeService,
      generatingTaskService,
      aiService,
      fileReferenceService,
    });
  }
}
