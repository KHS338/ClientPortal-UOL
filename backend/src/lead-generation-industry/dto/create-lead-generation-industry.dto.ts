// backend/src/lead-generation-industry/dto/create-lead-generation-industry.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLeadGenerationIndustryDto {
  @IsString()
  industryType: string;

  @IsString()
  companySize: string;

  @IsString()
  cityCountry: string;

  @IsString()
  leadPriority: string;

  @IsString()
  isRecruitmentAgency: string;

  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @IsOptional()
  @IsString()
  filePath?: string;

  @Type(() => Number)
  @IsNumber()
  userId: number;
}
