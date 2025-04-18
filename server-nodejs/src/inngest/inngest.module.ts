import { FlowModule } from '../flow/flow.module';
import { forwardRef, Module } from '@nestjs/common';
import { InngestService } from './inngest.service';
import { NodeModule } from '../node/node.module';
import { GeneratingTaskModule } from '../generating-task/generating-task.module';
import { AiModule } from '../ai/ai.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from '../file/file.module';
import { EdgeModule } from '../edge/edge.module';

@Module({
  imports: [
    forwardRef(() => FlowModule),
    forwardRef(() => NodeModule),
    forwardRef(() => EdgeModule),
    forwardRef(() => GeneratingTaskModule),
    forwardRef(() => AiModule),
    ConfigModule,
    FileModule,
  ],
  providers: [InngestService],
  exports: [InngestService],
})
export class InngestModule {}
