import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AUTH_URL_PATH } from '@apps/auth/auth/constants/auth.constants';
import { SignInDto } from './dtos/sign-in.dto';
import { SignInService } from './sign-in.service';
import { AuthToken } from './sign-in.type';

@Controller(AUTH_URL_PATH)
export class SignInController {
  constructor(private readonly service: SignInService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  execute(@Body() signInDto: SignInDto): Promise<AuthToken> {
    return this.service.execute(signInDto);
  }
}
