// backend/src/users/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Use predefined service for Gmail
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string, firstName: string): Promise<boolean> {
    try {
      const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: this.configService.get('EMAIL_FROM'),
        to: email,
        subject: 'Password Reset Request - ClientPortal-UOL',
        html: this.getPasswordResetEmailTemplate(firstName, resetUrl),
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  private getPasswordResetEmailTemplate(firstName: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1a84de; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background-color: #1a84de; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .button:hover { background-color: #0958d9; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ClientPortal-UOL</h1>
            <h2>Password Reset Request</h2>
          </div>
          <div class="content">
            <p>Hello ${firstName},</p>
            
            <p>We received a request to reset your password for your ClientPortal-UOL account. If you made this request, please click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Your Password</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #f0f0f0; padding: 10px; border-radius: 4px;">${resetUrl}</p>
            
            <div class="warning">
              <strong>Important:</strong> This password reset link will expire in 1 hour for security reasons.
            </div>
            
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <p>For security reasons, never share this email or reset link with anyone.</p>
            
            <p>Best regards,<br>The ClientPortal-UOL Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2025 ClientPortal-UOL. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendPasswordResetConfirmation(email: string, firstName: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.configService.get('EMAIL_FROM'),
        to: email,
        subject: 'Password Successfully Reset - ClientPortal-UOL',
        html: this.getPasswordResetConfirmationTemplate(firstName),
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  private getPasswordResetConfirmationTemplate(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #24AC4A; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .success { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ClientPortal-UOL</h1>
            <h2>Password Reset Successful</h2>
          </div>
          <div class="content">
            <p>Hello ${firstName},</p>
            
            <div class="success">
              <strong>Success!</strong> Your password has been successfully reset.
            </div>
            
            <p>Your ClientPortal-UOL account password has been changed successfully. You can now log in with your new password.</p>
            
            <p>If you didn't make this change, please contact our support team immediately.</p>
            
            <p>For your security, we recommend:</p>
            <ul>
              <li>Using a strong, unique password</li>
              <li>Enabling two-factor authentication</li>
              <li>Keeping your login credentials secure</li>
            </ul>
            
            <p>Best regards,<br>The ClientPortal-UOL Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2025 ClientPortal-UOL. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
