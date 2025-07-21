// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { CvSourcingModule } from './cv-sourcing/cv-sourcing.module';
import { RoleModule } from './roles/role.module';
import { PrequalificationModule } from './prequalification/prequalification.module';
import { DirectModule } from './direct/direct.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // set to false in production
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    UsersModule, // Added UsersModule import
    AuthModule, // Added AuthModule import
    CvSourcingModule, // Added CvSourcingModule import
    RoleModule, // Added RoleModule import
    PrequalificationModule, // Added PrequalificationModule import
    DirectModule, // Added DirectModule import
  ],
})
export class AppModule {}
