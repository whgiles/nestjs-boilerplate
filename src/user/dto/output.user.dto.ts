import { ApiProperty } from '@nestjs/swagger';

export class LoginUserOutput {
  @ApiProperty({ example: 'sunnyD123' })
  username: string;

  @ApiProperty({ example: 'test@test.com' })
  email: string;
}

export class UserOutput {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  deletedAt: string;
}

export class CreateUserOutput extends UserOutput {}
export class UpdateUserOutput extends UserOutput {}
export class FindOneUserOutput extends UserOutput {}

export class FindMultipeUserOutput {
  users: FindOneUserOutput[];
}
