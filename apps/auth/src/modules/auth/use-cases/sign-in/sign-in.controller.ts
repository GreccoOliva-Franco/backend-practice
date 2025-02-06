import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AUTH_URL_PATH } from '@apps/auth/modules/auth/constants/auth.constants';
import { SignInDto } from './dtos/sign-in.dto';
import { SignInService } from './sign-in.service';
import { AuthToken } from './sign-in.type';
import { PublicEndpoint } from '@apps/auth/modules/auth/guards/public.guard';

@Controller(AUTH_URL_PATH)
export class SignInController {
  constructor(private readonly service: SignInService) {}

  @PublicEndpoint()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  execute(@Body() signInDto: SignInDto): Promise<AuthToken> {
    return this.service.execute(signInDto);
  }
}
