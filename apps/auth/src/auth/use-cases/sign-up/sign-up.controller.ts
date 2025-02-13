import { Body, Controller, Post } from '@nestjs/common';
import { AUTH_URL_PATH } from '@apps/auth/auth/constants/auth.constants';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignUpService } from './sign-up.service';

@Controller(AUTH_URL_PATH)
export class SignUpController {
  constructor(private readonly service: SignUpService) {}

  @Post('sign-up')
  execute(@Body() signUpDto: SignUpDto) {
    return this.service.execute(signUpDto);
  }
}
