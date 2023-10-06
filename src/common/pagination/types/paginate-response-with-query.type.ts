import { Document, Query } from 'mongoose';

export type PaginateResponseWithQuery<Schema> = {
  limit: number;
  offset: number;
  total: number;
  query: PaginationQuery<Schema>;
};

export type PaginationQuery<Schema> = Query<
  Schema[],
  Document,
  {},
  Document,
  'find'
>;
