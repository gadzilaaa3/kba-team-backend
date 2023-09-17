import { UseGuards, applyDecorators } from '@nestjs/common';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';

export function UseRefreshToken(): MethodDecorator {
  return applyDecorators(UseGuards(RefreshTokenGuard));
}
