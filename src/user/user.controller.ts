import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInputDto, UpdateUserInputDto } from './dto/input.user.dto';

import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/shared/types/types';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create New User' })
  async create(@Body() createUserDto: CreateUserInputDto) {
    return await this.service.create(createUserDto);
  }

  @Get(':id')
  // @ApiOperation({ summary: 'Get User By Id' })
  @ApiExcludeEndpoint()
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Patch(':id')
  // @ApiOperation({ summary: 'Update User By Id' })
  @ApiExcludeEndpoint()
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserInputDto,
  ) {
    return await this.service.update(id, updateUserDto);
  }

  @Delete(':id')
  // @ApiOperation({ summary: 'Delete User By id' })
  @ApiExcludeEndpoint()
  async remove(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
