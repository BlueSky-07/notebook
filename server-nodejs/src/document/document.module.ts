import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { FlowModule } from '../flow/flow.module';
import { NodeModule } from '../node/node.module';
import { EdgeModule } from '../edge/edge.module';

@Module({
  imports: [FlowModule, NodeModule, EdgeModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
