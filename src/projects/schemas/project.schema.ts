import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
  @Prop({ isRequired: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  assigned: User;

  @Prop({ type: [Types.ObjectId], ref: User.name })
  collaborators?: User[];

  @Prop()
  deploymentDate?: Date;

  @Prop({ default: 'В разработке' })
  status?: string;

  @Prop()
  github?: string;

  @Prop()
  images?: [String];

  @Prop()
  description?: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
