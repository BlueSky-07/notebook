import { WEB_FILE_ENTITY_LINK_PREFIX } from './file.const';
import { FileEntity } from './file.entity';
import {
  STORAGE_BUCKET_NAME,
  type StorageBucketName,
} from '../storage/storage.const';

export function extractFileFromLink(
  link: string = '',
): Partial<FileEntity> | undefined {
  if (link.startsWith(WEB_FILE_ENTITY_LINK_PREFIX)) {
    const search = new URLSearchParams(link.split('?')[1]);
    const id = search.get('id') || null;
    const parsedId = Number.parseInt(id || '', 10);
    const bucket = search.get('bucket') || null;
    const path = search.get('path') || null;
    return {
      id: Number.isNaN(parsedId) ? undefined : parsedId,
      bucket: Object.values(
        STORAGE_BUCKET_NAME as Record<string, string>,
      ).includes(bucket || '')
        ? (bucket as StorageBucketName)
        : undefined,
      path: path || undefined,
    };
  }
}

export function makeFileLinkForWeb(
  file: Partial<Pick<FileEntity, 'id' | 'bucket' | 'path'>>,
) {
  return `${WEB_FILE_ENTITY_LINK_PREFIX}?${new URLSearchParams(
    Object.fromEntries(
      Object.entries(file)
        .filter(([k, v]) => v != null)
        .map(([k, v]) => [k, v.toString()]),
    ),
  )}`;
}
