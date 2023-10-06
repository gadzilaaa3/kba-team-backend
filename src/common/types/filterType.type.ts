import { Document, FilterQuery, Types } from 'mongoose';

export type FilterType<Item> = FilterQuery<
  Document<unknown, {}, Item> & Omit<Item & { _id: Types.ObjectId }, never>
>;
