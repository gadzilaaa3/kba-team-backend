import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type ResetTokenDocument = HydratedDocument<ResetToken>;

const expireAfterSeconds = 1800; // 30 minutes

@Schema({ timestamps: true, expireAfterSeconds })
export class ResetToken {
  @Prop({
    type: Date,
    expires: expireAfterSeconds,
    default: Date.now,
  })
  createdAt: Date;
  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User;
  @Prop()
  token: string;
}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);
