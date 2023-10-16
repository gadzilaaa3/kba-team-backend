import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Activities } from 'src/activities/schemas/activities.schema';
import { Contacts } from 'src/contacts/schemas/contacts.schema';
import { Role } from 'src/roles/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    isRequired: true,
    unique: true,
  })
  username: string;

  @Prop({
    isRequired: true,
    unique: true,
  })
  email: string;

  @Prop({
    isRequired: true,
    select: false,
  })
  password: string;

  @Prop({
    default: [Role.Admin],
  })
  roles: Role[];

  @Prop({ type: Types.ObjectId, ref: Contacts.name, autopopulate: true })
  contacts: Contacts;

  @Prop({ type: Types.ObjectId, ref: Activities.name, autopopulate: true })
  activities: Activities;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(require('mongoose-autopopulate'));
