// backend/src/users/user.controller.ts
import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users') // 👈 Base route
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() // 👈 Full route: GET /users
  async findAll() {
    return this.usersService.findAll();
  }

  @Post('register') // 👈 Full route: POST /users/register
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.createUser(createUserDto);
      return {
        success: true,
        message: 'User registered successfully',
        user: user
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.name
      };
    }
  }

  @Get('seed') // 👈 Full route: GET /users/seed
  async seed() {
    return this.usersService.createDummyUser();
  }

  // Two-Factor Authentication endpoints
  @Post('2fa/setup') // 👈 Full route: POST /users/2fa/setup
  @HttpCode(HttpStatus.OK)
  async setup2FA(@Body() body: { userId: number }) {
    try {
      const result = await this.usersService.setup2FA(body.userId);
      return {
        success: true,
        message: 'Two-factor authentication setup initialized',
        twoFactorSetup: result
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.name
      };
    }
  }

  @Post('2fa/enable') // 👈 Full route: POST /users/2fa/enable
  @HttpCode(HttpStatus.OK)
  async enable2FA(@Body() body: { userId: number; token: string }) {
    try {
      const result = await this.usersService.enable2FA(body.userId, body.token);
      return {
        success: result.success,
        message: result.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.name
      };
    }
  }

  @Post('2fa/disable') // 👈 Full route: POST /users/2fa/disable
  @HttpCode(HttpStatus.OK)
  async disable2FA(@Body() body: { userId: number; token: string }) {
    try {
      const result = await this.usersService.disable2FA(body.userId, body.token);
      return {
        success: result.success,
        message: result.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.name
      };
    }
  }

  @Post('2fa/verify') // 👈 Full route: POST /users/2fa/verify
  @HttpCode(HttpStatus.OK)
  async verify2FA(@Body() body: { userId: number; token: string }) {
    try {
      const isValid = await this.usersService.verify2FAToken(body.userId, body.token);
      return {
        success: isValid,
        message: isValid ? 'Token verified successfully' : 'Invalid token'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.name
      };
    }
  }

  @Post('2fa/regenerate-backup-codes') // 👈 Full route: POST /users/2fa/regenerate-backup-codes
  @HttpCode(HttpStatus.OK)
  async regenerateBackupCodes(@Body() body: { userId: number; token: string }) {
    try {
      const result = await this.usersService.regenerateBackupCodes(body.userId, body.token);
      return {
        success: result.success,
        message: result.message,
        backupCodes: result.backupCodes
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.name
      };
    }
  }

  @Post('login') // 👈 Full route: POST /users/login
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { email: string; password: string; twoFactorToken?: string }) {
    try {
      const { email, password, twoFactorToken } = loginDto;
      
      // Find user by email
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      // Verify password
      const isPasswordValid = await this.usersService.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      // Check if 2FA is enabled
      if (user.twoFactorEnabled) {
        if (!twoFactorToken) {
          return {
            success: false,
            message: 'Two-factor authentication required',
            requiresTwoFactor: true,
            userId: user.id
          };
        }

        // Verify 2FA token
        const is2FAValid = await this.usersService.verify2FAToken(user.id, twoFactorToken);
        if (!is2FAValid) {
          return {
            success: false,
            message: 'Invalid two-factor authentication code'
          };
        }
      }

      // Update last login
      await this.usersService.updateLastLogin(user.id);

      // Return user data (excluding password and sensitive info)
      const { password: _, twoFactorSecret: __, twoFactorBackupCodes: ___, ...userWithoutPassword } = user;
      
      return {
        success: true,
        message: 'Login successful',
        user: userWithoutPassword,
        requiresTwoFactor: false
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.name
      };
    }
  }
}
