import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UserDto } from './common.user.dto';

export class CreateUserInputDto extends UserDto {}

export class UpdateUserInputDto extends PartialType(UserDto) {}

export class LoginUserInputDto {
  @ApiProperty({ example: 'sunnyD123' })
  username: string;

  @ApiProperty({ example: 'password@1' })
  password: string;
}
