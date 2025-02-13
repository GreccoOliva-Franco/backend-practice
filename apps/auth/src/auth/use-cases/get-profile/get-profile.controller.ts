import { Controller, Get } from '@nestjs/common';
import { AUTH_URL_PATH } from '@apps/auth/auth/constants/auth.constants';
import { User } from '@prisma/client';
import { GetProfileService } from './get-profile.service';
import { UserProfile } from '@apps/auth/users/use-cases/get-user/get-user.types';

@Controller(AUTH_URL_PATH)
export class GetProfileController {
  constructor(private readonly getProfileService: GetProfileService) {}

  @Get('profile')
  execute(id: User['id']): Promise<UserProfile> {
    return this.getProfileService.execute(id);
  }
}
