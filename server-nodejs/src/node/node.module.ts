import { Module } from '@nestjs/common';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { NodeEntity } from './node.entity'
import { InngestModule } from '../inngest/inngest.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([NodeEntity]),
    InngestModule,
  ],
  controllers: [NodeController],
  providers: [NodeService],
  exports: [NodeService]
})
export class NodeModule {}
