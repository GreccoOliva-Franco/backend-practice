import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignUpService } from './sign-up.service';

@Controller('auth/sign-up')
export class SignUpController {
  constructor(private readonly service: SignUpService) {}

  @Post()
  execute(@Body() signUpDto: SignUpDto) {
    return this.service.execute(signUpDto);
  }
}
