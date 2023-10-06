export type PaginateResponse<Data> = {
  limit: number;
  offset: number;
  total: number;
  items: Data[];
};
