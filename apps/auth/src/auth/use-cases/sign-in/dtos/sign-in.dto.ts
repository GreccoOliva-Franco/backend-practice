import { PickType } from '@nestjs/mapped-types';
import { SignUpDto } from '../../sign-up/dtos/sign-up.dto';

export class SignInDto extends PickType(SignUpDto, ['email', 'password']) {}
