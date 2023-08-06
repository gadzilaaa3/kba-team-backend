import { Injectable } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { Link, LinkDocument } from './schemas/link.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LinksService {
  constructor(
    @InjectModel(Link.name)
    private linkModel: Model<LinkDocument>,
  ) {}

  async create(createLinkDto: CreateLinkDto): Promise<Link> {
    return await this.linkModel.create(createLinkDto);
  }

  async getAll(): Promise<Link[]> {
    return await this.linkModel.find();
  }
}
