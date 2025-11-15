import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthOutputDto {
  @ApiProperty()
  accessToken: string;
}
