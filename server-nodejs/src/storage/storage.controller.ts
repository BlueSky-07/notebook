import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import {
  FileAddInput,
  FileDeleteResponse,
  FileQueryInput,
} from './storage.dto';
import { FileEntity } from './storage.entity';
import { STORAGE_BUCKET_NAME } from './storage.const';
import { Readable } from 'stream';
import { type ReadableStream } from 'stream/web';
import { type GetObjectCommandOutput } from '@aws-sdk/client-s3';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('info')
  getFileInfo(@Query() fileQueryInput: FileQueryInput): Promise<FileEntity> {
    if (fileQueryInput.id != null)
      return this.storageService.getFileById(fileQueryInput.id);
    if (fileQueryInput.path != null)
      return this.storageService.getFileByPath(fileQueryInput.path);
    throw new BadRequestException('id or path is required');
  }

  @Get('object')
  async getFileObject(
    @Query() fileQueryInput: FileQueryInput,
  ): Promise<StreamableFile> {
    /**
     * another way:
     *
     * @Get(':id')
     * async getFileObject(@Query() fileQueryInput: FileQueryInput, @Res() res: Response) {
     *   const fileObject = await this.storageService.getFileObjectById(fileQueryInput.id)
     *   const readable = Readable.fromWeb(
     *     fileObject.Body.transformToWebStream() as ReadableStream
     *   )
     *   res.setHeader('Content-Type', fileObject.ContentType)
     *   res.setHeader('Content-Length', fileObject.ContentLength)
     *   readable.pipe(res)
     * }
     */
    let fileObject: GetObjectCommandOutput;
    if (fileQueryInput.id != null)
      fileObject = await this.storageService.getFileObjectById(
        fileQueryInput.id,
      );
    else if (fileQueryInput.path != null)
      fileObject = await this.storageService.getFileObjectByBucketKey(
        STORAGE_BUCKET_NAME.UPLOADED,
        fileQueryInput.path,
      );
    else throw new BadRequestException('id or path is required');
    const readable = Readable.fromWeb(
      fileObject.Body.transformToWebStream() as ReadableStream,
    );
    return new StreamableFile(readable, {
      type: fileObject.ContentType,
      length: fileObject.ContentLength,
    });
  }

  @Post('')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadFileObject(
    @UploadedFile() file: Express.Multer.File,
    @Body() fileAddInput: FileAddInput,
  ): Promise<FileEntity> {
    return this.storageService.putFile(
      STORAGE_BUCKET_NAME.UPLOADED,
      file,
      fileAddInput,
    );
  }

  @Delete()
  async deleteFile(
    @Body() fileQueryInput: FileQueryInput,
  ): Promise<FileDeleteResponse> {
    let done: boolean;
    if (fileQueryInput.id != null)
      done = await this.storageService.deleteFileById(fileQueryInput.id);
    if (fileQueryInput.path != null)
      done = await this.storageService.deleteFileByPath(fileQueryInput.path);
    else throw new BadRequestException('id or path is required');
    return { done };
  }
}
