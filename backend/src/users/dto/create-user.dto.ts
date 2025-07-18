// backend/src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsOptional, MinLength, MaxLength, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  companymail: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  companyName: string;

  @IsNotEmpty()
  @IsString()
  companySize: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
