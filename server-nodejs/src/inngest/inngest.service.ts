import { Injectable, Logger } from '@nestjs/common';
import { EventSchemas, Inngest } from 'inngest';
import InngestEvents from './type';
import { FlowService } from '../flow/flow.service';
import { createInngestFunctions } from './functions';

@Injectable()
export class InngestService {
  inngest: Inngest;
  functions: ReturnType<typeof createInngestFunctions>;

  constructor(
    private logger: Logger,
    private flowService: FlowService,
  ) {
    this.inngest = new Inngest({
      id: 'notebook-inngest',
      schemas: new EventSchemas().fromRecord<InngestEvents>(),
    });
    this.functions = createInngestFunctions(this.inngest, {
      logger,
      flowService,
    });
  }
}
