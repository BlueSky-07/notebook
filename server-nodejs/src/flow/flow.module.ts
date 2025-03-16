import { Module } from '@nestjs/common';
import { FlowController } from './flow.controller';
import { FlowService } from './flow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowEntity } from './flow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FlowEntity])],
  controllers: [FlowController],
  providers: [FlowService],
  exports: [FlowService],
})
export class FlowModule {}
