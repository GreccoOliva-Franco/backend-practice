import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { VerifyEmailService } from './verify-email.service';
import { AUTH_URL_PATH } from '@apps/auth/auth/constants/auth.constants';
import { PublicEndpoint } from '@apps/auth/auth/guards/public.guard';
import { VERIFY_EMAIL_PATH } from './verify-email.constants';
import { Response } from 'express';

@Controller(AUTH_URL_PATH)
export class VerifyEmailController {
  constructor(private readonly service: VerifyEmailService) {}

  @PublicEndpoint()
  @Get(VERIFY_EMAIL_PATH)
  async getPage(@Query() query: VerifyEmailDto, @Res() response: Response) {
    // Hack to avoid hbs from scaping string characters
    const slotPointer = 'xxx---slot-pointer---xxx';
    return response.render(
      'auth/email-verification',
      { token: slotPointer },
      (_, html) => {
        html = html.replace(slotPointer, query.token);
        response.send(html);
      },
    );
  }

  @PublicEndpoint()
  @HttpCode(HttpStatus.OK)
  @Post(VERIFY_EMAIL_PATH)
  async verify(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.service.verify(verifyEmailDto);
  }
}
