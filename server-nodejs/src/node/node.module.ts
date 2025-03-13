import { Module } from '@nestjs/common';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { NodeEntity } from './node.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([NodeEntity])
  ],
  controllers: [NodeController],
  providers: [NodeService],
  exports: [NodeService]
})
export class NodeModule {}
