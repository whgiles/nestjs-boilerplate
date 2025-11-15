import { ApiProperty } from '@nestjs/swagger';

export class LoginUserOutputDto {
  @ApiProperty({ example: 'sunnyD123' })
  username: string;

  @ApiProperty({ example: 'test@test.com' })
  email: string;
}

export class UserOutputDto {
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

export class CreateUserOutputDto extends UserOutputDto {}
export class UpdateUserOutputDto extends UserOutputDto {}
export class FindOneUserOutputDto extends UserOutputDto {}

export class FindMultipeUserOutputDto {
  users: FindOneUserOutputDto[];
}
