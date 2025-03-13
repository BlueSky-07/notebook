import { Module } from '@nestjs/common';
import { EdgeController } from './edge.controller';
import { EdgeService } from './edge.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { EdgeEntity } from './edge.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([EdgeEntity])
  ],
  controllers: [EdgeController],
  providers: [EdgeService],
  exports: [EdgeService]
})
export class EdgeModule {}
