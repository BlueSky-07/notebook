import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';

@Module({
  imports: [ConfigModule],
  exports: [AiService],
  controllers: [AiController],
  providers: [Logger, AiService],
})
export class AiModule {}
