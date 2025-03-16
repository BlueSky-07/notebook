import { FlowModule } from '../flow/flow.module';
import { forwardRef, Logger, Module } from '@nestjs/common';
import { InngestService } from './inngest.service';
import { NodeModule } from '../node/node.module';
import { GeneratingTaskModule } from '../generating-task/generating-task.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    FlowModule,
    forwardRef(() => NodeModule),
    forwardRef(() => GeneratingTaskModule),
    AiModule,
  ],
  providers: [InngestService, Logger],
  exports: [InngestService],
})
export class InngestModule {}
