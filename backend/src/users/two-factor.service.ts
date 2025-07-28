// backend/src/users/two-factor.service.ts
import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { User } from './user.entity';

@Injectable()
export class TwoFactorService {
  generateSecret(userEmail: string): { secret: string; otpAuthUrl: string } {
    const secret = speakeasy.generateSecret({
      name: `ClientPortal-UOL:${userEmail}`,
      issuer: 'ClientPortal-UOL',
      length: 32
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

  verifyToken(token: string, secret: string, lastUsedTimestamp?: Date): { isValid: boolean; currentTimestamp: number } {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const tokenTimestamp = Math.floor(currentTimestamp / 30); // 30-second windows
    
    // Only check if the token is valid for the current time window (no clock drift tolerance)
    const isValidCurrent = speakeasy.totp.verify({
      secret: secret,
      token: token,
      window: 0, // Only allow current window, no tolerance
      time: currentTimestamp,
      encoding: 'base32'
    });
    
    if (!isValidCurrent) {
      return { isValid: false, currentTimestamp: tokenTimestamp };
    }
    
    // Check if this exact token was already used in the current time window
    if (lastUsedTimestamp) {
      const lastUsedTokenTimestamp = Math.floor(lastUsedTimestamp.getTime() / 1000 / 30);
      
      // If the token was used in the same 30-second window, reject it
      if (lastUsedTokenTimestamp === tokenTimestamp) {
        return { isValid: false, currentTimestamp: tokenTimestamp };
      }
    }
    
    return { isValid: true, currentTimestamp: tokenTimestamp };
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
