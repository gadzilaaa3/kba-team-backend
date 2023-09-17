import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
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
  })
  password: string;

  @Prop({
    default: [Role.Admin],
  })
  roles: [String];
}

export const UserSchema = SchemaFactory.createForClass(User);
