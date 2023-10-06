import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { MongooseModule } from '@nestjs/mongoose';
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
