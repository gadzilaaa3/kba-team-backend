export type PaginatedResponse<Data> = {
  limit: number;
  offset: number;
  total: number;
  items: Data[];
};
