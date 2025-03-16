import { forwardRef, Module } from '@nestjs/common';
import { EdgeController } from './edge.controller';
import { EdgeService } from './edge.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EdgeEntity } from './edge.entity';
import { InngestModule } from '../inngest/inngest.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EdgeEntity]),
    forwardRef(() => InngestModule),
  ],
  controllers: [EdgeController],
  providers: [EdgeService],
  exports: [EdgeService],
})
export class EdgeModule {}
