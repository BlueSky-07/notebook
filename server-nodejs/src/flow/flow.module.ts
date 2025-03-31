import { Module } from '@nestjs/common';
import { FlowController } from './flow.controller';
import { FlowService } from './flow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowEntity } from './flow.entity';
import { NodeModule } from '../node/node.module';
import { EdgeModule } from '../edge/edge.module';

@Module({
  imports: [TypeOrmModule.forFeature([FlowEntity]), NodeModule, EdgeModule],
  controllers: [FlowController],
  providers: [FlowService],
  exports: [FlowService],
})
export class FlowModule {}
