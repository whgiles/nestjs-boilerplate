import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthInput {
  @ApiProperty({ example: 'sunnyD123' })
  username: string;

  @ApiProperty({ example: 'password@1' })
  password: string;
}
