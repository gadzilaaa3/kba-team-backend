import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TokenExpires } from 'src/auth/tokenExpires';
import { User } from 'src/users/schemas/user.schema';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ timestamps: true })
export class Token {
  @Prop({
    type: Date,
    expires: TokenExpires.refreshTokenExpires,
    default: Date.now,
  })
  createdAt: Date;
  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User;
  @Prop()
  refreshToken: string;
  @Prop()
  expiresIn: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
