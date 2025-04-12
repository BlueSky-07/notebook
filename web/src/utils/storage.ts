import { FileEntity } from '@api/models';

const FILE_ENTITY_LINK_PREFIX = '/api/file/object';

export function getFileEntityLink(file: Pick<FileEntity, 'id'>) {
  return `${FILE_ENTITY_LINK_PREFIX}?id=${file.id}`;
}
