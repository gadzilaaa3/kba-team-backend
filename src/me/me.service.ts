import { Injectable } from '@nestjs/common';
import { ActivitiesService } from 'src/activities/activities.service';
import { UpdateActivitiesDto } from 'src/activities/dto/update-activities.dto';
import { ContactsService } from 'src/contacts/contacts.service';
import { UpdateContactsDto } from 'src/contacts/dto/update-contacts.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MeService {
  constructor(
    private usersService: UsersService,
    private activitiesService: ActivitiesService,
    private contactsService: ContactsService,
  ) {}

  async getYourSelf(userId: string) {
    return this.usersService.findById(userId, { roles: 0, password: 0 });
  }

  async getActivities(userId: string) {
    const user = await this.usersService.findById(userId, { activities: 1 });
    return user.activities;
  }

  async updateActivities(
    userId: string,
    updateActivitiesDto: UpdateActivitiesDto,
  ) {
    const user = await this.usersService.findById(userId, { activities: 1 });
    const activitiesId = user.activities as string;
    return this.activitiesService.update(activitiesId, updateActivitiesDto);
  }

  async getContacts(userId: string) {
    const user = await this.usersService.findById(userId, { contacts: 1 });
    return user.contacts;
  }

  async updateContacts(userId: string, updateContactsDto: UpdateContactsDto) {
    const user = await this.usersService.findById(userId, { contacts: 1 });
    const contactsId = user.activities as string;
    return this.contactsService.update(contactsId, updateContactsDto);
  }
}
