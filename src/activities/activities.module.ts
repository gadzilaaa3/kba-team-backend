import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesService } from './activities.service';
import { Activities, ActivitiesSchema } from './schemas/activities.schema';

@Module({
  providers: [ActivitiesService],
  imports: [
    MongooseModule.forFeature([
      { name: Activities.name, schema: ActivitiesSchema },
    ]),
  ],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
