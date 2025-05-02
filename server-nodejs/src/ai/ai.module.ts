import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AI_MODEL_ADAPTERS_INJECTION_NAME } from './adapter.type';
import { InngestModule } from '../inngest/inngest.module';
import { FileModule } from '../file/file.module';
import { GeneratingTaskModule } from '../generating-task/generating-task.module';

import { CogviewZhipuAdapter } from './adapters/cogview-zhipu.adapter';
import { WanxV1AlibabaCloudAdapter } from './adapters/wanx-v1-alibabacloud.adapter';
import { WanxV2AlibabaCloudAdapter } from './adapters/wanx-v2-alibabacloud.adapter';
import { HunyuanImageTencentCloudAdapter } from './adapters/hunyuan-image-tencentcloud.adapter';
import { DoubaoT2iVolcengineAdapter } from './adapters/doubao-t2i-volcengine.adapter';

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
      useValue: [
        CogviewZhipuAdapter,
        WanxV1AlibabaCloudAdapter,
        WanxV2AlibabaCloudAdapter,
        HunyuanImageTencentCloudAdapter,
        DoubaoT2iVolcengineAdapter,
      ],
    },
  ],
})
export class AiModule {}
