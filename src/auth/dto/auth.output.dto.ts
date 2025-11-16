import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthOutput {
  @ApiProperty()
  accessToken: string;
}
