import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectS3, S3 } from 'nestjs-s3';
import { STORAGE_BUCKET_NAME, type StorageBucketName } from './storage.const';
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

  async putFileObject(
    bucket: StorageBucketName,
    file: Pick<Express.Multer.File, 'buffer'>,
    options?: Omit<PutObjectCommandInput, 'Bucket' | 'Key'>,
  ): Promise<[string, PutObjectCommandOutput]> {
    const buffer = file.buffer;
    if (!buffer) throw new BadRequestException('buffer required');

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
      Body: buffer,
    });

    return [uuid, res];
  }

  getFileObject(
    bucket: StorageBucketName,
    key: string,
  ): Promise<GetObjectCommandOutput> {
    return this.s3.getObject({
      Bucket: bucket,
      Key: key,
    });
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
}
