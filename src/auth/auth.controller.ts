import { Controller, Post, Body, Get, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthInputDto } from './dto/auth.input.dto';
import { LoginAuthOutputDto } from './dto/auth.output.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MFContext, Public } from 'src/shared/types/types';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
@ApiBearerAuth()
@ApiTags('Login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Put('login')
  @ApiOperation({ summary: 'Get Access token with username and password' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
    type: LoginAuthOutputDto,
  })
  signIn(@Body() loginDto: LoginAuthInputDto): Promise<LoginAuthOutputDto> {
    return this.authService.login(loginDto);
  }

  @Get('user')
  @ApiOperation({ summary: 'Get User Info from Access Token' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
    type: User,
  })
  getUser(@MFContext('userId') userId: string): Promise<User> {
    return this.authService.getUser(userId);
  }
}
