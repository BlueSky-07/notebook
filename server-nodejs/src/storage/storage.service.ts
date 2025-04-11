import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectS3, S3 } from 'nestjs-s3';
import { STORAGE_BUCKET_NAME } from './storage.const';
import { InjectRepository } from '@nestjs/typeorm';
import { type StorageBucketName, FileEntity } from './storage.entity';
import { Repository } from 'typeorm';
import * as path from 'path';
import mime from 'mime-types';
import { FileAddInput } from './storage.dto';
import { v7 as uuidv7 } from 'uuid';
import {
  type DeleteObjectCommandOutput,
  type GetObjectCommandOutput,
  type PutObjectCommandInput,
  type PutObjectCommandOutput,
} from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly buckets = new Map<StorageBucketName, string>();

  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly configService: ConfigService,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {
    const buckets =
      this.configService.get<Record<string, string>>('storage.buckets') || {};
    for (const [name, bucket] of Object.entries(STORAGE_BUCKET_NAME)) {
      this.buckets.set(name as StorageBucketName, buckets[bucket] || bucket);
    }
    this.initBuckets();
  }

  private async initBuckets() {
    for (const [name, bucket] of this.buckets.entries()) {
      try {
        await this.s3.headBucket({
          Bucket: bucket,
        });
        this.logger.verbose(`${name}:${bucket} existed`);
        continue;
      } catch (e) {}

      await this.s3.createBucket({
        Bucket: bucket,
      });
      this.logger.verbose(`${name}:${bucket} created`);
    }
  }

  async putFile(
    bucket: StorageBucketName,
    file: Express.Multer.File,
    fileAddInput: FileAddInput,
  ): Promise<FileEntity> {
    const metadata = await this.getFileMetadata(file, fileAddInput);
    const [key] = await this.putFileObject(bucket, file, {
      ContentLength: metadata.size,
      ContentType: metadata.mime,
    });

    const res = await this.fileRepository.insert({
      name: metadata.filename,
      description: fileAddInput.description,
      metadata,
      bucket,
      path: key,
    });
    const fileId = res.generatedMaps[0].id as number;
    return this.getFileById(fileId);
  }

  async putFileObject(
    bucket: StorageBucketName,
    file: Express.Multer.File,
    options?: Omit<PutObjectCommandInput, 'Bucket' | 'Key'>,
  ): Promise<[string, PutObjectCommandOutput]> {
    let uuid: string = uuidv7();
    while (true) {
      try {
        const head = await this.s3.headObject({
          Bucket: bucket,
          Key: uuid,
        });
        uuid = uuidv7();
      } catch (e) {
        break;
      }
    }

    const res = await this.s3.putObject({
      ...options,
      Bucket: bucket,
      Key: `${uuid}`,
      Body: file.buffer,
    });

    return [uuid, res];
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

  async getFileObjectById(
    id: FileEntity['id'],
  ): Promise<GetObjectCommandOutput> {
    const record = await this.getFileById(id);
    const fileObject = await this.s3.getObject({
      Bucket: record.bucket,
      Key: record.path,
    });
    return fileObject;
  }

  async getFileObjectByBucketKey(
    bucket: StorageBucketName,
    key: string,
  ): Promise<GetObjectCommandOutput> {
    const fileObject = await this.s3.getObject({
      Bucket: bucket,
      Key: key,
    });
    return fileObject;
  }

  async deleteFileById(id: FileEntity['id']) {
    const record = await this.getFileById(id);
    await this.deleteFileObject(record.bucket, record.path);
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

  async deleteFileByPath(filepath: FileEntity['path']) {
    const record = await this.getFileByPath(filepath);
    return this.deleteFileById(record.id);
  }

  deleteFileObject(
    bucket: StorageBucketName,
    key: string,
  ): Promise<DeleteObjectCommandOutput> {
    return this.s3.deleteObject({
      Bucket: bucket,
      Key: key,
    });
  }

  async getFileMetadata(
    file: File | Express.Multer.File,
    fileAddInput?: FileAddInput,
  ): Promise<FileEntity['metadata'] & { filename: string }> {
    const filename =
      fileAddInput.name ||
      (file as Express.Multer.File).originalname ||
      (file as File).name;
    const extension = path.extname(filename);
    const mimetype: string =
      (file as Express.Multer.File).mimetype ||
      (mime.lookup(extension) as string);
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
