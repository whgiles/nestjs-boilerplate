import { ApiProperty } from '@nestjs/swagger';

export class UserCommon {
  @ApiProperty({ example: 'sunnyD123' })
  username: string;

  @ApiProperty({ example: 'password@1' })
  password: string;

  @ApiProperty({ example: 'test@test.com' })
  email: string;
}
