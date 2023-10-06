import { Document, Types, ProjectionType } from 'mongoose';

export type Projection<Item> = ProjectionType<
  Document<unknown, {}, Item> & Omit<Item & { _id: Types.ObjectId }, never>
>;
