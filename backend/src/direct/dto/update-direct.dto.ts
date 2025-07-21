// backend/src/direct/dto/update-direct.dto.ts
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class UpdateDirectDto {
  @IsOptional()
  @IsString()
  roleTitle?: string;

  @IsOptional()
  @IsString()
  rolePriority?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsNumber()
  salaryFrom?: number;

  @IsOptional()
  @IsNumber()
  salaryTo?: number;

  @IsOptional()
  @IsString()
  salaryCurrency?: string;

  @IsOptional()
  @IsString()
  salaryType?: string;

  @IsOptional()
  @IsBoolean()
  salaryNotDefined?: boolean;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  experienceRequired?: string;

  @IsOptional()
  @IsNumber()
  searchRadius?: number;

  @IsOptional()
  @IsString()
  directApproachMethod?: string;

  @IsOptional()
  @IsString()
  targetCompanies?: string;

  @IsOptional()
  @IsString()
  contactLevel?: string;
}
