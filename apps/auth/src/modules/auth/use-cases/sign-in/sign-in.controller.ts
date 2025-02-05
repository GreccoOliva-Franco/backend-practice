import { Body, Controller, Post } from '@nestjs/common';
import { URL_PATH } from '../../constants/auth.constants';
import { SignInDto } from './dtos/sign-in.dto';
import { SignInService } from './sign-in.service';
import { AuthToken } from './sign-in.type';

@Controller(URL_PATH)
export class SignInController {
  constructor(private readonly service: SignInService) {}

  @Post('sign-in')
  execute(@Body() signInDto: SignInDto): Promise<AuthToken> {
    return this.service.execute(signInDto);
  }
}
