import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactsDocument = HydratedDocument<Contacts>;

@Schema({ timestamps: true })
export class Contacts {
  @Prop()
  telegram?: string;

  @Prop()
  github?: string;

  @Prop()
  contactMail?: string;
}

export const ContactsSchema = SchemaFactory.createForClass(Contacts);
