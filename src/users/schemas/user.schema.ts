import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Token } from 'src/tokens/schemas/token.schema';

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
}

export const UserSchema = SchemaFactory.createForClass(User);
