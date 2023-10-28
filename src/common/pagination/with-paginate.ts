import { Model } from 'mongoose';
import {
  PaginateResponseWithQuery,
  PaginationQuery,
} from './types/paginate-response-with-query.type';
import { PaginatedResponse } from './types/pagination-response.type';

export class WithPaginate {
  private static limit = 100;

  static async paginate<Schema>(
    query: PaginationQuery<Schema>,
    offset: number,
    limit: number,
    total: number,
  ): Promise<PaginatedResponse<Schema>> {
    if (limit > WithPaginate.limit) limit = WithPaginate.limit;

    const items = await query.skip(offset).limit(limit).exec();

    return {
      limit,
      offset,
      total,
      items,
    };
  }

  // Not stable
  static async queryWithPaginate<Schema>(
    repository: Model<Schema>,
    offset: number,
    limit: number,
  ): Promise<PaginateResponseWithQuery<Schema>> {
    const total = await repository.count().exec();

    const query = repository.find().skip(offset).limit(limit);

    if (limit > WithPaginate.limit) limit = WithPaginate.limit;

    return {
      limit,
      offset,
      total,
      query,
    };
  }

  // Not stable
  static async getPaginateResponse<Schema>(
    paginateResponseWithQuery: PaginateResponseWithQuery<Schema>,
  ): Promise<PaginatedResponse<Schema>> {
    return {
      limit: paginateResponseWithQuery.limit,
      offset: paginateResponseWithQuery.offset,
      total: paginateResponseWithQuery.total,
      items: await paginateResponseWithQuery.query.exec(),
    };
  }
}
