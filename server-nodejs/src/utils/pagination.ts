import { ApiProperty } from '@nestjs/swagger';

export abstract class ListInput {
  @ApiProperty({ type: Number, required: false, default: 10 })
  pageSize?: number;
  @ApiProperty({ type: Number, required: false, default: 0 })
  pageNumber?: number;
}

export abstract class ListResponse<T> {
  abstract items: T[];

  @ApiProperty({ type: Number })
  count: number;
}

export type PaginationFindOptions = Record<'skip' | 'take', number>;

export function convertListInputPaginationToFindOptions(
  input: Pick<ListInput, 'pageNumber' | 'pageSize'>,
): PaginationFindOptions {
  const inputPageNumber =
    typeof input.pageNumber === 'string'
      ? parseInt(input.pageNumber, 10)
      : input.pageNumber;
  const inputPageSize =
    typeof input.pageSize === 'string'
      ? parseInt(input.pageSize, 10)
      : input.pageSize;
  const pageNumber = Math.max(Math.min(inputPageNumber || 0, 1000), 0);
  const pageSize = Math.max(Math.min(inputPageSize || 0, 100), 0);
  return {
    skip: pageNumber * pageSize,
    take: pageSize,
  };
}
