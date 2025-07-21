// backend/src/lead-generation-industry/dto/create-lead-generation-industry.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class CreateLeadGenerationIndustryDto {
  @IsString()
  industryType: string;

  @IsString()
  companySize: string;

  @IsString()
  cityCountry: string;

  @IsString()
  leadPriority: string;

  @IsNumber()
  userId: number;
}
