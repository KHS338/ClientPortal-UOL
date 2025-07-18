// backend/src/users/two-factor.service.ts
import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { User } from './user.entity';

@Injectable()
export class TwoFactorService {
  generateSecret(userEmail: string): { secret: string; otpAuthUrl: string } {
    const secret = speakeasy.generateSecret({
      name: userEmail,
      issuer: 'ClientPortal-UOL',
      length: 20
    });

    return {
      secret: secret.base32,
      otpAuthUrl: secret.otpauth_url
    };
  }

  async generateQRCode(otpAuthUrl: string): Promise<string> {
    try {
      return await qrcode.toDataURL(otpAuthUrl);
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }

  verifyToken(token: string, secret: string): boolean {
    return speakeasy.totp.verify({
      secret: secret,
      token: token,
      window: 1, // Allow 1 step (30 seconds) of clock drift
      encoding: 'base32'
    });
  }

  generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      // Generate 8-digit backup codes
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  verifyBackupCode(code: string, user: User): boolean {
    if (!user.twoFactorBackupCodes) return false;
    
    const backupCodes = JSON.parse(user.twoFactorBackupCodes);
    return backupCodes.includes(code.toUpperCase());
  }

  removeUsedBackupCode(code: string, user: User): string[] {
    if (!user.twoFactorBackupCodes) return [];
    
    const backupCodes = JSON.parse(user.twoFactorBackupCodes);
    const updatedCodes = backupCodes.filter((c: string) => c !== code.toUpperCase());
    return updatedCodes;
  }
}
