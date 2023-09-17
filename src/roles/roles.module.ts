import { Module } from '@nestjs/common';
import { RolesGuard } from './guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [RolesGuard],
  imports: [JwtModule],
})
export class RolesModule {}
