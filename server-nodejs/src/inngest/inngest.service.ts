import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { EventSchemas, Inngest } from 'inngest';
import InngestEvents from './type';
import { FlowService } from '../flow/flow.service';
import { createInngestFunctions } from './functions';
import { NodeService } from '../node/node.service'
import { GeneratingTaskService } from '../generating-task/generating-task.service'

@Injectable()
export class InngestService {
  inngest: Inngest;
  functions: ReturnType<typeof createInngestFunctions>;

  constructor(
    private logger: Logger,
    private flowService: FlowService,
    @Inject(forwardRef(() => NodeService))
    private nodeService: NodeService,
    @Inject(forwardRef(() => GeneratingTaskService))
    private generatingTaskService: GeneratingTaskService,
  ) {
    this.inngest = new Inngest({
      id: 'notebook-inngest',
      schemas: new EventSchemas().fromRecord<InngestEvents>(),
    });
    this.functions = createInngestFunctions(this.inngest, {
      logger,
      flowService,
      nodeService,
      generatingTaskService,
    });
  }
}
