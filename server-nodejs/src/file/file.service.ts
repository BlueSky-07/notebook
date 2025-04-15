import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { FileEntity } from './file.entity';
import { FileAddInput } from './file.dto';
import * as path from 'path';
import mime from 'mime-types';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { type StorageBucketName } from '../storage/storage.const';
import type { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { FileReferenceService } from './file-reference.service';
import { pick } from 'lodash';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly storageService: StorageService,
    private readonly fileReferenceService: FileReferenceService,
  ) {}

  async addFile(
    bucket: StorageBucketName,
    file: Pick<
      Express.Multer.File,
      'buffer' | 'size' | 'originalname' | 'mimetype'
    >,
    fileAddInput?: Omit<FileAddInput, 'file'>,
  ): Promise<FileEntity> {
    const metadata = await this.getFileMetadata(file, fileAddInput);
    const [key] = await this.storageService.putFileObject(bucket, file, {
      ContentLength: metadata.size,
      ContentType: metadata.mime,
    });

    try {
      const res = await this.fileRepository.insert({
        name: metadata.filename,
        description: fileAddInput?.description,
        metadata,
        bucket,
        path: key,
      });
      const fileId = res.generatedMaps[0].id as number;
      return this.getFileById(fileId);
    } catch (e) {
      await this.storageService.deleteFileObject(bucket, key);
      throw e;
    }
  }

  async getFileById(id: FileEntity['id']): Promise<FileEntity> {
    if (id == null) throw new BadRequestException(`File id is missing`);
    const record = await this.fileRepository.findOneBy({
      id,
    });
    if (!record) {
      throw new NotFoundException(`File does not exist: ${id}`);
    }
    return record;
  }

  async getFileByPath(filepath: FileEntity['path']): Promise<FileEntity> {
    if (!filepath) throw new BadRequestException(`File path is missing`);
    const record = await this.fileRepository.findOneBy({
      path: filepath,
    });
    if (!record) {
      throw new NotFoundException(`File does not exist: ${filepath}`);
    }
    return record;
  }

  async getFileObject(
    file: Pick<FileEntity, 'bucket' | 'path'>,
  ): Promise<GetObjectCommandOutput> {
    return this.storageService.getFileObject(file.bucket, file.path);
  }

  async deleteFileById(id: FileEntity['id']): Promise<boolean> {
    const record = await this.getFileById(id);
    await this.storageService.deleteFileObject(record.bucket, record.path);
    const res = await this.fileRepository.delete({
      id,
    });
    if (res.affected) {
      return true;
    } else {
      throw new InternalServerErrorException(
        `File does not delete successfully`,
      );
    }
  }

  async deleteFileByPath(filepath: FileEntity['path']): Promise<boolean> {
    const record = await this.getFileByPath(filepath);
    return this.deleteFileById(record.id);
  }

  async batchDeleteFilesByNoReferences(
    dryRun = true,
    batchSize: number = 100,
  ): Promise<FileEntity['id'][]> {
    const total = await this.fileRepository.count();
    const deletedFiles: Array<Pick<FileEntity, 'id' | 'bucket' | 'path'>> = [];
    let index = 0;
    for (let i = 0; i < total; i += batchSize) {
      const records = await this.fileRepository.find({
        skip: i,
        take: batchSize,
      });
      const references =
        await this.fileReferenceService.getFileReferencesByFileIds(
          records.map((r) => r.id),
        );
      const noReferencesFiles: FileEntity[] = records
        .map((record) =>
          !references.some((reference) => reference.fileId === record.id)
            ? pick(record, ['id', 'bucket', 'path'])
            : null,
        )
        .filter(Boolean) as FileEntity[];
      deletedFiles.push(...noReferencesFiles);

      if (deletedFiles.length - index >= batchSize || i + batchSize >= total) {
        if (!dryRun) {
          const batchFiles = deletedFiles.slice(index, index + batchSize);
          const results = await Promise.allSettled(
            batchFiles.map((file) => {
              return this.storageService.deleteFileObject(
                file.bucket,
                file.path,
              );
            }),
          );
          await this.fileRepository.delete({
            id: In(
              results
                .map((r, i) =>
                  r.status === 'fulfilled' ? batchFiles[i].id : false,
                )
                .filter((id) => id !== false),
            ),
          });
        }
        index += batchSize;
      }
    }
    return deletedFiles.map((deletedFile) => deletedFile.id);
  }

  getFileMetadata(
    file: Pick<
      Express.Multer.File,
      'buffer' | 'size' | 'originalname' | 'mimetype'
    >,
    fileAddInput?: Omit<FileAddInput, 'file'>,
  ): FileEntity['metadata'] & { filename: string } {
    const filename = fileAddInput?.name || file.originalname || 'unamed';
    const extension = path.extname(filename);
    const mimetype: string =
      file.mimetype || (mime.lookup(extension) as string);
    const metadata: FileEntity['metadata'] & { filename: string } = {
      filename,
      extension,
      size: file.size,
      mime: mimetype,
      // width: 0,  // todo read image width
      // height: 0, // todo read image height
    };
    return metadata;
  }
}
