import { UseGuards, applyDecorators } from '@nestjs/common';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { AccessTokenGuard } from '../guards/accessToken.guard';

export function Auth(...roles: Role[]): MethodDecorator {
  return applyDecorators(
    Roles(...roles),
    UseGuards(AccessTokenGuard, RolesGuard),
  );
}
