import { Body, Controller, Post } from '@nestjs/common';
import { AUTH_URL_PATH } from '@apps/auth/modules/auth/constants/auth.constants';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignUpService } from './sign-up.service';
import { PublicEndpoint } from '@apps/auth/modules/auth/guards/public.guard';

@Controller(AUTH_URL_PATH)
export class SignUpController {
  constructor(private readonly service: SignUpService) {}

  @PublicEndpoint()
  @Post('sign-up')
  execute(@Body() signUpDto: SignUpDto) {
    return this.service.execute(signUpDto);
  }
}
