import { Controller, Body, Get, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthInput } from './dto/auth.input.dto';
import { LoginAuthOutput } from './dto/auth.output.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppContext, Public } from '../shared/types/types';
import { User } from '../entities/user.entity';

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
    type: LoginAuthOutput,
  })
  signIn(@Body() loginDto: LoginAuthInput): Promise<LoginAuthOutput> {
    return this.authService.login(loginDto);
  }

  @Get('user')
  @ApiOperation({ summary: 'Get User Info from Access Token' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
    type: User,
  })
  async getUser(@AppContext('userId') userId: string): Promise<User> {
    return await this.authService.getUser(userId);
  }
}
