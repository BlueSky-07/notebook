import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { ConfigModule } from '@nestjs/config';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { StorageModule } from '../storage/storage.module';
import { FileReferenceService } from './file-reference.service';
import { FileReferenceEntity } from './file-reference.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity, FileReferenceEntity]),
    ConfigModule,
    StorageModule,
  ],
  exports: [FileService, FileReferenceService],
  controllers: [FileController],
  providers: [FileService, FileReferenceService],
})
export class FileModule {}
