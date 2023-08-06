import { Module } from '@nestjs/common';
import { ResetTokensService } from './reset-tokens.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ResetToken, ResetTokenSchema } from './schemas/reset-token.schema';

@Module({
  providers: [ResetTokensService],
  exports: [ResetTokensService],
  imports: [
    MongooseModule.forFeature([
      { name: ResetToken.name, schema: ResetTokenSchema },
    ]),
  ],
})
export class ResetTokensModule {}
