import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateUserSubscriptionDto {
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @IsNumber()
  @Type(() => Number)
  subscriptionId: number;

  @IsString()
  billingCycle: string; // 'monthly', 'annual', 'adhoc'

  @IsNumber()
  @Type(() => Number)
  paidAmount: number;

  @IsString()
  currency: string;

  @IsNumber()
  @Type(() => Number)
  totalCredits: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;

  @IsOptional()
  @IsString()
  paymentIntentId?: string;

  @IsOptional()
  @IsString()
  stripeSubscriptionId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
