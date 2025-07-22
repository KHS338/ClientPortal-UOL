import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed',
        error: error.name
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    // For JWT, logout is typically handled on the frontend by removing the token
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }

  @Post('generate-token')
  @HttpCode(HttpStatus.OK)
  async generateToken(@Body() body: { userId: number }) {
    try {
      const user = await this.usersService.findById(body.userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return await this.authService.generateTokenForUser(user);
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Token generation failed',
        error: error.name
      };
    }
  }
}
