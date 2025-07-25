import { IsNotEmpty, IsOptional, IsNumber, IsString, IsDateString, IsDecimal, IsJSON, IsEnum } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  userSubscriptionId: number;

  @IsOptional()
  @IsString()
  invoiceNumber?: string; // Will be auto-generated if not provided

  @IsOptional()
  @IsDateString()
  invoiceDate?: string; // Will default to current date

  @IsOptional()
  @IsDateString()
  dueDate?: string; // Will be calculated based on payment terms

  @IsNotEmpty()
  @IsNumber()
  subtotal: number;

  @IsOptional()
  @IsNumber()
  taxRate?: number; // Default to 8%

  @IsOptional()
  @IsNumber()
  taxAmount?: number; // Will be calculated

  @IsOptional()
  @IsNumber()
  total?: number; // Will be calculated

  @IsOptional()
  @IsString()
  currency?: string; // Default to USD

  @IsOptional()
  @IsEnum(['pending', 'paid', 'overdue', 'cancelled'])
  status?: string; // Default to pending

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  items?: any[]; // Invoice line items

  @IsOptional()
  billingAddress?: any; // Customer billing address

  @IsOptional()
  companyInfo?: any; // Company information
}
