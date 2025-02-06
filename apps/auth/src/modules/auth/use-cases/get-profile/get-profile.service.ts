import { GetUserService } from '@apps/auth/modules/users/use-cases/get-user/get-user.service';
import { Injectable } from '@nestjs/common';
import { User } from '@apps/auth/modules/users/entities/users.entity';
import { UserProfile } from '@apps/auth/modules/users/use-cases/get-user/get-user.types';
import { UserDoesNotExistError } from './errors/user-does-not-exist.error';

@Injectable()
export class GetProfileService {
  constructor(private readonly getUserService: GetUserService) {}

  async execute(id: User['id']): Promise<UserProfile> {
    const profile = await this.getUserService.getProfileById(id);
    if (!profile) {
      throw new UserDoesNotExistError();
    }

    return profile;
  }
}
