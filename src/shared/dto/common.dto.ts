import { ApiProperty } from '@nestjs/swagger';

export class AppHeader {
  @ApiProperty()
  userid: string;
}

export class BulkOperationOutput {
  @ApiProperty({ isArray: true })
  successful: any[];

  @ApiProperty({ isArray: true })
  errors: any[];
}
