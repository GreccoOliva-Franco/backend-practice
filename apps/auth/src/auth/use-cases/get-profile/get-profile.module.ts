import { Module } from '@nestjs/common';
import { GetProfileController } from './get-profile.controller';
import { GetProfileService } from './get-profile.service';
import { GetUserModule } from '@apps/auth/users/use-cases/get-user/get-user.module';

@Module({
  imports: [GetUserModule],
  controllers: [GetProfileController],
  providers: [GetProfileService],
})
export class GetProfileModule {}
