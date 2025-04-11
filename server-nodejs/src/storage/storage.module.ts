import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ConfigModule } from '@nestjs/config';
import { StorageController } from './storage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './storage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), ConfigModule],
  exports: [StorageService],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
