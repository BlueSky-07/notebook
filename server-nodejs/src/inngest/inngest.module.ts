import { FlowModule } from '../flow/flow.module';
import { Logger, Module } from '@nestjs/common';
import { InngestService } from './inngest.service';

@Module({
  imports: [
    FlowModule
  ],
  providers: [
    InngestService,
    Logger
  ],
  exports: [
    InngestService,
  ]
})
export class InngestModule {}
