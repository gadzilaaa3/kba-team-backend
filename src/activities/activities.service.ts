import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateActivitiesDto } from './dto/update-activities.dto';
import { Activities, ActivitiesDocument } from './schemas/activities.schema';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activities.name)
    private activitiesModel: Model<ActivitiesDocument>,
  ) {}
  async create(): Promise<ActivitiesDocument> {
    return new this.activitiesModel().save();
  }
  async update(
    id: string,
    updateActivitiesDto: UpdateActivitiesDto,
  ): Promise<ActivitiesDocument> {
    return this.activitiesModel.findByIdAndUpdate(id, updateActivitiesDto, {
      new: true,
    });
  }
}
