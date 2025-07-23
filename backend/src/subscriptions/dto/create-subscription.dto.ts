import { IsString, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  monthlyPrice?: number;

  @IsOptional()
  @IsString()
  monthlyPriceDisplay?: string;

  @IsOptional()
  @IsString()
  monthlyKey?: string;

  @IsOptional()
  @IsNumber()
  annualPrice?: number;

  @IsOptional()
  @IsString()
  annualPriceDisplay?: string;

  @IsOptional()
  @IsString()
  annualKey?: string;

  @IsOptional()
  @IsString()
  annualSavings?: string;

  @IsOptional()
  @IsNumber()
  adhocPrice?: number;

  @IsOptional()
  @IsString()
  adhocPriceDisplay?: string;

  @IsOptional()
  @IsString()
  adhocKey?: string;

  @IsOptional()
  @IsNumber()
  monthlyCredits?: number;

  @IsOptional()
  @IsNumber()
  annualCredits?: number;

  @IsOptional()
  @IsNumber()
  creditPrice?: number;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsOptional()
  @IsBoolean()
  isEnterprise?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
