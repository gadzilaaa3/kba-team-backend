import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schemas/token.schema';

@Module({
  providers: [TokensService],
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  exports: [TokensService],
})
export class TokensModule {}
