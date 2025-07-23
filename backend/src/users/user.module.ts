// backend/src/users/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { User } from './user.entity';

import { TwoFactorService } from './two-factor.service';
import { EmailService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, TwoFactorService, EmailService],
  controllers: [UsersController], // 👈 Make sure controller is added
  exports: [UsersService, TwoFactorService, EmailService],
})
export class UsersModule {}
