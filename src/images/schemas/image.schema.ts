import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Link } from 'src/links/schemas/link.schema';

export type ImageDocument = HydratedDocument<Image>;

@Schema({ timestamps: true })
export class Image {
  @Prop({ type: Types.ObjectId, ref: Link.name })
  link: Link;

  @Prop()
  name: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
