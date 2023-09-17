import { UseGuards, applyDecorators } from '@nestjs/common';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { RolesGuard } from 'src/roles/guards/roles.guard';

export function Auth(...roles: Role[]): MethodDecorator {
  return applyDecorators(
    Roles(...roles),
    UseGuards(AccessTokenGuard, RolesGuard),
  );
}
