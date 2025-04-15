import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import {
  FileAddInput,
  FileAdminClearNoReferencesInput,
  FileAdminClearNoReferencesResponse,
  FileDeleteResponse,
  FileQueryInput,
} from './file.dto';
import { FileEntity } from './file.entity';
import { Readable } from 'stream';
import { type ReadableStream } from 'stream/web';
import { FileService } from './file.service';
import { STORAGE_BUCKET_NAME } from '../storage/storage.const';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('info')
  getFileInfo(@Query() fileQueryInput: FileQueryInput): Promise<FileEntity> {
    if (fileQueryInput.id != null)
      return this.fileService.getFileById(fileQueryInput.id);
    if (fileQueryInput.path != null)
      return this.fileService.getFileByPath(fileQueryInput.path);
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
     * async getFileObject(@Param() id: id, @Res() res: Response) {
     *   const record = await this.fileService.getFileById(fileQueryInput.id);
     *   const fileObject = await this.fileService.getFileObject(record);
     *   const readable = Readable.fromWeb(
     *     fileObject.Body.transformToWebStream() as ReadableStream
     *   )
     *   res.setHeader('Content-Type', fileObject.ContentType)
     *   res.setHeader('Content-Length', fileObject.ContentLength)
     *   readable.pipe(res)
     * }
     */
    let record: FileEntity;
    if (fileQueryInput.id != null) {
      record = await this.fileService.getFileById(fileQueryInput.id);
    } else if (fileQueryInput.path != null)
      record = await this.fileService.getFileByPath(fileQueryInput.path);
    else throw new BadRequestException('id or path is required');
    const fileObject = await this.fileService.getFileObject(record);
    const readable = Readable.fromWeb(
      fileObject.Body.transformToWebStream() as ReadableStream,
    );
    return new StreamableFile(readable, {
      type: fileObject.ContentType,
      length: fileObject.ContentLength,
    });
  }

  @Delete('admin/clear-no-references')
  async clearNoReferencesFiles(
    @Body() fileAdminClearNoReferencesInput: FileAdminClearNoReferencesInput,
  ): Promise<FileAdminClearNoReferencesResponse> {
    const deletedFileIds =
      await this.fileService.batchDeleteFilesByNoReferences(
        fileAdminClearNoReferencesInput.dryRun,
      );
    return { ids: deletedFileIds, count: deletedFileIds.length };
  }

  @Post('')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadFileObject(
    @UploadedFile() file: Express.Multer.File,
    @Body() fileAddInput: FileAddInput,
  ): Promise<FileEntity> {
    return this.fileService.addFile(
      STORAGE_BUCKET_NAME.UPLOADED,
      file,
      fileAddInput,
    );
  }

  @Delete('')
  async deleteFile(
    @Body() fileQueryInput: FileQueryInput,
  ): Promise<FileDeleteResponse> {
    let done: boolean;
    if (fileQueryInput.id != null)
      done = await this.fileService.deleteFileById(fileQueryInput.id);
    if (fileQueryInput.path != null)
      done = await this.fileService.deleteFileByPath(fileQueryInput.path);
    else throw new BadRequestException('id or path is required');
    return { done };
  }
}
