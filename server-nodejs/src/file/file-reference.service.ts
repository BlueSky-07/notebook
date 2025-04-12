import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileReferenceEntity } from './file-reference.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class FileReferenceService {
  constructor(
    @InjectRepository(FileReferenceEntity)
    private readonly fileReferenceRepository: Repository<FileReferenceEntity>,
  ) {}

  async addFileReferences(
    sourceType: FileReferenceEntity['sourceType'],
    sourceId: FileReferenceEntity['sourceId'],
    fileIds: FileReferenceEntity['fileId'][],
  ): Promise<FileReferenceEntity['id'][]> {
    const ids: FileReferenceEntity['id'][] = [];
    for (const fileId of fileIds) {
      const record = await this.fileReferenceRepository.findOneBy({
        fileId,
        sourceType,
        sourceId,
      });
      if (record) {
        ids.push(record.id);
        continue;
      }
      const res = await this.fileReferenceRepository.insert({
        fileId,
        sourceType,
        sourceId,
      });
      ids.push(res.generatedMaps[0].id as number);
    }
    return ids;
  }

  async deleteFileReferences(
    sourceType: FileReferenceEntity['sourceType'],
    sourceId: FileReferenceEntity['sourceId'],
  ): Promise<boolean> {
    const res = await this.fileReferenceRepository.delete({
      sourceType,
      sourceId,
    });
    return !!res.affected;
  }

  async getFileReferencesByFileIds(
    fileIds: FileReferenceEntity['fileId'][],
  ): Promise<FileReferenceEntity[]> {
    if (!fileIds.length) return [];
    return this.fileReferenceRepository.find({
      where: {
        fileId: In(fileIds),
      },
    });
  }
}
