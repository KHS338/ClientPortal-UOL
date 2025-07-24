// backend/src/prequalification/dto/create-prequalification.dto.ts
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreatePrequalificationDto {
  @IsString()
  roleTitle: string;

  @IsString()
  rolePriority: string;

  @IsString()
  location: string;

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

  @IsNumber()
  userId: number;
}
