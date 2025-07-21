// backend/src/lead-generation-job/dto/create-lead-generation-job.dto.ts
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateLeadGenerationJobDto {
  @IsString()
  jobTitle: string;

  @IsString()
  industryType: string;

  @IsString()
  companySize: string;

  @IsString()
  workType: string;

  @IsString()
  location: string;

  @IsString()
  experience: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsString()
  hiringUrgency: string;

  @IsNumber()
  userId: number;
}
