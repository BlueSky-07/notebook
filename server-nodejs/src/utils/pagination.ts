import { ApiProperty } from '@nestjs/swagger';

export abstract class ListInput<
  F extends Record<string, unknown> = Record<string, unknown>,
> {
  abstract filter?: F;
  @ApiProperty({ type: Number, required: false, default: 10 })
  pageSize?: number;
  @ApiProperty({ type: Number, required: false, default: 1 })
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
  const pageNumber = Math.max(Math.min(input.pageNumber || 0, 1000), 0);
  const pageSize = Math.max(Math.min(input.pageSize || 0, 100), 0);
  return {
    skip: pageNumber * pageSize,
    take: pageSize,
  };
}
