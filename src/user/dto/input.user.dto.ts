import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UserCommon } from './common.user.dto';

export class CreateUserInput extends UserCommon {}

export class UpdateUserInput extends PartialType(UserCommon) {}

export class LoginUserInput {
  @ApiProperty({ example: 'sunnyD123' })
  username: string;

  @ApiProperty({ example: 'password@1' })
  password: string;
}
