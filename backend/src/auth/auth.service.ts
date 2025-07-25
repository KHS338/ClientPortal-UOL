import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './dto/jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      if (!loginDto.twoFactorToken) {
        return {
          success: false,
          requiresTwoFactor: true,
          userId: user.id,
          message: 'Two-factor authentication required'
        };
      }

      // Verify 2FA token
      const is2FAValid = await this.usersService.verify2FAToken(user.id, loginDto.twoFactorToken);
      if (!is2FAValid) {
        throw new UnauthorizedException('Invalid two-factor authentication code');
      }
    }

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    // JWT payload with minimal data only
    const payload: JwtPayload = { 
      sub: user.id, 
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };

    return {
      success: true,
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(user: any) {
    return {
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        companymail: user.companymail,
        companyName: user.companyName,
        companySize: user.companySize,
        phone: user.phone,
        subscriptionStatus: user.subscriptionStatus,
        isActive: user.isActive,
        twoFactorEnabled: user.twoFactorEnabled
      }
    };
  }

  async generateTokenForUser(user: any) {
    const payload: JwtPayload = { 
      sub: user.id, 
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };

    return {
      success: true,
      access_token: this.jwtService.sign(payload),
    };
  }
}
