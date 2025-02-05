import { Body, Controller, Post } from '@nestjs/common';
import { URL_PATH } from '@apps/auth/modules/auth/constants/auth.constants';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignUpService } from './sign-up.service';

@Controller(URL_PATH)
export class SignUpController {
  constructor(private readonly service: SignUpService) {}

  @Post('sign-up')
  execute(@Body() signUpDto: SignUpDto) {
    return this.service.execute(signUpDto);
  }
}
