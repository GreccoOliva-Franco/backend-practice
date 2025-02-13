import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../use-cases/create-user/dtos/create-user.dto';

export class UpdateUserDto extends PickType(CreateUserDto, [
  'firstName',
  'lastName',
]) {}
