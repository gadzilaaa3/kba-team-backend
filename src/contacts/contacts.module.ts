import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Contacts, ContactsSchema } from './schemas/contacts.schema';

@Module({
  providers: [ContactsService],
  imports: [
    MongooseModule.forFeature([
      { name: Contacts.name, schema: ContactsSchema },
    ]),
  ],
  exports: [ContactsService],
})
export class ContactsModule {}
