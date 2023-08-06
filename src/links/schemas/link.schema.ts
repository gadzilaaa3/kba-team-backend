import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LinkDocument = HydratedDocument<Link>;

@Schema({ timestamps: true })
export class Link {
  @Prop({ isRequired: true })
  url: string;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
