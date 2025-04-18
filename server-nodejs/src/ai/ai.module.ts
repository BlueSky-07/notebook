import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { CogviewZhipuAdapter } from './adapters/cogview-zhipu.adapter';
import { AI_MODEL_ADAPTERS_INJECTION_NAME } from './adapter.type';
import { InngestModule } from '../inngest/inngest.module';
import { FileModule } from '../file/file.module';
import { GeneratingTaskModule } from '../generating-task/generating-task.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => InngestModule),
    FileModule,
    GeneratingTaskModule,
  ],
  exports: [AiService],
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: AI_MODEL_ADAPTERS_INJECTION_NAME,
      useValue: [CogviewZhipuAdapter],
    },
  ],
})
export class AiModule {}
