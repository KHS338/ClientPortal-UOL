// backend/src/users/user.service.ts
import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { TwoFactorService } from './two-factor.service';
import { EmailService } from './email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly twoFactorService: TwoFactorService,
    private readonly emailService: EmailService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      select: ['id', 'firstName', 'lastName', 'companymail', 'email', 'companyName', 'companySize', 'phone', 'isActive', 'subscriptionStatus', 'createdAt'], // Don't return password
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Check if user already exists with either email
    const existingUser = await this.userRepo.findOne({
      where: [
        { companymail: createUserDto.companymail },
        { email: createUserDto.email }
      ]
    });
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    // Create user entity
    const user = this.userRepo.create({
      ...createUserDto,
      password: hashedPassword,
      isActive: true,
      emailVerified: false,
      subscriptionStatus: 'inactive'
    });

    try {
      const savedUser = await this.userRepo.save(user);
      
      // Return user without password
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword;
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id },
      select: ['id', 'firstName', 'lastName', 'companymail', 'email', 'companyName', 'companySize', 'phone', 'isActive', 'subscriptionStatus', 'twoFactorEnabled', 'createdAt']
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: [
        { companymail: email },
        { email: email }
      ]
    });
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.userRepo.update(userId, { lastLogin: new Date() });
  }

  async updateSubscription(userId: number, subscriptionPlan: string, subscriptionStatus: string): Promise<void> {
    await this.userRepo.update(userId, { 
      subscriptionPlan, 
      subscriptionStatus 
    });
  }

  async createDummyUser() {
    // Check if user already exists
    const existingUser = await this.userRepo.findOne({
      where: { email: 'seed@example.com' }
    });
    
    if (existingUser) {
      return { message: 'Dummy user already exists', user: existingUser };
    }

    const hashedPassword = await bcrypt.hash('test1234', 10);

    const user = this.userRepo.create({
      firstName: 'John',
      lastName: 'Doe',
      companymail: 'seed@example.com',
      email: 'john.doe@personal.com',
      password: hashedPassword,
      companyName: 'Test Company',
      companySize: '11-50',
      phone: '+1234567890',
      avatar: null,
      isActive: true,
      emailVerified: true,
      subscriptionStatus: 'active'
    });
    
    const savedUser = await this.userRepo.save(user);
    const { password, ...userWithoutPassword } = savedUser;
    
    return { 
      message: 'Dummy user created successfully', 
      user: userWithoutPassword
    };
  }

  // Two-Factor Authentication methods
  async setup2FA(userId: number): Promise<{
    secret: string;
    otpAuthUrl: string;
    qrCodeUrl: string;
    backupCodes: string[];
  }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate 2FA secret and backup codes
    const twoFactorSetup = this.twoFactorService.generateSecret(user.companymail);
    const backupCodes = this.twoFactorService.generateBackupCodes();
    const qrCodeUrl = await this.twoFactorService.generateQRCode(twoFactorSetup.otpAuthUrl);

    // Store the secret but don't enable 2FA yet
    await this.userRepo.update(userId, {
      twoFactorSecret: twoFactorSetup.secret,
      twoFactorBackupCodes: JSON.stringify(backupCodes),
      twoFactorEnabled: false // Will be enabled after verification
    });

    return {
      secret: twoFactorSetup.secret,
      otpAuthUrl: twoFactorSetup.otpAuthUrl, // Raw OTP Auth URL for react-qr-code
      qrCodeUrl: qrCodeUrl, // Base64 image for alternative display
      backupCodes: backupCodes
    };
  }

  async enable2FA(userId: number, token: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.twoFactorSecret) {
      throw new BadRequestException('Two-factor authentication not set up. Please set it up first.');
    }

    const isValid = this.twoFactorService.verifyToken(token, user.twoFactorSecret);
    
    if (!isValid) {
      return { success: false, message: 'Invalid verification code' };
    }

    // Enable 2FA for the user
    await this.userRepo.update(userId, { twoFactorEnabled: true });
    
    return { success: true, message: 'Two-factor authentication enabled successfully' };
  }

  async disable2FA(userId: number, token: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.twoFactorEnabled) {
      return { success: false, message: 'Two-factor authentication is not enabled' };
    }

    const isValid = this.twoFactorService.verifyToken(token, user.twoFactorSecret);
    
    if (!isValid) {
      return { success: false, message: 'Invalid verification code' };
    }

    // Disable 2FA and clear secrets
    await this.userRepo.update(userId, { 
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: null
    });
    
    return { success: true, message: 'Two-factor authentication disabled successfully' };
  }

  async verify2FAToken(userId: number, token: string): Promise<boolean> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return false;
    }

    // Check if it's a regular TOTP token
    const isValidToken = this.twoFactorService.verifyToken(token, user.twoFactorSecret);
    if (isValidToken) {
      return true;
    }

    // Check if it's a backup code
    const isValidBackupCode = this.twoFactorService.verifyBackupCode(token, user);
    if (isValidBackupCode) {
      // Remove the used backup code
      const updatedCodes = this.twoFactorService.removeUsedBackupCode(token, user);
      await this.userRepo.update(userId, { 
        twoFactorBackupCodes: JSON.stringify(updatedCodes)
      });
      return true;
    }

    return false;
  }

  async regenerateBackupCodes(userId: number, token: string): Promise<{ success: boolean; backupCodes?: string[]; message: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.twoFactorEnabled) {
      return { success: false, message: 'Two-factor authentication is not enabled' };
    }

    const isValid = this.twoFactorService.verifyToken(token, user.twoFactorSecret);
    
    if (!isValid) {
      return { success: false, message: 'Invalid verification code' };
    }

    // Generate new backup codes
    const backupCodes = this.twoFactorService.generateBackupCodes();
    await this.userRepo.update(userId, { 
      twoFactorBackupCodes: JSON.stringify(backupCodes)
    });
    
    return { 
      success: true, 
      backupCodes: backupCodes,
      message: 'Backup codes regenerated successfully' 
    };
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async updateUserProfile(userId: number, updateData: Partial<User>): Promise<User> {
    // Remove sensitive fields that shouldn't be updated through this method
    const { password, twoFactorSecret, twoFactorBackupCodes, ...safeUpdateData } = updateData;
    
    // Check if email is being updated and if it's already taken
    if (updateData.email || updateData.companymail) {
      const conditions = [];
      if (updateData.email) {
        conditions.push({ email: updateData.email });
      }
      if (updateData.companymail) {
        conditions.push({ companymail: updateData.companymail });
      }
      
      const existingUser = await this.userRepo.createQueryBuilder('user')
        .where('user.id != :userId', { userId })
        .andWhere(conditions.length > 0 ? 
          conditions.map((condition, index) => 
            Object.keys(condition).map(key => `user.${key} = :${key}${index}`).join(' OR ')
          ).join(' OR ') : '1=0'
        )
        .setParameters(
          conditions.reduce((params, condition, index) => {
            Object.keys(condition).forEach(key => {
              params[`${key}${index}`] = condition[key];
            });
            return params;
          }, {})
        )
        .getOne();
      
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    await this.userRepo.update(userId, safeUpdateData);
    return this.findById(userId);
  }

  // Password Reset methods
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepo.findOne({ 
      where: [
        { email: email },
        { companymail: email }
      ]
    });

    if (!user) {
      // Don't reveal if email exists or not for security
      return {
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await this.userRepo.update(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry
    });

    // Send email
    const emailSent = await this.emailService.sendPasswordResetEmail(
      user.email, 
      resetToken, 
      user.firstName
    );

    if (!emailSent) {
      return {
        success: false,
        message: 'Failed to send password reset email. Please try again.'
      };
    }

    return {
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepo.findOne({
      where: {
        resetPasswordToken: token
      }
    });

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return {
        success: false,
        message: 'Password reset token is invalid or has expired.'
      };
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset tokens
    await this.userRepo.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    // Send confirmation email
    await this.emailService.sendPasswordResetConfirmation(user.email, user.firstName);

    return {
      success: true,
      message: 'Your password has been successfully reset. You can now log in with your new password.'
    };
  }

  async validateResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
    const user = await this.userRepo.findOne({
      where: {
        resetPasswordToken: token
      }
    });

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return { valid: false };
    }

    return { 
      valid: true, 
      email: user.email 
    };
  }
}
