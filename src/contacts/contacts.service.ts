import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Contacts, ContactsDocument } from './schemas/contacts.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateContactsDto } from './dto/create-contacts.dto';
import { UpdateContactsDto } from './dto/update-contacts.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contacts.name)
    private contactsModel: Model<ContactsDocument>,
  ) {}
  async create(
    createContactsDto?: CreateContactsDto,
  ): Promise<ContactsDocument> {
    return new this.contactsModel(createContactsDto).save();
  }
  async update(
    id: string,
    updateActivitiesDto: UpdateContactsDto,
  ): Promise<ContactsDocument> {
    return this.contactsModel.findByIdAndUpdate(id, updateActivitiesDto);
  }
}
