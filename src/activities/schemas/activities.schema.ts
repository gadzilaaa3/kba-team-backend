import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ActivitiesDocument = HydratedDocument<Activities>;

@Schema({ timestamps: true })
export class Activities {
  @Prop()
  languages?: string;

  @Prop()
  codingActivity?: string;
}

export const ActivitiesSchema = SchemaFactory.createForClass(Activities);
