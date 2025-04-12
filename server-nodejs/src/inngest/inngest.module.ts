import { FlowModule } from '../flow/flow.module';
import { forwardRef, Module } from '@nestjs/common';
import { InngestService } from './inngest.service';
import { NodeModule } from '../node/node.module';
import { GeneratingTaskModule } from '../generating-task/generating-task.module';
import { AiModule } from '../ai/ai.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    forwardRef(() => FlowModule),
    forwardRef(() => NodeModule),
    forwardRef(() => GeneratingTaskModule),
    AiModule,
    ConfigModule,
    FileModule,
  ],
  providers: [InngestService],
  exports: [InngestService],
})
export class InngestModule {}
