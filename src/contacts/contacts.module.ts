import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactsService } from './contacts.service';
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
